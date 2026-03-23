import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileURLToPath } from "url";
import path from "path";
import {
  createAnonClient,
  createUserClient,
  supabaseAdmin,
  supabaseAdminReady,
  supabaseAnon,
  supabaseConfigReady,
} from "./supabaseClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const configuredOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(
  new Set([
    "https://lifewood-global.vercel.app",
    "http://localhost:5173",
    ...configuredOrigins,
  ]),
);
const configuredModel = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const modelFallbacks = [configuredModel, "gemini-2.0-flash-lite"];

app.use(
  cors(
    allowedOrigins.length
      ? {
          origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
              callback(null, true);
              return;
            }

            callback(null, false);
          },
          methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
          allowedHeaders: ["Content-Type", "Authorization"],
        }
      : undefined,
  ),
);
app.use(express.json());
const preScreeningSubmissionWindowMs = 2 * 60 * 1000;
const preScreeningMaxSubmissionsPerWindow = 4;
const preScreeningSubmissionTracker = new Map();

const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;
const calendlyPat = process.env.CALENDLY_PAT || "";
const calendlyOrgUri = process.env.CALENDLY_ORG_URI || "";

const resolveAuthToken = (req) => {
  const header = req.headers.authorization || "";
  if (header.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim();
  }
  return "";
};

const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ensureSupabaseConfigured = (res) => {
  if (!supabaseConfigReady) {
    res.status(500).json({
      error:
        "Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in server/.env.",
    });
    return false;
  }
  return true;
};

const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim();
const isValidBasicEmail = (value = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
const formatProfileNameFromEmail = (email = "") => {
  const localPart = String(email || "").split("@")[0];
  if (!localPart) return "User";
  return localPart
    .replace(/[._-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};
const normalizeInquiryStatus = (value = "", hasReply = false) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "reply sent" || normalized === "replied") return "Reply Sent";
  if (normalized === "pending" || normalized === "new") return "Pending";
  return hasReply ? "Reply Sent" : "Pending";
};
const extractCalendlyUuid = (uri = "") => {
  const cleaned = String(uri || "").split("?")[0].replace(/\/+$/, "");
  const parts = cleaned.split("/");
  return parts[parts.length - 1] || "";
};

const calendlyHeaders = () => ({
  authorization: `Bearer ${calendlyPat}`,
  "Content-Type": "application/json",
});

const calendlyGet = async (url) => {
  const response = await fetch(url, {
    headers: calendlyHeaders(),
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Calendly request failed (${response.status}): ${body || response.statusText}`);
  }
  return response.json();
};

const extractMeetingLinkFromPayload = (payload = {}) =>
  normalizeText(
    payload?.invitee?.cancel_url ||
      payload?.invitee?.reschedule_url ||
      payload?.event?.location?.join_url ||
      payload?.event?.location?.location ||
      payload?.event?.location?.details ||
      payload?.location?.join_url ||
      payload?.location?.location ||
      payload?.location?.details,
  );

const extractLocationFromPayload = (payload = {}) =>
  normalizeText(
    payload?.event?.location?.location ||
      payload?.event?.location?.details ||
      payload?.event?.location?.join_url ||
      payload?.location?.location ||
      payload?.location?.details ||
      payload?.location?.join_url,
  );

const isMissingColumnError = (error) =>
  error?.code === "42703" ||
  error?.code === "PGRST204" ||
  /column/i.test(String(error?.message || ""));

const isMissingTableOrColumnError = (error) =>
  error?.code === "42P01" || isMissingColumnError(error);

const logAdminActivity = async (activity = "", actor = "") => {
  const normalizedActivity = normalizeText(activity);
  if (!supabaseAdminReady || !normalizedActivity) return;

  const result = await supabaseAdmin
    .from("admin_activity_logs")
    .insert({
      activity: normalizedActivity,
      actor: normalizeText(actor) || null,
    });

  if (result.error && !isMissingTableOrColumnError(result.error)) {
    console.error("[admin-activity-log-failed]", result.error);
  }
};

const syncCalendlyBookings = async () => {
  if (!supabaseAdminReady) {
    return { skipped: true, reason: "Supabase service role key not configured." };
  }

  if (!calendlyPat || !calendlyOrgUri) {
    return { skipped: true, reason: "Calendly credentials are not configured." };
  }

  const minStartTime = new Date();
  minStartTime.setDate(minStartTime.getDate() - 30);

  const scheduledEventsUrl =
    `https://api.calendly.com/scheduled_events?organization=${encodeURIComponent(calendlyOrgUri)}` +
    `&status=active&count=100&min_start_time=${encodeURIComponent(minStartTime.toISOString())}`;

  const eventsPayload = await calendlyGet(scheduledEventsUrl);
  const events = Array.isArray(eventsPayload?.collection) ? eventsPayload.collection : [];

  let existingRows = [];
  let useLegacyBookingSchema = false;
  const existingResult = await supabaseAdmin
    .from("calendly_bookings")
    .select("id,event_uri,invitee_uri,event,invitee,start_time,end_time");

  if (!existingResult.error && Array.isArray(existingResult.data)) {
    existingRows = existingResult.data;
  } else if (isMissingColumnError(existingResult.error)) {
    useLegacyBookingSchema = true;
    const legacyExistingResult = await supabaseAdmin
      .from("calendly_bookings")
      .select("id,event,invitee,start_time,end_time");
    if (!legacyExistingResult.error && Array.isArray(legacyExistingResult.data)) {
      existingRows = legacyExistingResult.data;
    }
  }

  const existingByKey = new Map(
    existingRows.map((row) => {
      if (useLegacyBookingSchema) {
        return [`${row.event || ""}::${row.invitee || ""}::${row.start_time || ""}::${row.end_time || ""}`, row.id];
      }
      return [`${row.event_uri || ""}::${row.invitee_uri || ""}`, row.id];
    }),
  );
  let inserted = 0;
  let updated = 0;
  let processedEvents = 0;
  let processedInvitees = 0;

  for (const eventItem of events) {
    processedEvents += 1;
    const eventUri = eventItem?.uri || "";
    const eventUuid = extractCalendlyUuid(eventUri);
    if (!eventUuid) continue;

    let eventDetails = eventItem;
    try {
      const eventDetailsPayload = await calendlyGet(`https://api.calendly.com/scheduled_events/${eventUuid}`);
      eventDetails = eventDetailsPayload?.resource || eventItem;
    } catch (_error) {
      eventDetails = eventItem;
    }

    let invitees = [];
    try {
      const inviteesPayload = await calendlyGet(`https://api.calendly.com/scheduled_events/${eventUuid}/invitees`);
      invitees = Array.isArray(inviteesPayload?.collection) ? inviteesPayload.collection : [];
    } catch (_error) {
      invitees = [];
    }

    for (const inviteeItem of invitees) {
      processedInvitees += 1;
      const payload = { event: eventDetails, invitee: inviteeItem };
      const eventName = normalizeText(eventDetails?.name || eventItem?.name);
      const inviteeName = normalizeText(inviteeItem?.name);
      const location = normalizeText(extractLocationFromPayload(payload)) || null;
      const meetingUrl = normalizeText(extractMeetingLinkFromPayload(payload)) || null;
      const modernKey = `${eventUri}::${inviteeItem?.uri || ""}`;
      const legacyKey = `${eventName || ""}::${inviteeName || ""}::${eventDetails?.start_time || eventItem?.start_time || ""}::${eventDetails?.end_time || eventItem?.end_time || ""}`;
      const normalizedRecord = {
        event_uri: eventUri,
        invitee_uri: inviteeItem?.uri || null,
        event_name: eventName,
        invitee_name: inviteeName,
        invitee_email: normalizeText(inviteeItem?.email).toLowerCase() || null,
        start_time: eventDetails?.start_time || eventItem?.start_time || null,
        end_time: eventDetails?.end_time || eventItem?.end_time || null,
        status: normalizeText(eventDetails?.status || eventItem?.status || inviteeItem?.status) || "active",
        timezone: normalizeText(eventDetails?.start_time_timezone || eventItem?.start_time_timezone || inviteeItem?.timezone || eventDetails?.timezone || eventItem?.timezone) || null,
        location,
        meeting_url: meetingUrl,
        payload,
      };
      const legacyRecord = {
        event: eventName || "Booking",
        invitee: inviteeName || null,
        start_time: normalizedRecord.start_time,
        end_time: normalizedRecord.end_time,
        location,
        meeting_url: meetingUrl,
        status: normalizedRecord.status,
      };
      const lookupKey = useLegacyBookingSchema ? legacyKey : modernKey;

      if (existingByKey.has(lookupKey)) {
        let updateResult = await supabaseAdmin
          .from("calendly_bookings")
          .update(useLegacyBookingSchema ? legacyRecord : normalizedRecord)
          .eq("id", existingByKey.get(lookupKey));
        if (isMissingColumnError(updateResult.error) && !useLegacyBookingSchema) {
          useLegacyBookingSchema = true;
          updateResult = await supabaseAdmin
            .from("calendly_bookings")
            .update(legacyRecord)
            .eq("id", existingByKey.get(lookupKey));
        }
        if (updateResult.error) throw updateResult.error;
        updated += 1;
      } else {
        let insertResult = await supabaseAdmin
          .from("calendly_bookings")
          .insert(useLegacyBookingSchema ? legacyRecord : normalizedRecord)
          .select("id")
          .single();

        if (isMissingColumnError(insertResult.error) && !useLegacyBookingSchema) {
          useLegacyBookingSchema = true;
          insertResult = await supabaseAdmin
            .from("calendly_bookings")
            .insert(legacyRecord)
            .select("id")
            .single();
        }

        if (!insertResult.error && insertResult.data?.id) {
          existingByKey.set(useLegacyBookingSchema ? legacyKey : modernKey, insertResult.data.id);
          inserted += 1;
        } else if (insertResult.error) {
          throw insertResult.error;
        }
      }
    }
  }

  return {
    skipped: false,
    processedEvents,
    processedInvitees,
    inserted,
    updated,
    totalRowsSeen: existingByKey.size,
  };
};

const countWords = (value = "") => {
  const cleaned = normalizeText(value);
  if (!cleaned) return 0;
  return cleaned.split(" ").filter(Boolean).length;
};

const analyzePreScreeningIntegrity = ({ responses = [], telemetry = {} }) => {
  const normalizedAnswers = responses.map((item) => normalizeText(item?.answer || ""));
  const answerWordCounts = normalizedAnswers.map((answer) => countWords(answer));
  const totalWords = answerWordCounts.reduce((sum, value) => sum + value, 0);

  let suspicionScore = 0;
  const signals = [];

  const tabSwitches = Number(telemetry?.tabSwitches || 0);
  const pasteAttempts = Number(telemetry?.pasteAttempts || 0);
  const droppedAttempts = Number(telemetry?.droppedAttempts || 0);

  if (pasteAttempts > 0) {
    suspicionScore += 30;
    signals.push(`Paste blocked attempts: ${pasteAttempts}`);
  }
  if (droppedAttempts > 0) {
    suspicionScore += 10;
    signals.push(`Drop attempts: ${droppedAttempts}`);
  }
  if (tabSwitches >= 3) {
    suspicionScore += 20;
    signals.push(`Tab switches detected: ${tabSwitches}`);
  }

  const uniqueWords = new Set(
    normalizedAnswers
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
  );
  const uniqueWordRatio = totalWords > 0 ? uniqueWords.size / totalWords : 0;
  if (totalWords > 0 && uniqueWordRatio < 0.28) {
    suspicionScore += 10;
    signals.push(`Low lexical variety (ratio ${uniqueWordRatio.toFixed(2)})`);
  }

  const repeatedStarts = normalizedAnswers
    .map((answer) => answer.split(" ").slice(0, 6).join(" ").toLowerCase())
    .filter(Boolean);
  const repeatedStartCount = repeatedStarts.length - new Set(repeatedStarts).size;
  if (repeatedStartCount >= 2) {
    suspicionScore += 10;
    signals.push("Multiple answers share the same opening phrase");
  }

  const veryShortAnswers = answerWordCounts.filter((value) => value < 50).length;
  if (veryShortAnswers > 0) {
    suspicionScore += 25;
    signals.push(`Short answers below 50 words: ${veryShortAnswers}`);
  }

  suspicionScore = Math.max(0, Math.min(100, suspicionScore));
  const riskLevel = suspicionScore >= 70 ? "high" : suspicionScore >= 40 ? "medium" : "low";

  return {
    suspicionScore,
    riskLevel,
    totalWords,
    tabSwitches,
    pasteAttempts,
    droppedAttempts,
    signals,
  };
};

const parseJsonFromText = (text = "") => {
  try {
    return JSON.parse(text);
  } catch (_error) {
    const match = String(text || "").match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch (_nextError) {
      return null;
    }
  }
};

const buildHeuristicAiCheck = (responses = []) => {
  const genericPhrases = [
    "in today's",
    "in conclusion",
    "furthermore",
    "moreover",
    "it is important to note",
    "I would leverage",
    "I am passionate about",
    "as an ai",
    "overall,",
  ];

  const perAnswer = responses.map((item) => {
    const answer = String(item?.answer || "");
    const lower = answer.toLowerCase();
    const wordCount = countWords(answer);
    let score = 0;
    const reasons = [];

    const matchedGeneric = genericPhrases.filter((phrase) => lower.includes(phrase));
    if (matchedGeneric.length >= 2) {
      score += 20;
      reasons.push("Contains multiple generic AI-style connector phrases.");
    }

    const sentences = answer.split(/[.!?]+/).map((value) => value.trim()).filter(Boolean);
    if (sentences.length >= 3) {
      const avgSentenceLength = wordCount / sentences.length;
      if (avgSentenceLength > 28) {
        score += 10;
        reasons.push("Long uniform sentence structures.");
      }
    }

    const words = lower.split(/[^a-z0-9]+/).filter(Boolean);
    const uniqueRatio = words.length ? new Set(words).size / words.length : 0;
    if (words.length > 40 && uniqueRatio < 0.35) {
      score += 12;
      reasons.push("Low lexical variety for a long response.");
    }

    if (!/\d/.test(answer) && !/\b(i|my|me|we)\b/i.test(answer)) {
      score += 10;
      reasons.push("Limited personal specificity (few first-person markers or concrete details).");
    }

    score = Math.max(0, Math.min(100, score));
    return {
      id: item?.id || "",
      aiLikelihoodScore: score,
      isLikelyAi: score >= 60,
      reason: reasons.join(" ") || "No strong AI indicators found by fallback heuristic.",
    };
  });

  const overallScore = perAnswer.length
    ? Math.round(perAnswer.reduce((sum, entry) => sum + entry.aiLikelihoodScore, 0) / perAnswer.length)
    : 0;

  return {
    provider: "heuristic-fallback",
    overallAiLikelihoodScore: overallScore,
    overallVerdict: overallScore >= 70 ? "high" : overallScore >= 45 ? "medium" : "low",
    perAnswer,
  };
};

const runAiAnswerCheck = async ({ responses = [] }) => {
  if (!responses.length) {
    return {
      provider: "none",
      overallAiLikelihoodScore: 0,
      overallVerdict: "low",
      perAnswer: [],
    };
  }

  if (!genAI) {
    return buildHeuristicAiCheck(responses);
  }

  const compactResponses = responses.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }));

  const prompt = `
You are an interview integrity evaluator.
Classify each answer for likelihood of AI-generated writing.
Return strict JSON only with this shape:
{
  "overallAiLikelihoodScore": number,
  "overallVerdict": "low" | "medium" | "high",
  "perAnswer": [
    { "id": "string", "aiLikelihoodScore": number, "isLikelyAi": boolean, "reason": "string" }
  ]
}
Scoring guide:
- 0 means likely human-authentic.
- 100 means highly likely AI-generated.
Use linguistic and stylistic evidence only.
Keep reasons concise.
Input:
${JSON.stringify(compactResponses)}
`;

  try {
    let rawText = "";
    for (const modelName of [...new Set(modelFallbacks)]) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        rawText = response.text();
        if (rawText) break;
      } catch (_modelError) {
        // try fallback model
      }
    }

    const parsed = parseJsonFromText(rawText);
    if (!parsed || !Array.isArray(parsed.perAnswer)) {
      return buildHeuristicAiCheck(responses);
    }

    const perAnswer = responses.map((item) => {
      const matched = parsed.perAnswer.find((entry) => String(entry.id) === String(item.id)) || {};
      const score = Math.max(0, Math.min(100, Number(matched.aiLikelihoodScore || 0)));
      return {
        id: item.id,
        aiLikelihoodScore: score,
        isLikelyAi: Boolean(matched.isLikelyAi || score >= 60),
        reason: normalizeText(matched.reason || "No reason provided by model."),
      };
    });

    const overall = Math.max(
      0,
      Math.min(100, Number(parsed.overallAiLikelihoodScore || 0)),
    );

    return {
      provider: "gemini",
      overallAiLikelihoodScore: overall,
      overallVerdict:
        parsed.overallVerdict === "high" || parsed.overallVerdict === "medium"
          ? parsed.overallVerdict
          : "low",
      perAnswer,
    };
  } catch (_error) {
    return buildHeuristicAiCheck(responses);
  }
};

