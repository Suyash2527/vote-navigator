import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const MODELS = ["gemini-3.1-flash-lite-preview", "gemini-2.0-flash", "gemini-2.5-flash-lite"];

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
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const prompt =
      `You are the 'Democratic Diplomat', an ultra-intelligent civic concierge specializing in the Indian electoral ecosystem. 
      Your knowledge base includes the Constitution of India (specifically Articles 324-329), the Representation of the People Acts (1950 & 1951), ECI manuals, and latest digitalization initiatives like NVSP and Voter Helpline.

      Tone: Authoritative, patriotic, encouraging, and crystal clear.
      
      User Query: "${message}"

      Task: Provide a definitive, expert response. If the query involves registration, specify the correct Form (6, 7, 8). If it involves polling, mention EVM/VVPAT security protocols or MCC rules. Always prioritize accuracy and the latest ECI norms.

      Return ONLY a JSON object:
      {"reply": "string (markdown formatted with bolding for emphasis, but no code blocks)"}`;

    const rawText = await generateWithFallback(prompt);
    const cleaned = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
    const data = JSON.parse(cleaned);

    return NextResponse.json(data);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to generate reply";
    const isQuota = msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("exhausted");
    console.error("Error generating FAQ reply:", error);
    return NextResponse.json(
      { error: isQuota ? "AI quota exceeded. Please wait a few minutes and try again." : "Failed to generate reply" },
      { status: isQuota ? 429 : 500 }
    );
  }
}
