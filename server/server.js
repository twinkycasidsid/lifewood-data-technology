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

app.post("/api/chat", async (req, res) => {
  try {
    if (!genAI) {
      return res.status(500).json({
        reply:
          "Server configuration error: GEMINI_API_KEY is missing. Please check server/.env.",
      });
    }

    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ reply: "Please provide a valid message." });
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

    res.json({ reply: text });
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
      return res.status(429).json({
        reply:
          "The AI service is currently rate-limited or out of quota. Please try again shortly.",
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