const buildPreScreeningSummary = ({ integrity, responseCount }) => {
  const riskLabel =
    integrity.riskLevel === "high"
      ? "High"
      : integrity.riskLevel === "medium"
        ? "Medium"
        : "Low";
  const signalText = integrity.signals.length
    ? integrity.signals.join("; ")
    : "No major risk signals were detected.";

  return [
    `Pre-screening completed (${responseCount} responses).`,
    `Integrity Risk: ${riskLabel} (${integrity.suspicionScore}/100).`,
    `Signals: ${signalText}`,
  ].join(" ");
};

const extractPdfTextFromBuffer = (buffer) => {
  const binary = buffer.toString("latin1");
  const chunks = [];
  const tjRegex = /\(([^)]*)\)\s*Tj/g;
  let tjMatch = tjRegex.exec(binary);
  while (tjMatch) {
    const decoded = tjMatch[1]
      .replace(/\\\(/g, "(")
      .replace(/\\\)/g, ")")
      .replace(/\\n/g, " ")
      .replace(/\\r/g, " ")
      .replace(/\\t/g, " ");
    chunks.push(decoded);
    tjMatch = tjRegex.exec(binary);
  }
  const joined = chunks.join(" ").replace(/\s+/g, " ").trim();
  if (joined) return joined;
  return buffer
    .toString("utf8")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const fetchResumeText = async (url = "") => {
  const source = normalizeText(url);
  if (!source) return "";
  try {
    const response = await fetch(source);
    if (!response.ok) return "";
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/pdf")) {
      const arr = await response.arrayBuffer();
      return extractPdfTextFromBuffer(Buffer.from(arr)).slice(0, 12000);
    }
    const text = await response.text();
    return normalizeText(text).slice(0, 12000);
  } catch (_error) {
    return "";
  }
};

const summarizePreScreening = (rawValue) => {
  if (!rawValue) return "No pre-screening results available.";
  try {
    const parsed = typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
    const integrity = parsed?.integrity || {};
    const aiCheck = parsed?.aiCheck || {};
    const responseCount = Array.isArray(parsed?.responses) ? parsed.responses.length : 0;
    return [
      `Pre-screening responses: ${responseCount}.`,
      `Integrity risk: ${integrity?.riskLevel || "unknown"} (${integrity?.suspicionScore ?? "n/a"}/100).`,
      aiCheck?.overallVerdict
        ? `AI-authenticity likelihood: ${aiCheck.overallVerdict} (${aiCheck?.overallAiLikelihoodScore ?? "n/a"}/100).`
        : "AI-authenticity likelihood: unavailable.",
    ].join(" ");
  } catch (_error) {
    return String(rawValue).slice(0, 1000);
  }
};

const analyzePreScreeningHeuristically = (rawValue) => {
  if (!rawValue) {
    return {
      summary: "The applicant has not completed the pre-screening interview yet, so there is no behavioral evidence to support a hiring verdict.",
      averageWords: 0,
      responseCount: 0,
      strongestSignals: [],
      concerns: ["Pre-screening interview not completed."],
      recommendationImpact: "This keeps the application below final interview readiness.",
    };
  }

  try {
    const parsed = typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
    const responses = Array.isArray(parsed?.responses) ? parsed.responses : [];
    const integrity = parsed?.integrity || {};
    const totalWords = responses.reduce((sum, item) => sum + countWords(item?.answer || ""), 0);
    const averageWords = responses.length ? Math.round(totalWords / responses.length) : 0;

    const keywordGroups = [
      ["integrity", "ethical", "honest", "accountable", "transparency"],
      ["innovation", "improve", "process", "automation", "solution"],
      ["diversity", "background", "inclusive", "stakeholder", "collaborate"],
      ["community", "impact", "sustainability", "mission", "vision"],
      ["support", "care", "mentor", "helped", "colleague"],
    ];

    const normalizedAnswers = responses.map((item) => normalizeText(item?.answer || "").toLowerCase());
    const matchedSignals = [];

    keywordGroups.forEach((group) => {
      if (normalizedAnswers.some((answer) => group.some((keyword) => answer.includes(keyword)))) {
        matchedSignals.push(group[0]);
      }
    });

    const concerns = [];
    if (!responses.length) concerns.push("No usable responses were captured.");
    if (averageWords < 45) concerns.push("Several answers are brief and may not provide enough evidence.");
    if ((integrity?.suspicionScore ?? 0) >= 50) {
      concerns.push(`Integrity telemetry shows elevated risk (${integrity.suspicionScore}/100).`);
    }

    const strengths = [];
    if (averageWords >= 70) strengths.push("Answers include enough detail to assess judgment and communication.");
    if (matchedSignals.includes("integrity")) strengths.push("Responses reference ethics, accountability, or trust.");
    if (matchedSignals.includes("innovation")) strengths.push("Responses show process improvement or problem-solving.");
    if (matchedSignals.includes("community")) strengths.push("Responses connect work to mission, impact, or sustainability.");
    if (matchedSignals.includes("support")) strengths.push("Responses show care for colleagues and teamwork.");

    const recommendationImpact =
      concerns.length > 1
        ? "Pre-screening content introduces risk and lowers confidence in moving to a final interview."
        : strengths.length
          ? "Pre-screening content supports progression because the applicant demonstrates alignment with Lifewood values."
          : "Pre-screening content is neutral and should be weighed with the CV review.";

    return {
      summary: [
        `The applicant completed ${responses.length} pre-screening responses with an average of ${averageWords} words per answer.`,
        strengths.length ? `Positive indicators: ${strengths.join(" ")}` : "",
        concerns.length ? `Concerns: ${concerns.join(" ")}` : "",
        recommendationImpact,
      ].filter(Boolean).join(" "),
      averageWords,
      responseCount: responses.length,
      strongestSignals: strengths,
      concerns,
      recommendationImpact,
    };
  } catch (_error) {
    return {
      summary: summarizePreScreening(rawValue),
      averageWords: 0,
      responseCount: 0,
      strongestSignals: [],
      concerns: [],
      recommendationImpact: "Pre-screening data could not be parsed cleanly.",
    };
  }
};

