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
const allowedOrigin = process.env.FRONTEND_ORIGIN || "";
const configuredModel = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const modelFallbacks = [configuredModel, "gemini-2.0-flash-lite"];

app.use(
  cors(
    allowedOrigin
      ? {
          origin: allowedOrigin,
          methods: ["GET", "POST", "OPTIONS"],
          allowedHeaders: ["Content-Type", "Authorization"],
        }
      : undefined,
  ),
);
app.use(express.json());

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
  applications: [
    {
      id: "app-1",
      name: "Alexa Dizon",
      role: "Prompt Engineer",
      stage: "Interview",
      status: "Shortlisted",
      score: 92,
    },
    {
      id: "app-2",
      name: "Marco Santos",
      role: "QA Automation",
      stage: "Screening",
      status: "In Review",
      score: 88,
    },
    {
      id: "app-3",
      name: "Kiara Lim",
      role: "Product Designer",
      stage: "Offer",
      status: "Approved",
      score: 96,
    },
    {
      id: "app-4",
      name: "Luis Navarro",
      role: "Data Annotator",
      stage: "Assessment",
      status: "Pending",
      score: 79,
    },
  ],
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
      .select("id,name,role,stage,status,score")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load applications." });
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
