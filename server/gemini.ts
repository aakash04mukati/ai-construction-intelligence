import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash";

export const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

export function isGeminiConfigured(): boolean {
  return !!apiKey;
}

export function getModelName(): string {
  return modelName;
}

// Clean markdown code blocks from LLM output if present
export function extractJsonFromText(rawText: string): any {
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return JSON.parse(cleaned);
}

// Helper to convert base64 image data to Gemini inline data
export function parseBase64Image(dataUriOrBase64: string): { mimeType: string; data: string } {
  let mimeType = "image/jpeg";
  let data = dataUriOrBase64;

  if (dataUriOrBase64.startsWith("data:")) {
    const matches = dataUriOrBase64.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      mimeType = matches[1];
      data = matches[2];
    }
  }

  return { mimeType, data };
}
