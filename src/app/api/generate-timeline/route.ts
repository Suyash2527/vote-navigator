import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const MODELS = ["gemini-2.0-flash", "gemini-2.5-flash-lite", "gemini-flash-latest"];

async function generateWithFallback(prompt: string) {
  for (const modelName of MODELS) {
    try {
      const m = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: "application/json" },
      });
      const result = await m.generateContent(prompt);
      return result.response.text().trim();
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 429 || status === 503) {
        console.warn(`Model ${modelName} quota hit, trying next...`);
        continue;
      }
      throw err;
    }
  }
  throw new Error("All models exhausted quota. Please try again in a few minutes.");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const state: string = body.state || "";
    const electionType: string = body.electionType || "";
    const year: string = String(body.year || "");

    if (!state || !electionType || !year) {
      return NextResponse.json({ error: "Missing required fields: state, electionType, year" }, { status: 400 });
    }

    const prompt =
      "You are an expert Indian election assistant with deep knowledge of the Election Commission of India (ECI) processes.\n" +
      "Generate a realistic and accurate election timeline for the following Indian election:\n" +
      "State / Union Territory: " + state + "\n" +
      "Election Type: " + electionType + "\n" +
      "Year: " + year + "\n\n" +
      "Generate exactly 5 key events in strict chronological order specific to the Indian electoral process. Cover:\n" +
      "1. Model Code of Conduct announcement and schedule release by ECI\n" +
      "2. Voter roll (electoral roll) revision / final publication deadline\n" +
      "3. Nomination filing and scrutiny period\n" +
      "4. Polling Day (Matdan Diwas)\n" +
      "5. Vote counting and result declaration\n\n" +
      "Use dates appropriate for the given year. Reference ECI norms (e.g., MCC kicks in on schedule announcement).\n" +
      "Return ONLY valid JSON matching this exact schema, no markdown, no code blocks:\n" +
      '{"events":[{"title":"string","date":"string","description":"string"}]}';

    const rawText = await generateWithFallback(prompt);
    const cleaned = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
    const data = JSON.parse(cleaned);

    return NextResponse.json(data);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to generate timeline";
    const isQuota = msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("exhausted");
    console.error("Error generating timeline:", error);
    return NextResponse.json(
      { error: isQuota ? "AI quota exceeded. Please wait a few minutes and try again." : "Failed to generate timeline" },
      { status: isQuota ? 429 : 500 }
    );
  }
}