const extractPreScreeningEvidence = (rawValue) => {
  if (!rawValue) return { combinedText: "", responses: [] };
  try {
    const parsed = typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
    const responses = Array.isArray(parsed?.responses) ? parsed.responses : [];
    const combinedText = responses
      .map((item) => `${item?.question || ""} ${item?.answer || ""}`.trim())
      .join(" ");
    return { combinedText: normalizeText(combinedText), responses };
  } catch (_error) {
    return { combinedText: normalizeText(String(rawValue)), responses: [] };
  }
};

const SEMANTIC_SKILL_GROUPS = [
  {
    label: "leadership and supervision",
    aliases: ["leadership", "team lead", "team leader", "supervisor", "supervisory", "people management", "staff management", "managed team", "line management"],
  },
  {
    label: "operations or production management",
    aliases: ["operations management", "operations", "production management", "production", "manufacturing", "plant operations", "workflow management", "production workflow"],
  },
  {
    label: "process improvement",
    aliases: ["process improvement", "continuous improvement", "lean", "six sigma", "efficiency", "optimize", "optimization", "streamline", "productivity improvement"],
  },
  {
    label: "project ownership and execution",
    aliases: ["project management", "project ownership", "owned project", "delivered project", "implementation", "execution", "cross-functional", "stakeholder management"],
  },
  {
    label: "performance metrics and KPI management",
    aliases: ["kpi", "sla", "metric", "metrics", "performance", "throughput", "yield", "quality target", "cost reduction", "productivity", "output"],
  },
  {
    label: "quality and compliance",
    aliases: ["quality", "qa", "compliance", "audit", "standard operating procedure", "sop", "risk control"],
  },
  {
    label: "planning and scheduling",
    aliases: ["planning", "scheduling", "capacity planning", "resource planning", "forecasting", "shift planning"],
  },
  {
    label: "data operations and reporting",
    aliases: ["reporting", "analysis", "dashboard", "data operations", "data management", "excel", "erp", "sap"],
  },
];

const EXPERIENCE_PATTERNS = [
  /(\d{1,2})\+?\s+years?/gi,
  /over\s+(\d{1,2})\s+years?/gi,
  /(\d{1,2})\s+yrs?/gi,
];

const getHighestYearsMention = (value = "") => {
  let highest = 0;
  EXPERIENCE_PATTERNS.forEach((pattern) => {
    const matches = value.matchAll(pattern);
    for (const match of matches) {
      const years = Number(match[1] || 0);
      if (Number.isFinite(years) && years > highest) highest = years;
    }
  });
  return highest;
};

const escapeRegExp = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const countSemanticMatches = (text = "", aliases = []) =>
  aliases.reduce((count, alias) => {
    const pattern = new RegExp(`\\b${escapeRegExp(alias.toLowerCase())}\\b`, "i");
    return pattern.test(text) ? count + 1 : count;
  }, 0);

const hasAnyPattern = (text = "", patterns = []) => patterns.some((pattern) => pattern.test(text));

const scoreToBandLabel = (score = 0) => {
  if (score <= 30) return "Weak Fit";
  if (score <= 60) return "Moderate Fit";
  if (score <= 85) return "Strong Fit";
  return "Excellent Fit";
};

const recommendationFromScore = (score = 0) => {
  if (score >= 86) return "Highly Recommended";
  if (score >= 61) return "Recommended";
  if (score >= 31) return "Consider with Review";
  return "Not Recommended";
};

const buildStructuredAnalysis = ({
  bandLabel,
  role,
  score,
  strengths = [],
  gaps = [],
  recommendation,
}) => [
  `Overall Fit Summary: ${bandLabel}. The applicant shows ${score >= 61 ? "relevant" : score >= 31 ? "partially relevant" : "limited"} alignment with ${role || "the target role"}. ${score >= 61 ? "Their background reflects meaningful overlap with the role's responsibilities and operating environment." : score >= 31 ? "The profile includes some transferable strengths, but the evidence is not yet complete across all critical requirements." : "Core role requirements are not sufficiently evidenced in the resume, which lowers confidence in direct fit."}`,
  `Strengths Identified: ${strengths.length ? strengths.join("; ") : "No clear strengths were strongly evidenced from the available resume text."}`,
  `Gaps or Missing Areas: ${gaps.length ? gaps.join("; ") : "No major gaps were identified from the available information."}`,
  `Recommendation: ${recommendation}. ${score >= 61 ? "This candidate appears suitable for further evaluation, with interview questions focused on depth, scale, and measurable impact." : score >= 31 ? "This candidate may still be worth reviewing if the team is open to adjacent or transferable experience." : "Further progression should depend on stronger evidence of role-specific experience, leadership scope, and measurable results."}`,
].join("\n\n");

const buildCvAnalysisText = ({ role = "", roleFit }) => {
  const bandLabel = roleFit.bandLabel || scoreToBandLabel(roleFit.score);
  const overallFitLine =
    bandLabel === "Excellent Fit"
      ? `Excellent alignment with ${role || "the target role"}. The profile reflects direct operational ownership, leadership, and measurable delivery impact.`
      : bandLabel === "Strong Fit"
        ? `Strong alignment with ${role || "the target role"}. Experience reflects operations management, process improvement, and performance tracking relevant to the role.`
        : bandLabel === "Moderate Fit"
          ? `Moderate alignment with ${role || "the target role"}. The candidate shows transferable operational and leadership experience, though some role depth still needs validation.`
          : `Weak alignment with ${role || "the target role"}. The available evidence does not yet show enough role-specific depth or responsibility scope.`;

  return [
    `Match Score: ${roleFit.score}%`,
    `Recommendation: ${roleFit.recommendation}`,
    "",
    "CV Analysis",
    "",
    "Overall Fit",
    overallFitLine,
    "",
    "Key Strengths",
    roleFit.strengths?.length
      ? roleFit.strengths.map((item) => `- ${item}`).join("\n")
      : "- No strong evidence identified from the available CV text.",
    "",
    "Gaps Identified",
    roleFit.gaps?.length
      ? roleFit.gaps.map((item) => `- ${item}`).join("\n")
      : "- No major gaps identified from the available CV text.",
  ].join("\n");
};

const buildPreScreeningAnalysisText = ({ payload, heuristic }) => {
  const responses = Array.isArray(payload?.responses) ? payload.responses : [];
  const integrity = payload?.integrity || {};
  const aiCheck = payload?.aiCheck || {};
  const averageWords = heuristic?.averageWords || 0;
  const detailedResponses = responses.filter((item) => countWords(item?.answer || "") >= 35).length;
  const responseQuality =
    detailedResponses >= 3
      ? "Answers are detailed and structured enough to assess decision-making and communication."
      : averageWords >= 35
        ? "Answers provide usable context, though some responses would benefit from more operating detail."
        : "Answers are relatively brief and should be validated further in interview.";

  const joined = normalizeText(responses.map((item) => item.answer || "").join(" ")).toLowerCase();
  const behavioralIndicators = [];
  if (/(support|mentor|guide|team|workload|colleague)/i.test(joined)) behavioralIndicators.push("Leadership shown through team supervision, coordination, or support actions");
  if (/(improve|optimi[sz]e|checkpoint|dashboard|error|rework|delivery)/i.test(joined)) behavioralIndicators.push("Problem-solving and process improvement mindset is evident");
  if (/(integrity|quality|ethical|transparency|standards|client appreciated)/i.test(joined)) behavioralIndicators.push("Strong accountability and ethical decision-making are evident");
  if (/(community|impact|sustainability|fair work|talent development)/i.test(joined)) behavioralIndicators.push("Alignment with mission, impact, and sustainability values is present");

  const consistency =
    heuristic?.concerns?.length
      ? "Responses are mostly aligned across leadership, quality, and integrity themes, but some points may still need validation for depth."
      : "Responses are consistent across leadership, quality, process improvement, and integrity themes.";

  const authenticity =
    aiCheck?.overallAiLikelihoodScore >= 70
      ? "Responses are highly polished and structured. There is elevated likelihood of AI assistance, so follow-up validation is recommended."
      : aiCheck?.overallAiLikelihoodScore >= 40
        ? "Responses are structured and polished. There is moderate likelihood of AI assistance, but they remain relevant and experience-based."
        : "Responses appear experience-based and contextually grounded, with low apparent risk of heavy AI assistance.";

  const concerns = [
    ...(heuristic?.concerns || []),
    ...(averageWords < 35 ? ["Some answers could use more concrete examples or operating detail."] : []),
  ];

  const finalVerdict =
    integrity?.suspicionScore >= 70 || aiCheck?.overallAiLikelihoodScore >= 85
      ? "Needs further validation"
      : behavioralIndicators.length >= 3
        ? "Supports progression to the next stage"
        : "Provides moderate support and should be validated in interview";

  return [
    "Pre-Screening Analysis",
    "",
    "Response Quality",
    responseQuality,
    "",
    "Behavioral Indicators",
    behavioralIndicators.length ? behavioralIndicators.map((item) => `- ${item}`).join("\n") : "- Limited evidence extracted from responses.",
    "",
    "Consistency",
    consistency,
    "",
    "Authenticity Check",
    authenticity,
    "",
    "Concerns",
    concerns.length ? concerns.map((item) => `- ${item}`).join("\n") : "- No major concerns identified from the current responses.",
    "",
    "Final Verdict",
    finalVerdict,
  ].join("\n");
};

