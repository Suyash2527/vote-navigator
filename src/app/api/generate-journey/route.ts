import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const MODELS = ["gemini-3.1-pro-preview", "gemini-3.1-flash-lite-preview", "gemini-2.5-pro", "gemini-2.0-flash"];

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

const cache = new Map<string, any>();

export async function POST(req: Request) {
  try {
    const { persona } = await req.json();

    if (!persona) {
      return NextResponse.json({ error: "Persona is required" }, { status: 400 });
    }

    if (cache.has(persona)) {
      return NextResponse.json(cache.get(persona));
    }

    const prompt =
      "You are an expert Indian civic assistant with deep knowledge of the Election Commission of India (ECI), the Representation of the People Act, and Indian voter registration processes.\n" +
      "Generate a personalised 6-step election journey for an Indian \"" + persona + "\" voter.\n" +
      "Each step must be specific to the Indian electoral system, referencing:\n" +
      "- Voter ID (EPIC card) and Aadhaar-voter ID linking\n" +
      "- Voter helpline 1950 and the Voter Helpline App / voterportal.eci.gov.in\n" +
      "- Model Code of Conduct (MCC), NOTA option, EVMs and VVPATs\n" +
      "- Booth Level Officers (BLO), Form 6 (new registration), Form 8 (corrections)\n" +
      "- Polling booth accessibility, ID documents accepted on poll day\n" +
      "Make each step actionable, beginner-friendly, and relevant to India.\n\n" +
      "Return ONLY valid JSON matching this schema (no markdown, no code blocks):\n" +
      '{"steps":[{"title":"string","description":"string","why_it_matters":"string","next_action":"string"}]}';

    const rawText = await generateWithFallback(prompt);
    const cleaned = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
    const data = JSON.parse(cleaned);

    cache.set(persona, data);
    return NextResponse.json(data);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to generate journey";
    const isQuota = msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("exhausted");
    console.error("Error generating journey:", error);
    return NextResponse.json(
      { error: isQuota ? "AI quota exceeded. Please wait a few minutes and try again." : "Failed to generate journey" },
      { status: isQuota ? 429 : 500 }
    );
  }
}
