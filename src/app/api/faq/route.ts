import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Using Gemini Flash for fast, conversational responses
const MODEL_NAME = "gemini-1.5-flash";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const prompt = `
      You are the 'Democratic Diplomat', an ultra-intelligent civic concierge specializing in the Indian electoral ecosystem. 
      Your knowledge base includes the Constitution of India (specifically Articles 324-329), the Representation of the People Acts (1950 & 1951), and ECI manuals.

      User Query: "${message}"

      Strict Requirements:
      1. Provide a definitive, expert response based ONLY on official ECI norms.
      2. If the query involves registration, specify the correct Form (6, 7, 8).
      3. If it involves polling, mention EVM/VVPAT security or MCC rules.
      4. Always include a "Source of Information" (e.g., ECI Voter Guide, RP Act 1951).
      5. Include a "Smart Next Action" recommendation.

      Return ONLY a JSON object:
      {
        "reply": "Main markdown response",
        "source": "Official document name",
        "next_action": "Recommended next step"
      }
    `;

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text().trim());

    return NextResponse.json(data);
  } catch (error) {
    console.error("FAQ API Error:", error);
    return NextResponse.json({ 
      reply: "I am currently processing high traffic. Please refer to voterportal.eci.gov.in for immediate assistance.",
      source: "ECI General Guidelines",
      next_action: "Visit official ECI website"
    });
  }
}
