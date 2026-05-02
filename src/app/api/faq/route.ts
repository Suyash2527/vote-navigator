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
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const prompt =
      "You are a Smart Civic FAQ Assistant specialised in Indian elections, the Election Commission of India (ECI), and Indian voting laws.\n" +
      "You have expert knowledge of: Voter ID (EPIC), voter registration (Form 6/8/8A), the Representation of the People Act, Lok Sabha / Vidhan Sabha / Panchayat elections, NOTA, EVMs, VVPATs, Model Code of Conduct (MCC), voter helpline 1950, the Voter Helpline App, and voterportal.eci.gov.in.\n\n" +
      "The user asks: \"" + message + "\"\n\n" +
      "Provide a concise, friendly, and accurate answer relevant to the Indian electoral context. Use bullet points for lists where appropriate.\n" +
      "Return ONLY valid JSON (no markdown, no code blocks):\n" +
      '{"reply":"string"}';

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