const recommendationFromFinalScore = ({ finalScore, preScreeningScore }) => {
  if (finalScore <= 30) {
    return preScreeningScore >= 70 ? "Recommended with Reservations" : "Not Recommended";
  }
  if (finalScore <= 50) return "Recommended with Reservations";
  if (finalScore <= 75) return "Recommended";
  return "Strongly Recommended";
};

const buildFinalEvaluationText = ({ finalScore, recommendation, cvAnalysisText, preScreeningAnalysisText }) => [
  `Match Score: ${finalScore}%`,
  `Recommendation: ${recommendation}`,
  "",
  cvAnalysisText.replace(/^Match Score:.*\nRecommendation:.*\n\n/, ""),
  "",
  preScreeningAnalysisText,
  "",
  "Final Evaluation",
  "",
  "Insight",
  finalScore >= 76
    ? "The candidate shows strong combined technical and behavioral alignment for progression."
    : finalScore >= 51
      ? "The candidate shows balanced potential, with meaningful evidence from both technical and behavioral evaluation."
      : finalScore >= 31
        ? "The candidate shows some potential, but interview validation is needed to confirm depth and consistency."
        : "The current evidence indicates meaningful gaps that weaken progression confidence.",
  "",
  "Final Verdict",
  recommendation,
].join("\n");

const computePreScreeningScore = ({ payload, heuristic }) => {
  const responses = Array.isArray(payload?.responses) ? payload.responses : [];
  const aiLikelihood = Number(payload?.aiCheck?.overallAiLikelihoodScore || 0);
  const integrityScore = Number(payload?.integrity?.suspicionScore || 0);
  const averageWords = heuristic?.averageWords || 0;
  const strongSignals = heuristic?.strongestSignals || [];

  let score = 35;
  if (responses.length >= 5) score += 10;
  if (averageWords >= 35) score += 10;
  if (averageWords >= 55) score += 5;
  if (strongSignals.length >= 2) score += 15;
  if (strongSignals.length >= 4) score += 10;
  if (/(reduced|improved|increased|delivery|rework|quality|integrity|support|team)/i.test(
    responses.map((item) => item?.answer || "").join(" "),
  )) score += 10;

  score -= Math.min(25, Math.round(aiLikelihood / 5));
  score -= Math.min(20, Math.round(integrityScore / 6));

  return Math.max(0, Math.min(100, score));
};

const logRoleFitDebug = ({ role, heuristic, aiScore, finalScore, reason }) => {
  console.info("[role-fit-debug]", JSON.stringify({
    role,
    heuristicScore: heuristic.score,
    aiScore,
    finalScore,
    reason,
    debug: heuristic.debug || {},
  }));
};

const buildHeuristicRoleFit = ({ role = "", description = "", resumeText = "", supplementalText = "" }) => {
  const profile = `${role} ${description}`.toLowerCase();
  const combinedEvidenceText = normalizeText(`${resumeText} ${supplementalText}`).toLowerCase();
  const yearsOfExperience = getHighestYearsMention(`${resumeText} ${supplementalText}`);
  const hasEducationEvidence = /(bachelor|bs|ba|master|phd|degree|university|college)/i.test(`${resumeText} ${supplementalText}`);
  const hasAchievementEvidence = /(\d+\s*%|percent|reduced by|improved by|increased to|improved to|faster|rework|delivery rate|accuracy|sla|kpi|yield)/i.test(`${resumeText} ${supplementalText}`);
  const hasLeadershipActions = hasAnyPattern(combinedEvidenceText, [
    /\b(team lead|team leader|supervisor|manager|managed team|oversaw|mentored|coached)\b/i,
    /\b(supported a colleague|supported a team member|paired him|paired her|checked in regularly)\b/i,
    /\b(adjusted (his|her|their)?\s*workload|guided and encourage|guide and encourage)\b/i,
  ]);
  const hasOperationalResponsibility = hasAnyPattern(combinedEvidenceText, [
    /\b(operations|production|workflow|annotation coordination|cross-team|cross functional|delivery)\b/i,
    /\b(qa checkpoint|quality check|quality control|dashboard|error trends|validation steps)\b/i,
  ]);
  const hasProcessImprovementEvidence = hasAnyPattern(combinedEvidenceText, [
    /\b(process improvement|improved process|optimi[sz]ed|streamlined|efficiency|qa checkpoint|dashboard)\b/i,
    /\b(rework was reduced|turnaround time improved|on-time delivery increased)\b/i,
  ]);

  const relevantGroups = SEMANTIC_SKILL_GROUPS.filter((group) =>
    countSemanticMatches(profile, group.aliases) > 0 || countSemanticMatches((role || "").toLowerCase(), group.aliases) > 0,
  );
  const groupsToScore = relevantGroups.length ? relevantGroups : SEMANTIC_SKILL_GROUPS.slice(0, 6);
  const matchedGroups = groupsToScore.filter((group) => countSemanticMatches(combinedEvidenceText, group.aliases) > 0);

  const semanticScore = groupsToScore.length ? Math.round((matchedGroups.length / groupsToScore.length) * 45) : 20;
  const experienceScore = Math.min(20, yearsOfExperience * 2);
  const leadershipScore = hasLeadershipActions ? 20 : 0;
  const ownershipScore = countSemanticMatches(combinedEvidenceText, ["owned", "implemented", "delivered", "launched", "coordinated", "cross-functional", "handled operations"]) ? 10 : 0;
  const improvementScore = hasProcessImprovementEvidence ? 10 : 0;
  const educationScore = hasEducationEvidence ? 5 : 0;
  const achievementScore = hasAchievementEvidence ? 15 : 0;
  let score = semanticScore + experienceScore + leadershipScore + ownershipScore + improvementScore + educationScore + achievementScore;

  if (matchedGroups.length >= 3 && yearsOfExperience >= 5) score = Math.max(score, 64);
  if (matchedGroups.length >= 4 && leadershipScore && hasAchievementEvidence) score = Math.max(score, 72);
  if (leadershipScore > 0 && hasAchievementEvidence) score = Math.max(score, 50);
  if (hasLeadershipActions && hasProcessImprovementEvidence && hasAchievementEvidence) score = Math.max(score, 65);
  if (hasLeadershipActions && hasOperationalResponsibility && hasAchievementEvidence) score = Math.max(score, 68);
  if (matchedGroups.length === 0 && yearsOfExperience === 0 && !hasEducationEvidence) score = Math.min(score, 25);
  score = Math.max(0, Math.min(100, score));

  const recommendation = recommendationFromScore(score);
  const bandLabel = scoreToBandLabel(score);
  const strengths = [];
  if (yearsOfExperience >= 5) strengths.push(`Evidence of approximately ${yearsOfExperience} years of experience`);
  if (leadershipScore) strengths.push("Leadership or supervisory responsibility is evident");
  if (matchedGroups.length) strengths.push(`Relevant overlap in ${matchedGroups.map((group) => group.label).join(", ")}`);
  if (hasOperationalResponsibility || hasProcessImprovementEvidence) {
    strengths.push("Evidence of workflow control, quality management, or cross-team operational coordination");
  }
  if (hasAchievementEvidence) strengths.push("Resume includes achievement or KPI-oriented language");
  if (hasEducationEvidence) strengths.push("Education credentials are present");

  const missingGroups = groupsToScore.filter((group) => !matchedGroups.some((matched) => matched.label === group.label));
  const gaps = missingGroups.slice(0, 3).map((group) => `Limited evidence of ${group.label}`);
  if (!hasAchievementEvidence) gaps.push("Measurable results or KPI impact are not clearly stated");
  if (yearsOfExperience < 3) gaps.push("Experience depth appears limited for a senior role");
  const relevanceDetected =
    matchedGroups.length >= 2 ||
    (leadershipScore > 0 && yearsOfExperience >= 3) ||
    (countSemanticMatches(combinedEvidenceText, ["operations", "production", "workflow", "team", "process", "quality", "dashboard"]) >= 2 && yearsOfExperience >= 2) ||
    (hasLeadershipActions && hasAchievementEvidence) ||
    (hasOperationalResponsibility && hasProcessImprovementEvidence);

  return {
    score,
    recommendation,
    bandLabel,
    strengths,
    gaps,
    relevanceDetected,
    debug: {
      yearsOfExperience,
      matchedGroupLabels: matchedGroups.map((group) => group.label),
      missingGroupLabels: missingGroups.map((group) => group.label),
      supplementalTextUsed: Boolean(normalizeText(supplementalText)),
      leadershipScore,
      hasLeadershipActions,
      hasOperationalResponsibility,
      hasProcessImprovementEvidence,
      ownershipScore,
      improvementScore,
      educationScore,
      achievementScore,
      semanticScore,
      experienceScore,
      relevanceDetected,
    },
    cvSummary: buildStructuredAnalysis({
      bandLabel,
      role,
      score,
      strengths,
      gaps,
      recommendation,
    }),
  };
};

const reconcileRoleFitScore = ({ role, heuristic, aiScore }) => {
  const boundedAiScore = Number.isFinite(aiScore) ? Math.max(0, Math.min(100, aiScore)) : null;
  const hasStrongOperationalEvidence =
    Number(heuristic?.debug?.leadershipScore || 0) > 0 &&
    Number(heuristic?.debug?.achievementScore || 0) > 0 &&
    (
      Number(heuristic?.debug?.improvementScore || 0) > 0 ||
      (Array.isArray(heuristic?.debug?.matchedGroupLabels) &&
        heuristic.debug.matchedGroupLabels.some((label) =>
          ["operations or production management", "process improvement", "quality and compliance", "performance metrics and KPI management"].includes(label),
        ))
    );

  if (boundedAiScore === null) {
    const finalScore = hasStrongOperationalEvidence ? Math.max(60, heuristic.score) : heuristic.score;
    logRoleFitDebug({
      role,
      heuristic,
      aiScore: null,
      finalScore,
      reason: "AI score unavailable, using heuristic score",
    });
    return finalScore;
  }

  if (hasStrongOperationalEvidence) {
    const finalScore = Math.max(60, heuristic.score, Math.round((heuristic.score * 0.8) + (boundedAiScore * 0.2)));
    logRoleFitDebug({
      role,
      heuristic,
      aiScore: boundedAiScore,
      finalScore,
      reason: "Strong leadership, process, and measurable impact evidence detected; enforcing high-confidence floor",
    });
    return finalScore;
  }

  if (heuristic.relevanceDetected && boundedAiScore < 30) {
    const finalScore = Math.max(35, heuristic.score, Math.round((heuristic.score * 0.75) + (boundedAiScore * 0.25)));
    logRoleFitDebug({
      role,
      heuristic,
      aiScore: boundedAiScore,
      finalScore,
      reason: "Relevant experience detected; low AI score corrected to semantic baseline",
    });
    return finalScore;
  }

  if (heuristic.relevanceDetected && heuristic.score >= 50 && boundedAiScore + 20 < heuristic.score) {
    const finalScore = Math.round((heuristic.score * 0.65) + (boundedAiScore * 0.35));
    logRoleFitDebug({
      role,
      heuristic,
      aiScore: boundedAiScore,
      finalScore,
      reason: "AI score materially underweighted relevant heuristic evidence",
    });
    return finalScore;
  }

  const finalScore = Math.max(
    heuristic.relevanceDetected ? Math.min(heuristic.score, 45) : 0,
    Math.round((heuristic.score * 0.45) + (boundedAiScore * 0.55)),
  );
  if (finalScore <= 10 || boundedAiScore <= 10) {
    logRoleFitDebug({
      role,
      heuristic,
      aiScore: boundedAiScore,
      finalScore,
      reason: "Very low score path observed",
    });
  }
  return finalScore;
};

