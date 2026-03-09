import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileURLToPath } from "url";
import path from "path";

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
        }
      : undefined,
  ),
);
app.use(express.json());

const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

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
