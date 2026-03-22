import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileURLToPath } from "url";
import path from "path";
import {
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
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
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

            callback(new Error("Not allowed by CORS"));
          },
          methods: ["GET", "POST", "PATCH", "OPTIONS"],
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

const mockAdminData = {
  listings: [
    {
      id: "listing-1",
      title: "Senior Data Annotator",
      department: "AI Ops",
      location: "Cebu",
      work_type: "Hybrid",
      status: "Active",
      applicants_count: 24,
    },
    {
      id: "listing-2",
      title: "Prompt Engineer",
      department: "R&D",
      location: "Remote",
      work_type: "Remote",
      status: "Active",
      applicants_count: 31,
    },
    {
      id: "listing-3",
      title: "Product Designer",
      department: "Product",
      location: "Manila",
      work_type: "On-site",
      status: "Paused",
      applicants_count: 14,
    },
    {
      id: "listing-4",
      title: "QA Automation",
      department: "Engineering",
      location: "Remote",
      work_type: "Remote",
      status: "Active",
      applicants_count: 18,
    },
  ],
  applications: [],
  bookings: [
    {
      id: "meet-1",
      event: "Recruiter Sync",
      invitee: "M. Dela Cruz",
      start_time: "09:00",
      end_time: "09:30",
      status: "Confirmed",
    },
    {
      id: "meet-2",
      event: "Portfolio Review",
      invitee: "E. Chen",
      start_time: "10:15",
      end_time: "11:00",
      status: "Confirmed",
    },
    {
      id: "meet-3",
      event: "Client Intake",
      invitee: "Vector Labs",
      start_time: "14:00",
      end_time: "15:00",
      status: "Pending",
    },
    {
      id: "meet-4",
      event: "Hiring Panel",
      invitee: "Lifewood Ops",
      start_time: "16:30",
      end_time: "17:00",
      status: "Confirmed",
    },
  ],
  submissions: [
    {
      id: "sub-1",
      company: "AstraNova",
      project: "LLM Fine-tuning",
      industry: "Fintech",
      status: "New",
    },
    {
      id: "sub-2",
      company: "Northwind",
      project: "Data Labeling",
      industry: "Retail",
      status: "Contacted",
    },
    {
      id: "sub-3",
      company: "Orchid Health",
      project: "Clinical Summaries",
      industry: "Healthcare",
      status: "In Review",
    },
    {
      id: "sub-4",
      company: "Vertex Logistics",
      project: "Route Optimization",
      industry: "Logistics",
      status: "New",
    },
  ],
  profiles: [
    { id: "user-1", name: "Alyssa Cruz", role: "Owner", status: "Active" },
    { id: "user-2", name: "Paolo Reyes", role: "Recruiter", status: "Active" },
    { id: "user-3", name: "Tanya Wu", role: "Hiring Manager", status: "Suspended" },
    { id: "user-4", name: "Jared Lim", role: "User", status: "Active" },
  ],
  logs: [
    { id: "log-1", time: "08:12", activity: "Role updated to Recruiter", actor: "Paolo Reyes" },
    { id: "log-2", time: "09:30", activity: "Exported applications CSV", actor: "Alyssa Cruz" },
    { id: "log-3", time: "11:05", activity: "Cancelled meeting: Client Intake", actor: "Owner" },
    { id: "log-4", time: "13:20", activity: "New contact submission received", actor: "System" },
  ],
};

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

const buildHeuristicRoleFit = ({ role = "", description = "", resumeText = "" }) => {
  const profile = `${role} ${description}`.toLowerCase();
  const resume = resumeText.toLowerCase();
  const tokens = profile.split(/[^a-z0-9]+/).filter((word) => word.length > 3);
  const uniqueTokens = Array.from(new Set(tokens)).slice(0, 80);
  const matches = uniqueTokens.filter((token) => resume.includes(token));
  const score = uniqueTokens.length
    ? Math.min(100, Math.round((matches.length / uniqueTokens.length) * 100))
    : 45;

  const recommendation =
    score >= 80
      ? "Highly Recommended"
      : score >= 60
        ? "Recommended"
        : score >= 40
          ? "Consider with Review"
          : "Not Recommended";

  return {
    score,
    recommendation,
    cvSummary: `Keyword alignment with role and description is ${score}%. Found ${matches.length} matched competency terms from job requirements.`,
  };
};