const runRoleFitAnalysis = async ({ role = "", description = "", resumeText = "", supplementalText = "" }) => {
  if (!resumeText) {
    return {
      score: 20,
      recommendation: "Needs Resume",
      cvSummary: "No readable resume content was found. Upload a readable PDF resume for proper evaluation.",
    };
  }

  const heuristic = buildHeuristicRoleFit({ role, description, resumeText, supplementalText });
  if (!genAI) return heuristic;

  const prompt = `
You are a strict hiring analyst for Lifewood.
Evaluate fit between the job and CV using semantics, context, transferable experience, leadership evidence, achievements, and responsibility scope.
Do not rely only on exact keyword overlap.
Do not give extreme low scores when the candidate shows clearly relevant experience using different wording or synonyms.
Use these score bands:
0-30 weak fit
31-60 moderate fit
61-85 strong fit
86-100 excellent fit
Return strict JSON only:
{
  "score": number,
  "recommendation": "Highly Recommended" | "Recommended" | "Consider with Review" | "Not Recommended",
  "cvSummary": "Use exactly this structure with plain text paragraphs: Overall Fit Summary: ... Strengths Identified: ... Gaps or Missing Areas: ... Recommendation: ..."
}
Job Role: ${role || "Unknown"}
Job Description:
${description || "No description"}
CV Content:
${resumeText.slice(0, 12000)}
Supplemental Candidate Evidence:
${supplementalText.slice(0, 6000)}
`;

  try {
    let rawText = "";
    for (const modelName of [...new Set(modelFallbacks)]) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        rawText = response.text();
        if (rawText) break;
      } catch (_modelError) {
        // try fallback model
      }
    }
    const parsed = parseJsonFromText(rawText);
    if (!parsed) return heuristic;

    const rawAiScore = Math.max(0, Math.min(100, Number(parsed.score || 0)));
    const score = reconcileRoleFitScore({
      role,
      heuristic,
      aiScore: rawAiScore,
    });
    const recommendationLabels = new Set([
      "Highly Recommended",
      "Recommended",
      "Consider with Review",
      "Not Recommended",
    ]);
    const recommendation = recommendationLabels.has(parsed.recommendation)
      ? recommendationFromScore(score)
      : recommendationFromScore(score);
    const shouldUseHeuristicSummary =
      score >= heuristic.score ||
      (heuristic.relevanceDetected && rawAiScore < 30) ||
      (Number(heuristic?.debug?.leadershipScore || 0) > 0 && Number(heuristic?.debug?.achievementScore || 0) > 0);
    return {
      score,
      recommendation,
      bandLabel: heuristic.bandLabel || scoreToBandLabel(score),
      strengths: heuristic.strengths || [],
      gaps: heuristic.gaps || [],
      cvSummary: shouldUseHeuristicSummary
        ? heuristic.cvSummary
        : parsed.cvSummary
          ? normalizeText(parsed.cvSummary)
          : heuristic.cvSummary,
    };
  } catch (_error) {
    return heuristic;
  }
};

const loadApplicationRoleContext = async (application) => {
  let listing = null;
  if (application.job_id) {
    const byId = await supabaseAdmin
      .from("job_listings")
      .select("id,title,description,overview,department,work_type")
      .eq("id", application.job_id)
      .maybeSingle();
    if (!byId.error && byId.data) listing = byId.data;
  }
  if (!listing && application.position_applied) {
    const byTitle = await supabaseAdmin
      .from("job_listings")
      .select("id,title,description,overview,department,work_type")
      .ilike("title", application.position_applied)
      .limit(1)
      .maybeSingle();
    if (!byTitle.error && byTitle.data) listing = byTitle.data;
  }

  const roleName = application.position_applied || application.role || listing?.title || "Unknown Role";
  const jobDescription = Array.isArray(listing?.overview) && listing.overview.length
    ? listing.overview.join(" ")
    : listing?.description || "";

  return { listing, roleName, jobDescription };
};

const persistAnalysisSnapshot = async (applicationId, updates, fallbackBase = {}) => {
  const { data: updated, error: updateError } = await supabaseAdmin
    .from("job_applications")
    .update(updates)
    .eq("id", applicationId)
    .select("*")
    .single();

  if (updateError) {
    console.error("[persist-analysis-failed]", updateError);
    return {
      updated: {
        ...fallbackBase,
        ...updates,
      },
      persisted: false,
    };
  }

  return { updated, persisted: true };
};

const generateCvOnlyEvaluation = async (application) => {
  const { roleName, jobDescription } = await loadApplicationRoleContext(application);
  const resumeText = await fetchResumeText(application.cv_url || "");
  const roleFit = await runRoleFitAnalysis({
    role: roleName,
    description: jobDescription,
    resumeText,
  });
  const combinedAnalysis = buildCvAnalysisText({ role: roleName, roleFit });
  const persisted = await persistAnalysisSnapshot(
    application.id,
    {
      ai_analysis: combinedAnalysis,
      ai_recommendation: roleFit.recommendation,
      score: roleFit.score,
    },
    application,
  );

  return {
    updated: persisted.updated,
    roleFit,
    combinedAnalysis,
    persisted: persisted.persisted,
  };
};

const generateFullEvaluation = async (application, preScreeningPayload) => {
  const { roleName, jobDescription } = await loadApplicationRoleContext(application);
  const resumeText = await fetchResumeText(application.cv_url || "");
  const resolvedPayload = typeof preScreeningPayload === "string"
    ? JSON.parse(preScreeningPayload)
    : (preScreeningPayload || {});
  const preScreeningEvidence = extractPreScreeningEvidence(resolvedPayload);
  const roleFit = await runRoleFitAnalysis({
    role: roleName,
    description: jobDescription,
    resumeText,
  });
  const preScreeningAnalysis = analyzePreScreeningHeuristically(resolvedPayload);
  const preScreeningScore = computePreScreeningScore({
    payload: resolvedPayload,
    heuristic: preScreeningAnalysis,
  });
  const finalScore = Math.round((roleFit.score * 0.6) + (preScreeningScore * 0.4));
  const fullRecommendation = recommendationFromFinalScore({
    finalScore,
    preScreeningScore,
  });
  const cvAnalysisText = buildCvAnalysisText({
    role: roleName,
    roleFit,
  });
  const preScreeningAnalysisText = buildPreScreeningAnalysisText({
    payload: resolvedPayload,
    heuristic: preScreeningAnalysis,
  });
  const combinedAnalysis = buildFinalEvaluationText({
    finalScore,
    recommendation: fullRecommendation,
    cvAnalysisText,
    preScreeningAnalysisText,
  });
  const payloadWithSnapshot = {
    ...resolvedPayload,
    analysisSnapshot: {
      cvScore: roleFit.score,
      preScreeningScore,
      finalScore,
      recommendation: fullRecommendation,
    },
  };

  const persisted = await persistAnalysisSnapshot(
    application.id,
    {
      pre_screening_results: JSON.stringify(payloadWithSnapshot),
      ai_analysis: combinedAnalysis,
      ai_recommendation: fullRecommendation,
      score: finalScore,
    },
    application,
  );

  return {
    updated: persisted.updated,
    roleFit: {
      ...roleFit,
      finalScore,
      preScreeningScore,
      recommendation: fullRecommendation,
    },
    preScreeningAnalysis,
    combinedAnalysis,
    persisted: persisted.persisted,
  };
};

app.post("/api/auth/login", async (req, res) => {
  try {
    if (!ensureSupabaseConfigured(res)) return;

    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const { data, error } = await supabaseAnon.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data?.session || !data?.user) {
      return res.status(401).json({
        error: "Invalid credentials.",
      });
    }

    let role = "user";
    if (supabaseAdminReady) {
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (!profileError && profileData?.role) {
        role = profileData.role;
      }
    }

    return res.status(200).json({
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        expires_in: data.session.expires_in,
      },
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      role,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Login failed. Please try again.",
    });
  }
});

app.post("/api/auth/logout", async (req, res) => {
  try {
    if (!ensureSupabaseConfigured(res)) return;

    const accessToken = resolveAuthToken(req);
    if (!accessToken) {
      return res.status(400).json({ error: "Missing access token." });
    }

    const userClient = createUserClient(accessToken);
    const { error } = await userClient.auth.signOut();

    if (error) {
      return res.status(500).json({ error: "Logout failed." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Logout failed." });
  }
});

app.patch("/api/admin/account", async (req, res) => {
  try {
    if (!ensureSupabaseConfigured(res)) return;

    const accessToken = resolveAuthToken(req);
    if (!accessToken) {
      return res.status(401).json({ error: "Missing access token." });
    }

    const name = normalizeText(req.body?.name || "");
    const password = String(req.body?.password || "");
    const currentPassword = String(req.body?.current_password || "");

    if (!name && !password) {
      return res.status(400).json({ error: "Nothing to update." });
    }

    const userClient = createUserClient(accessToken);
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return res.status(401).json({ error: "Invalid session." });
    }

    const updatePayload = {};
    if (name) {
      updatePayload.data = {
        name,
        full_name: name,
      };
    }
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters." });
      }
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password is required." });
      }
      const anonClient = createAnonClient();
      const { error: signInError } = await anonClient.auth.signInWithPassword({
        email: user.email || "",
        password: currentPassword,
      });
      if (signInError) {
        return res.status(401).json({ error: "Current password is incorrect." });
      }
      updatePayload.password = password;
    }

    const { data: updatedUserData, error: updateUserError } = await userClient.auth.updateUser(updatePayload);
    if (updateUserError) throw updateUserError;

    if (name && supabaseAdminReady) {
      let updateProfileResult = await supabaseAdmin
        .from("profiles")
        .update({ name })
        .eq("id", user.id)
        .select("id,name,email,role,created_at")
        .single();

      if (updateProfileResult.error && isMissingColumnError(updateProfileResult.error)) {
        updateProfileResult = { data: null, error: null };
      }

      if (updateProfileResult.error) throw updateProfileResult.error;
    }

    await logAdminActivity(
      password ? "Updated account profile and password" : "Updated account profile",
      name || formatProfileNameFromEmail(user.email || "")
    );

    return res.status(200).json({
      data: {
        id: user.id,
        email: updatedUserData?.user?.email || user.email || "",
        name:
          updatedUserData?.user?.user_metadata?.name ||
          updatedUserData?.user?.user_metadata?.full_name ||
          name ||
          formatProfileNameFromEmail(user.email),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update account." });
  }
});

app.get("/api/health", (_req, res) => {
  return res.status(200).json({
    ok: true,
    service: "lifewood-api",
    timestamp: new Date().toISOString(),
    routes: {
      preScreeningSubmit: "/api/pre-screening/submit",
      applicationSubmit: "/api/applications",
    },
  });
});

app.post("/api/applications", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({
        error: "Supabase service role key not configured on server.",
      });
    }

    const payload = req.body || {};
    const email = normalizeText(payload.email).toLowerCase();
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const insertPayload = {
      first_name: normalizeText(payload.first_name),
      middle_name: normalizeText(payload.middle_name),
      last_name: normalizeText(payload.last_name),
      gender: normalizeText(payload.gender),
      age: payload.age ?? null,
      phone: normalizeText(payload.phone),
      email,
      position_applied: normalizeText(payload.position_applied),
      country: normalizeText(payload.country),
      current_address: normalizeText(payload.current_address),
      job_id: payload.job_id || null,
      status: normalizeText(payload.status) || "Pre-screening Sent",
      stage: normalizeText(payload.stage) || "Applied",
      cv_url: normalizeText(payload.cv_url) || null,
    };

    let duplicateQuery = supabaseAdmin
      .from("job_applications")
      .select("id,email,position_applied,job_id,created_at")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1);

    if (insertPayload.job_id) {
      duplicateQuery = duplicateQuery.eq("job_id", insertPayload.job_id);
    } else if (insertPayload.position_applied) {
      duplicateQuery = duplicateQuery.ilike("position_applied", insertPayload.position_applied);
    }

    const { data: existing, error: existingError } = await duplicateQuery.maybeSingle();
    if (existingError) throw existingError;
    if (existing) {
      return res.status(409).json({
        code: "DUPLICATE_APPLICATION",
        error: "You already have an application for this job listing.",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("job_applications")
      .insert(insertPayload)
      .select("*")
      .single();

    if (error) throw error;
    try {
      await generateCvOnlyEvaluation(data);
    } catch (analysisError) {
      console.error("[initial-cv-analysis-failed]", analysisError);
    }
    return res.status(201).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to submit application." });
  }
});

app.get("/api/admin/listings", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    const { data, error } = await supabaseAdmin
      .from("job_listings")
      .select("id,slug,title,department,location,workplace,work_type,description,overview,status,applicants_count,created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load job listings." });
  }
});

