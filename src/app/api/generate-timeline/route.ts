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
    const body = await req.json();
    const state: string = body.state || "";
    const electionType: string = body.electionType || "";
    const year: string = String(body.year || "");

    if (!state || !electionType || !year) {
      return NextResponse.json({ error: "Missing required fields: state, electionType, year" }, { status: 400 });
    }

    const cacheKey = `${state}-${electionType}-${year}`;
    if (cache.has(cacheKey)) {
      return NextResponse.json(cache.get(cacheKey));
    }

    const prompt =
      `You are a Senior Strategic Advisor for the Election Commission of India (ECI) with 30 years of expertise in constitutional law and electoral logistics. 
      Your task is to generate a high-fidelity, hyper-realistic, and procedurally accurate election timeline for:
      
      State/UT: ${state}
      Election Type: ${electionType}
      Year: ${year}

      The response must demonstrate deep local context (mentioning state-specific issues like hill terrain in HP/UK or phase-wise polling in UP/WB if applicable).
      
      Requirements:
      1. Generate exactly 5 critical mission milestones in chronological order.
      2. Events: MCC Initiation, Electoral Roll Finalization, Nomination Scrutiny, The Polling Day, and The Result Declaration.
      3. Use realistic dates for ${year} (standard cycles: Lok Sabha usually Apr-May, state assemblies vary).
      4. 'why_it_matters' should explain the constitutional significance (e.g., Article 324, level playing field).
      5. 'next_action' should be an actionable instruction for a first-time voter.

      Return ONLY a JSON object matching this schema:
      {"events":[{"title":"string","date":"string","description":"string","why_it_matters":"string","next_action":"string"}]}`;

    const rawText = await generateWithFallback(prompt);
    const cleaned = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
    const data = JSON.parse(cleaned);

    cache.set(cacheKey, data);
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