const runRoleFitAnalysis = async ({ role = "", description = "", resumeText = "" }) => {
  if (!resumeText) {
    return {
      score: 20,
      recommendation: "Needs Resume",
      cvSummary: "No readable resume content was found. Upload a readable PDF resume for proper evaluation.",
    };
  }

  if (!genAI) return buildHeuristicRoleFit({ role, description, resumeText });

  const prompt = `
You are a strict hiring analyst.
Evaluate fit between job and CV.
Return strict JSON only:
{
  "score": number,
  "recommendation": "Highly Recommended" | "Recommended" | "Consider with Review" | "Not Recommended",
  "cvSummary": "string"
}
Job Role: ${role || "Unknown"}
Job Description:
${description || "No description"}
CV Content:
${resumeText.slice(0, 12000)}
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
    if (!parsed) return buildHeuristicRoleFit({ role, description, resumeText });

    const score = Math.max(0, Math.min(100, Number(parsed.score || 0)));
    const recommendationLabels = new Set([
      "Highly Recommended",
      "Recommended",
      "Consider with Review",
      "Not Recommended",
    ]);
    const recommendation = recommendationLabels.has(parsed.recommendation)
      ? parsed.recommendation
      : score >= 80
        ? "Highly Recommended"
        : score >= 60
          ? "Recommended"
          : score >= 40
            ? "Consider with Review"
            : "Not Recommended";
    return {
      score,
      recommendation,
      cvSummary: normalizeText(parsed.cvSummary || "CV evaluation completed."),
    };
  } catch (_error) {
    return buildHeuristicRoleFit({ role, description, resumeText });
  }
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
      .select("id")
      .single();

    if (error) throw error;
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
    if (!id) {
      return res.status(400).json({ error: "Listing id is required." });
    }

    const { error } = await supabaseAdmin
      .from("job_listings")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete job listing." });
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
        return res.status(200).json({ data: mockAdminData.applications, source: "mock" });
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

      const resumeText = await fetchResumeText(application.cv_url || "");
      const roleFit = await runRoleFitAnalysis({
        role: roleName,
        description: jobDescription,
        resumeText,
      });
      const preScreeningSummary = summarizePreScreening(application.pre_screening_results);

      const combinedAnalysis = [
        "CV Fit Analysis:",
        roleFit.cvSummary,
        "",
        "Pre-screening Analysis:",
        preScreeningSummary,
      ].join(" ");

      const { data: analyzedUpdate, error: analyzedError } = await supabaseAdmin
        .from("job_applications")
        .update({
          ai_analysis: combinedAnalysis,
          score: roleFit.score,
        })
        .eq("id", id)
        .select("*")
        .single();

      if (analyzedError) throw analyzedError;

      return res.status(200).json({
        data: analyzedUpdate,
        aiRecommendation: roleFit.recommendation,
        matchScore: roleFit.score,
        cvAnalysis: roleFit.cvSummary,
        preScreeningSummary,
        combinedAnalysis,
      });
    }

    const updates = {};
    if (typeof status !== "undefined") updates.status = status;
    if (typeof pre_screening_results !== "undefined") updates.pre_screening_results = pre_screening_results;
    if (typeof ai_analysis !== "undefined") updates.ai_analysis = ai_analysis;
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

    const resumeText = await fetchResumeText(application.cv_url || "");
    const roleFit = await runRoleFitAnalysis({
      role: roleName,
      description: jobDescription,
      resumeText,
    });
    const preScreeningSummary = summarizePreScreening(application.pre_screening_results);

    const combinedAnalysis = [
      "CV Fit Analysis:",
      roleFit.cvSummary,
      "",
      "Pre-screening Analysis:",
      preScreeningSummary,
    ].join(" ");

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("job_applications")
      .update({
        ai_analysis: combinedAnalysis,
        score: roleFit.score,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) throw updateError;

    return res.status(200).json({
      data: updated,
      aiRecommendation: roleFit.recommendation,
      matchScore: roleFit.score,
      cvAnalysis: roleFit.cvSummary,
      preScreeningSummary,
      combinedAnalysis,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to analyze application." });
  }
});

app.get("/api/admin/bookings", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(200).json({ data: mockAdminData.bookings, source: "mock" });
    }

    const { data, error } = await supabaseAdmin
      .from("calendly_bookings")
      .select("id,event,invitee,start_time,end_time,status")
      .order("start_time", { ascending: true });

    if (error) throw error;
    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load bookings." });
  }
});

app.get("/api/admin/submissions", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(200).json({ data: mockAdminData.submissions, source: "mock" });
    }

    const { data, error } = await supabaseAdmin
      .from("contact_submissions")
      .select("id,company,project,industry,status")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load submissions." });
  }
});

app.get("/api/admin/profiles", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(200).json({ data: mockAdminData.profiles, source: "mock" });
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id,email,role,created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;
    const profiles = data.map((row) => ({
      id: row.id,
      name: row.email || "User",
      role: row.role,
      status: "Active",
    }));
    return res.status(200).json({ data: profiles });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load profiles." });
  }
});

app.get("/api/admin/logs", async (req, res) => {
  try {
    if (!supabaseAdminReady) {
      return res.status(200).json({ data: mockAdminData.logs, source: "mock" });
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

    const screeningSummary = buildPreScreeningSummary({
      integrity,
      responseCount: cleanedResponses.length,
    });
    const aiSummary = `AI-authenticity likelihood: ${aiCheck.overallVerdict} (${aiCheck.overallAiLikelihoodScore}/100).`;

    const updates = {
      pre_screening_results: JSON.stringify(payload),
      ai_analysis: `${screeningSummary} ${aiSummary}`.trim(),
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
    console.error(error);
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

    if (lower.includes("not found") || lower.includes("model")) {
      return res.status(500).json({
        reply:
          "The configured AI model is unavailable. Please update GEMINI_MODEL in server/.env.",
      });
    }

    res.status(500).json({
      reply: "The AI service failed to respond. Please try again shortly.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