app.post("/api/admin/listings", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    const {
      title,
      department,
      location,
      workplace,
      work_type,
      posted,
      description,
      overview,
      status,
      actor,
    } = req.body || {};

    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }

    const slug = slugify(title);
    const { data, error } = await supabaseAdmin
      .from("job_listings")
      .insert({
        title,
        slug,
        department,
        location,
        workplace,
        work_type,
        posted,
        description,
        overview,
        status: status || "Active",
      })
      .select("*")
      .single();

    if (error) throw error;
    await logAdminActivity(`Created job listing: ${data?.title || title}`, actor);
    return res.status(201).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create job listing." });
  }
});

app.patch("/api/admin/listings/:id", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    const { id } = req.params;
    const {
      title,
      department,
      location,
      workplace,
      work_type,
      description,
      status,
      actor,
    } = req.body || {};

    if (!id) {
      return res.status(400).json({ error: "Listing id is required." });
    }

    const updates = {
      title,
      department,
      location,
      workplace,
      work_type,
      description,
      status,
    };

    if (title) {
      updates.slug = slugify(title);
    }

    const { data, error } = await supabaseAdmin
      .from("job_listings")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    await logAdminActivity(`Edited job listing: ${data?.title || title || "Untitled Listing"}`, actor);
    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update job listing." });
  }
});

app.delete("/api/admin/listings/:id", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    const { id } = req.params;
    const actor = normalizeText(req.body?.actor || "");
    if (!id) {
      return res.status(400).json({ error: "Listing id is required." });
    }

    const { data: listing, error: listingError } = await supabaseAdmin
      .from("job_listings")
      .select("*")
      .eq("id", id)
      .single();

    if (listingError || !listing) {
      return res.status(404).json({ error: "Job listing not found." });
    }

    const archiveResult = await supabaseAdmin
      .from("archived_job_listings")
      .insert({
        original_listing_id: listing.id,
        slug: listing.slug || null,
        title: listing.title || "Untitled Listing",
        department: listing.department || null,
        location: listing.location || null,
        workplace: listing.workplace || null,
        work_type: listing.work_type || null,
        posted: listing.posted || null,
        description: listing.description || null,
        overview: Array.isArray(listing.overview) ? listing.overview : null,
        status: listing.status || null,
        applicants_count: listing.applicants_count ?? 0,
        created_at: listing.created_at || null,
        archived_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (archiveResult.error) {
      if (isMissingTableOrColumnError(archiveResult.error)) {
        return res.status(500).json({
          error: "archived_job_listings is not set up yet. Run server/sql/archived_job_listings.sql.",
        });
      }

      throw archiveResult.error;
    }

    const { error } = await supabaseAdmin
      .from("job_listings")
      .delete()
      .eq("id", id);

    if (error) throw error;
    await logAdminActivity(`Archived job listing: ${listing.title || "Untitled Listing"}`, actor);
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to archive job listing." });
  }
});

app.get("/api/jobs", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    const { data, error } = await supabaseAdmin
      .from("job_listings")
      .select("id,slug,title,department,location,workplace,work_type,description,overview,status,created_at")
      .eq("status", "Active")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load job openings." });
  }
});

app.get("/api/jobs/:slug", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    const { slug } = req.params;
    const { data, error } = await supabaseAdmin
      .from("job_listings")
      .select("id,slug,title,department,location,workplace,work_type,description,overview,status,created_at")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Job not found." });
    }
    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load job detail." });
  }
});

app.get("/api/admin/applications", async (req, res) => {
    try {
      if (!supabaseAdminReady) {
        return res.status(500).json({ error: "Supabase service role key not configured." });
      }

      const { data, error } = await supabaseAdmin
        .from("job_applications")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load applications." });
  }
});

app.get("/api/admin/applications/:id", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Application id is required." });
    }

    const { data, error } = await supabaseAdmin
      .from("job_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Application not found." });
    }

    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load application." });
  }
});

app.patch("/api/admin/applications/:id", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    const { id } = req.params;
    const {
      status,
      pre_screening_results,
      ai_analysis,
      ai_recommendation,
      stage,
      score,
      analyze,
    } = req.body || {};

    if (!id) {
      return res.status(400).json({ error: "Application id is required." });
    }

    if (analyze === true) {
      const { data: application, error: appError } = await supabaseAdmin
        .from("job_applications")
        .select("*")
        .eq("id", id)
        .single();

      if (appError || !application) {
        return res.status(404).json({ error: "Application not found." });
      }
      return res.status(200).json({
        data: application,
        aiRecommendation: application.ai_recommendation || "",
        matchScore: application.score ?? null,
        cvAnalysis: application.ai_analysis || "",
        preScreeningSummary: application.pre_screening_results || "",
        combinedAnalysis: application.ai_analysis || "",
      });
    }

    const updates = {};
    if (typeof status !== "undefined") updates.status = status;
    if (typeof pre_screening_results !== "undefined") updates.pre_screening_results = pre_screening_results;
    if (typeof ai_analysis !== "undefined") updates.ai_analysis = ai_analysis;
    if (typeof ai_recommendation !== "undefined") updates.ai_recommendation = ai_recommendation;
    if (typeof stage !== "undefined") updates.stage = stage;
    if (typeof score !== "undefined") updates.score = score;

    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: "No fields provided for update." });
    }

    const { data, error } = await supabaseAdmin
      .from("job_applications")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update application." });
  }
});

app.delete("/api/admin/applications/:id", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Application id is required." });
    }

    const { data: application, error: applicationError } = await supabaseAdmin
      .from("job_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (applicationError || !application) {
      return res.status(404).json({ error: "Application not found." });
    }

    const archiveResult = await supabaseAdmin
      .from("archived_job_applications")
      .insert({
        original_application_id: application.id,
        name: normalizeText(
          application.name ||
            `${application.first_name || ""} ${application.middle_name || ""} ${application.last_name || ""}`,
        ) || "Unknown Applicant",
        role: application.role || application.position_applied || null,
        stage: application.stage || null,
        status: application.status || null,
        score: application.score ?? null,
        created_at: application.created_at || null,
        first_name: application.first_name || null,
        middle_name: application.middle_name || null,
        last_name: application.last_name || null,
        email: application.email || null,
        phone: application.phone || null,
        gender: application.gender || null,
        age: application.age ?? null,
        country: application.country || null,
        current_address: application.current_address || application.address || null,
        position_applied: application.position_applied || null,
        cv_url: application.cv_url || null,
        ai_analysis: application.ai_analysis || null,
        ai_recommendation: application.ai_recommendation || null,
        pre_screening_results: application.pre_screening_results || null,
        job_id: application.job_id || null,
        archived_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (archiveResult.error) {
      if (isMissingTableOrColumnError(archiveResult.error)) {
        return res.status(500).json({
          error: "archived_job_applications is not set up yet. Run server/sql/archived_job_applications.sql.",
        });
      }

      throw archiveResult.error;
    }

    const { error } = await supabaseAdmin
      .from("job_applications")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to archive application." });
  }
});

app.post("/api/admin/applications/:id/analyze", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Application id is required." });
    }

    const { data: application, error: appError } = await supabaseAdmin
      .from("job_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (appError || !application) {
      return res.status(404).json({ error: "Application not found." });
    }

    return res.status(200).json({
      data: application,
      aiRecommendation: application.ai_recommendation || "",
      matchScore: application.score ?? null,
      cvAnalysis: application.ai_analysis || "",
      preScreeningSummary: application.pre_screening_results || "",
      combinedAnalysis: application.ai_analysis || "",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to analyze application." });
  }
});

app.get("/api/admin/bookings", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    await syncCalendlyBookings();

    let { data, error } = await supabaseAdmin
      .from("calendly_bookings")
      .select("id,event,invitee,event_name,invitee_name,invitee_email,start_time,end_time,status,timezone,payload,location,meeting_url,created_at")
      .order("start_time", { ascending: true });

    if (error) {
      if (isMissingColumnError(error)) {
        const fallback = await supabaseAdmin
          .from("calendly_bookings")
          .select("id,event,event_name,invitee,invitee_name,invitee_email,start_time,end_time,status,timezone,payload,created_at")
          .order("start_time", { ascending: true });

        if (fallback.error && isMissingColumnError(fallback.error)) {
          const legacyFallback = await supabaseAdmin
            .from("calendly_bookings")
            .select("id,event,invitee,start_time,end_time,location,meeting_url,status,created_at")
            .order("start_time", { ascending: true });
          if (legacyFallback.error) throw legacyFallback.error;
          data = (legacyFallback.data || []).map((item) => ({
            ...item,
            payload: {},
            invitee_email: null,
            timezone: null,
          }));
        } else if (fallback.error) {
          throw fallback.error;
        } else {
          data = (fallback.data || []).map((item) => ({
            ...item,
            location: item.location || extractLocationFromPayload(item.payload),
            meeting_url: item.meeting_url || extractMeetingLinkFromPayload(item.payload),
          }));
        }
        error = null;
      } else {
        throw error;
      }
    }

    const normalizedData = (data || []).map((item) => {
      const payload = item.payload || {};
      const eventName = item.event_name || item.event || "";
      const inviteeName = item.invitee_name || item.invitee || "";
      return {
        id: item.id,
        event: eventName,
        invitee: inviteeName,
        invitee_email: item.invitee_email || payload?.invitee?.email || null,
        start_time: item.start_time,
        end_time: item.end_time,
        status: item.status || "active",
        timezone: item.timezone || null,
        location: normalizeText(item.location || extractLocationFromPayload(payload)) || null,
        meeting_url: normalizeText(item.meeting_url || extractMeetingLinkFromPayload(payload)) || null,
        created_at: item.created_at || null,
        payload,
      };
    });

    return res.status(200).json({ data: normalizedData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load bookings." });
  }
});

app.post("/api/admin/bookings/sync", async (req, res) => {
  try {
    const result = await syncCalendlyBookings();
    return res.status(200).json({ data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to sync Calendly bookings.",
      details: String(error?.message || error),
    });
  }
});

app.get("/api/admin/submissions", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    let { data, error } = await supabaseAdmin
      .from("contact_submissions")
      .select("id,company,project,industry,status,created_at,full_name,work_email,company_website,company_size,data_type,dataset_size,timeline,project_description")
      .order("created_at", { ascending: false });

    if (error && isMissingColumnError(error)) {
      const fallback = await supabaseAdmin
        .from("contact_submissions")
        .select("id,company,project,industry,status,created_at")
        .order("created_at", { ascending: false });
      if (fallback.error) throw fallback.error;
      data = (fallback.data || []).map((item) => ({
        ...item,
        full_name: null,
        work_email: null,
        company_website: null,
        company_size: null,
        data_type: null,
        dataset_size: null,
        timeline: null,
        project_description: null,
      }));
      error = null;
    }

    if (error) throw error;
    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load submissions." });
  }
});

app.get("/api/admin/inquiries", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    let { data, error } = await supabaseAdmin
      .from("contact_inquiries")
      .select("id,full_name,email,inquiry_type,message,reply_message,replied_at,status,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      if (isMissingColumnError(error)) {
        const fallbackResult = await supabaseAdmin
          .from("contact_inquiries")
          .select("id,full_name,email,inquiry_type,message,created_at")
          .order("created_at", { ascending: false });

        if (fallbackResult.error) {
          throw fallbackResult.error;
        }

        data = (fallbackResult.data || []).map((item) => ({
          ...item,
          reply_message: null,
          replied_at: null,
          status: "Pending",
        }));
        error = null;
      } else if (error.code === "42P01") {
        return res.status(200).json({ data: [] });
      }
    }

    if (error) {
      throw error;
    }

    return res.status(200).json({
      data: (data || []).map((item) => ({
        ...item,
        status: normalizeInquiryStatus(item?.status, Boolean(item?.reply_message || item?.replied_at)),
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load inquiries." });
  }
});

app.patch("/api/admin/inquiries/:id", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    const { id } = req.params;
    const { status, reply_message } = req.body || {};

    if (!id) {
      return res.status(400).json({ error: "Inquiry id is required." });
    }

    if (typeof status === "undefined" && typeof reply_message === "undefined") {
      return res.status(400).json({ error: "No fields provided for update." });
    }

    const updates = {};
    if (typeof status !== "undefined") {
      updates.status = normalizeInquiryStatus(status, Boolean(reply_message));
    }
    if (typeof reply_message !== "undefined") {
      updates.reply_message = reply_message;
      updates.replied_at = reply_message ? new Date().toISOString() : null;
      updates.status = reply_message ? "Reply Sent" : normalizeInquiryStatus(status);
    }

    const { data, error } = await supabaseAdmin
      .from("contact_inquiries")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update inquiry." });
  }
});

app.delete("/api/admin/inquiries/:id", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Inquiry id is required." });
    }

    const { data: inquiry, error: inquiryError } = await supabaseAdmin
      .from("contact_inquiries")
      .select("*")
      .eq("id", id)
      .single();

    if (inquiryError || !inquiry) {
      return res.status(404).json({ error: "Inquiry not found." });
    }

    const archiveResult = await supabaseAdmin
      .from("archived_contact_inquiries")
      .insert({
        original_inquiry_id: inquiry.id,
        full_name: inquiry.full_name || "Unknown",
        email: inquiry.email || null,
        inquiry_type: inquiry.inquiry_type || null,
        message: inquiry.message || null,
        reply_message: inquiry.reply_message || null,
        replied_at: inquiry.replied_at || null,
        status: normalizeInquiryStatus(inquiry.status, Boolean(inquiry.reply_message || inquiry.replied_at)),
        created_at: inquiry.created_at || null,
        archived_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (archiveResult.error) {
      if (isMissingTableOrColumnError(archiveResult.error)) {
        return res.status(500).json({
          error: "archived_contact_inquiries is not set up yet. Run server/sql/archived_contact_inquiries.sql.",
        });
      }

      throw archiveResult.error;
    }

    const { error } = await supabaseAdmin
      .from("contact_inquiries")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to archive inquiry." });
  }
});

app.post("/api/contact-submissions", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    const payload = req.body || {};
    const fullName = normalizeText(payload.fullName || payload.full_name);
    const workEmail = normalizeText(payload.workEmail || payload.work_email).toLowerCase();
    const companyName = normalizeText(payload.companyName || payload.company_name);
    const companyWebsite = normalizeText(payload.companyWebsite || payload.company_website);
    const industry = normalizeText(payload.industry);
    const companySize = normalizeText(payload.companySize || payload.company_size);
    const projectType = normalizeText(payload.projectType || payload.project_type);
    const dataType = normalizeText(payload.dataType || payload.data_type);
    const datasetSize = normalizeText(payload.datasetSize || payload.dataset_size);
    const timeline = normalizeText(payload.timeline);
    const projectDescription = normalizeText(payload.projectDescription || payload.project_description);
    if (!companyName || companyName.length < 2) {
      return res.status(400).json({ error: "Company is required." });
    }
    if (!projectType) {
      return res.status(400).json({ error: "Project type is required." });
    }

    const insertPayload = {
      company: companyName,
      project: projectType,
      industry: industry || null,
      full_name: fullName || null,
      work_email: workEmail || null,
      company_website: companyWebsite || null,
      company_size: companySize || null,
      data_type: dataType || null,
      dataset_size: datasetSize || null,
      timeline: timeline || null,
      project_description: projectDescription || null,
      status: "New",
    };

    const insertResult = await supabaseAdmin
      .from("contact_submissions")
      .insert(insertPayload)
      .select("id")
      .single();

    if (insertResult.error) {
      if (insertResult.error.code === "428C9") {
        return res.status(500).json({
          error: "contact_submissions does not match the original schema. Restore company/project/industry/status columns.",
        });
      }

      throw insertResult.error;
    }

    return res.status(201).json({
      data: {
        id: insertResult.data?.id || null,
        mode: "rich",
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to submit contact submission." });
  }
});

app.delete("/api/admin/submissions/:id", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Submission id is required." });
    }

    const { data: submission, error: submissionError } = await supabaseAdmin
      .from("contact_submissions")
      .select("*")
      .eq("id", id)
      .single();

    if (submissionError || !submission) {
      return res.status(404).json({ error: "Submission not found." });
    }

    const archiveResult = await supabaseAdmin
      .from("archived_contact_submissions")
      .insert({
        original_submission_id: submission.id,
        company: submission.company || "Unknown",
        project: submission.project || null,
        industry: submission.industry || null,
        status: submission.status || null,
        created_at: submission.created_at || null,
        full_name: submission.full_name || null,
        work_email: submission.work_email || null,
        company_website: submission.company_website || null,
        company_size: submission.company_size || null,
        data_type: submission.data_type || null,
        dataset_size: submission.dataset_size || null,
        timeline: submission.timeline || null,
        project_description: submission.project_description || null,
        archived_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (archiveResult.error) {
      if (isMissingTableOrColumnError(archiveResult.error)) {
        return res.status(500).json({
          error: "archived_contact_submissions is not set up yet. Run server/sql/archived_contact_submissions.sql.",
        });
      }

      throw archiveResult.error;
    }

    const { error } = await supabaseAdmin
      .from("contact_submissions")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to archive demo request." });
  }
});

app.post("/api/inquiries", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    const payload = req.body || {};
    const fullName = normalizeText(payload.fullName || payload.full_name);
    const email = normalizeText(payload.email).toLowerCase();
    const inquiryType = normalizeText(payload.inquiryType || payload.inquiry_type);
    const message = normalizeText(payload.message);

    if (!fullName || fullName.length < 2) {
      return res.status(400).json({ error: "Full name is required." });
    }
    if (!email || !isValidBasicEmail(email)) {
      return res.status(400).json({ error: "A valid email is required." });
    }
    if (!inquiryType) {
      return res.status(400).json({ error: "Inquiry type is required." });
    }
    if (!message || message.length < 20) {
      return res.status(400).json({ error: "Message must be at least 20 characters." });
    }

    const insertResult = await supabaseAdmin
      .from("contact_inquiries")
      .insert({
        full_name: fullName,
        email,
        inquiry_type: inquiryType,
        message,
        status: "Pending",
      })
      .select("id")
      .single();

    if (insertResult.error) {
      if (insertResult.error.code === "42P01" || insertResult.error.code === "42703") {
        return res.status(500).json({
          error: "contact_inquiries is not set up yet. Run server/sql/contact_inquiries.sql.",
        });
      }

      throw insertResult.error;
    }

    return res.status(201).json({
      data: {
        id: insertResult.data?.id || null,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to submit inquiry." });
  }
});

app.get("/api/admin/profiles", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    let { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id,name,email,role,created_at")
      .order("created_at", { ascending: false });

    if (error && isMissingColumnError(error)) {
      const fallback = await supabaseAdmin
        .from("profiles")
        .select("id,email,role,created_at")
        .order("created_at", { ascending: false });
      data = fallback.data;
      error = fallback.error;
    }

    if (error) throw error;
    const profiles = data.map((row) => ({
      id: row.id,
      name: row.name || formatProfileNameFromEmail(row.email),
      email: row.email || "",
      role: row.role || "",
      status: "Active",
      created_at: row.created_at || null,
    }));
    return res.status(200).json({ data: profiles });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load profiles." });
  }
});

app.post("/api/admin/profiles", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    const name = normalizeText(req.body?.name || "");
    const email = normalizeText(req.body?.email || "").toLowerCase();
    const role = normalizeText(req.body?.role || "");
    const password = String(req.body?.password || "");

    if (!name) {
      return res.status(400).json({ error: "Name is required." });
    }
    if (!isValidBasicEmail(email)) {
      return res.status(400).json({ error: "A valid email is required." });
    }
    if (!role) {
      return res.status(400).json({ error: "Role is required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    const { data: createdUserData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        full_name: name,
      },
    });

    if (createUserError) throw createUserError;
    const userId = createdUserData?.user?.id;
    if (!userId) {
      return res.status(500).json({ error: "Failed to create user account." });
    }

    let profilePayload = {
      id: userId,
      name,
      email,
      role,
    };

    let insertResult = await supabaseAdmin.from("profiles").insert(profilePayload).select("id,name,email,role,created_at").single();
    if (insertResult.error && isMissingColumnError(insertResult.error)) {
      profilePayload = {
        id: userId,
        email,
        role,
      };
      insertResult = await supabaseAdmin.from("profiles").insert(profilePayload).select("id,email,role,created_at").single();
    }

    if (insertResult.error) {
      await supabaseAdmin.auth.admin.deleteUser(userId).catch(() => undefined);
      throw insertResult.error;
    }

    const row = insertResult.data || {};
    return res.status(201).json({
      data: {
        id: row.id || userId,
        name: row.name || name,
        email: row.email || email,
        role: row.role || role,
        status: "Active",
        created_at: row.created_at || new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create user." });
  }
});

app.patch("/api/admin/profiles/:id", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    const profileId = req.params.id;
    const name = normalizeText(req.body?.name || "");
    const email = normalizeText(req.body?.email || "").toLowerCase();
    const role = normalizeText(req.body?.role || "");

    if (!profileId) {
      return res.status(400).json({ error: "Profile id is required." });
    }
    if (!name) {
      return res.status(400).json({ error: "Name is required." });
    }
    if (!isValidBasicEmail(email)) {
      return res.status(400).json({ error: "A valid email is required." });
    }
    if (!role) {
      return res.status(400).json({ error: "Role is required." });
    }

    const { error: updateUserError } = await supabaseAdmin.auth.admin.updateUserById(profileId, {
      email,
      user_metadata: {
        name,
        full_name: name,
      },
    });

    if (updateUserError) throw updateUserError;

    let updateResult = await supabaseAdmin
      .from("profiles")
      .update({ name, email, role })
      .eq("id", profileId)
      .select("id,name,email,role,created_at")
      .single();

    if (updateResult.error && isMissingColumnError(updateResult.error)) {
      updateResult = await supabaseAdmin
        .from("profiles")
        .update({ email, role })
        .eq("id", profileId)
        .select("id,email,role,created_at")
        .single();
    }

    if (updateResult.error) throw updateResult.error;

    const row = updateResult.data || {};
    return res.status(200).json({
      data: {
        id: row.id || profileId,
        name: row.name || name,
        email: row.email || email,
        role: row.role || role,
        status: "Active",
        created_at: row.created_at || null,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update user." });
  }
});

app.delete("/api/admin/profiles/:id", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    const profileId = req.params.id;
    if (!profileId) {
      return res.status(400).json({ error: "Profile id is required." });
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(profileId);
    if (error) throw error;

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete user." });
  }
});

app.get("/api/admin/logs", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(500).json({ error: "Supabase service role key not configured." });
    }

    const { data, error } = await supabaseAdmin
      .from("admin_activity_logs")
      .select("id,activity,actor,created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;
    const logs = data.map((row) => ({
      id: row.id,
      time: new Date(row.created_at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      activity: row.activity,
      actor: row.actor,
    }));
    return res.status(200).json({ data: logs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load activity logs." });
  }
});

app.post("/api/pre-screening/submit", async (req, res) => {
  try {
    const {
      applicationId,
      email,
      role,
      applicantName,
      responses,
      telemetry,
      startedAt,
      submittedAt,
      sessionId,
    } = req.body || {};

    if (!Array.isArray(responses) || responses.length < 5) {
      return res.status(400).json({ error: "Please complete all required pre-screening responses." });
    }

    const normalizedEmail = normalizeText(email).toLowerCase();
    const hasApplicationRef = Boolean(applicationId || normalizedEmail);
    if (!hasApplicationRef) {
      return res.status(400).json({ error: "Missing applicant reference. Provide applicationId or email." });
    }

    const now = Date.now();
    const rateKey = `${req.ip || "unknown"}:${applicationId || normalizedEmail || "anonymous"}`;
    const priorHits = preScreeningSubmissionTracker.get(rateKey) || [];
    const recentHits = priorHits.filter((stamp) => now - stamp < preScreeningSubmissionWindowMs);
    if (recentHits.length >= preScreeningMaxSubmissionsPerWindow) {
      return res.status(429).json({
        error: "Too many pre-screening attempts. Please wait before trying again.",
      });
    }
    recentHits.push(now);
    preScreeningSubmissionTracker.set(rateKey, recentHits);

    const cleanedResponses = responses.map((entry, index) => {
      const answer = normalizeText(entry?.answer || "");
      return {
        id: entry?.id || `q-${index + 1}`,
        category: normalizeText(entry?.category || "General"),
        question: normalizeText(entry?.question || ""),
        answer,
        wordCount: countWords(answer),
        timeSpentSec: Number(entry?.timeSpentSec || 0),
        editEvents: Number(entry?.editEvents || 0),
      };
    });

    const missingAnswers = cleanedResponses.some((entry) => !entry.answer);
    if (missingAnswers) {
      return res.status(400).json({ error: "Every question must have an answer." });
    }

    const integrity = analyzePreScreeningIntegrity({
      responses: cleanedResponses,
      telemetry: telemetry || {},
    });
    const aiCheck = await runAiAnswerCheck({ responses: cleanedResponses });

    const payload = {
      version: 1,
      sessionId: normalizeText(sessionId) || null,
      applicantName: normalizeText(applicantName) || null,
      email: normalizedEmail || null,
      role: normalizeText(role) || null,
      startedAt: normalizeText(startedAt) || null,
      submittedAt: normalizeText(submittedAt) || new Date().toISOString(),
      telemetry: telemetry || {},
      responses: cleanedResponses,
      integrity,
      aiCheck,
    };

    if (!supabaseAdminReady) {
      return res.status(200).json({
        ok: true,
        source: "mock",
        integrity,
        message: "Pre-screening submitted in mock mode.",
      });
    }

    let targetApplicationId = normalizeText(applicationId);
    if (!targetApplicationId && normalizedEmail) {
      const { data: matchedApp, error: matchedAppError } = await supabaseAdmin
        .from("job_applications")
        .select("id")
        .eq("email", normalizedEmail)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (matchedAppError) throw matchedAppError;
      targetApplicationId = matchedApp?.id || "";
    }

    if (!targetApplicationId) {
      return res.status(404).json({ error: "No matching application found for this pre-screening." });
    }

    const updates = {
      pre_screening_results: JSON.stringify(payload),
      status: "Pending Verdict",
      stage: "Pre-screening Completed",
    };

    let { data: updatedApplication, error: updateError } = await supabaseAdmin
      .from("job_applications")
      .update(updates)
      .eq("id", targetApplicationId)
      .select("*")
      .single();

    if (updateError && /column/i.test(String(updateError.message || ""))) {
      const fallbackUpdates = {
        status: updates.status,
        stage: updates.stage,
      };
      const fallback = await supabaseAdmin
        .from("job_applications")
        .update(fallbackUpdates)
        .eq("id", targetApplicationId)
        .select("*")
        .single();
      updatedApplication = fallback.data;
      updateError = fallback.error;
    }

    if (updateError) throw updateError;

    try {
      const finalEvaluation = await generateFullEvaluation(updatedApplication, payload);
      updatedApplication = finalEvaluation.updated;
    } catch (analysisError) {
      console.error("[final-pre-screening-analysis-failed]", analysisError);
    }

    return res.status(200).json({
      ok: true,
      integrity,
      aiCheck,
      data: updatedApplication,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to submit pre-screening results." });
  }
});


const buildFallbackReply = (input) => {
  const text = String(input || "").toLowerCase();

  if (text.includes("service") || text.includes("offer") || text.includes("ai")) {
    return "Lifewood offers AI-powered data services, including AI data collection, annotation, validation, and enterprise AI solutions. You can view details in the What We Offer section.";
  }
  if (text.includes("office") || text.includes("location") || text.includes("where")) {
    return "You can view all Lifewood office locations on the Our Offices page. Use the footer link 'View all offices' to open it directly.";
  }
  if (text.includes("career") || text.includes("job") || text.includes("hiring")) {
    return "You can explore open roles on the Careers page. If a role matches your profile, apply there directly.";
  }
  if (
    text.includes("philanthropy") ||
    text.includes("impact") ||
    text.includes("social")
  ) {
    return "You can find Lifewood social initiatives and programs on the Philanthropy & Impact page.";
  }
  if (text.includes("project") || text.includes("news")) {
    return "You can explore AI Projects and Internal News from the AI Initiatives section in the main navigation.";
  }
  if (
    text.includes("contact") ||
    text.includes("partner") ||
    text.includes("enquiry")
  ) {
    return "For partnerships or inquiries, please use the Contact Us page form and the team will respond.";
  }

  return "I am currently in fallback mode due to temporary AI service limits. I can still help with Lifewood services, offices, careers, projects, impact initiatives, and contact details.";
};

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ reply: "Please provide a valid message." });
    }

    if (!genAI) {
      return res.status(200).json({
        reply: buildFallbackReply(message),
        mode: "fallback",
      });
    }

    let text = "";
    let lastError = null;

    for (const modelName of [...new Set(modelFallbacks)]) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(message);
        const response = await result.response;
        text = response.text();
        if (text) break;
      } catch (modelError) {
        lastError = modelError;
      }
    }

    if (!text) {
      throw lastError || new Error("No response from available Gemini models.");
    }

    res.json({ reply: text, mode: "ai" });
  } catch (error) {
    const message = String(error?.message || "");
    const lower = message.toLowerCase();

    if (
      lower.includes("api key") ||
      lower.includes("permission_denied") ||
      lower.includes("reported as leaked")
    ) {
      return res.status(500).json({
        reply:
          "Authentication failed for the AI service. Your current Gemini API key may be invalid or leaked. Generate a new key and update server/.env.",
      });
    }

    if (lower.includes("quota") || lower.includes("rate")) {
      return res.status(200).json({
        reply: buildFallbackReply(req.body?.message),
        mode: "fallback",
      });
    }

    if (lower.includes("fetch failed") || lower.includes("timeout")) {
      console.warn("[chat-fallback-network]", message);
      return res.status(200).json({
        reply: buildFallbackReply(req.body?.message),
        mode: "fallback",
      });
    }

    if (lower.includes("not found") || lower.includes("model")) {
      return res.status(500).json({
        reply:
          "The configured AI model is unavailable. Please update GEMINI_MODEL in server/.env.",
      });
    }

    console.error(error);
    res.status(500).json({
      reply: "The AI service failed to respond. Please try again shortly.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
