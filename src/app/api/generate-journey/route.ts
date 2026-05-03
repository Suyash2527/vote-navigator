import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCache, setCache } from "@/lib/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Using Gemini Pro for high-precision decision logic
const MODELS = ["gemini-1.5-pro", "gemini-1.5-flash"];

async function generateWithFallback(prompt: string) {
  let lastError: any;
  for (const modelName of MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const m = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { 
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        });
        const result = await m.generateContent(prompt);
        const text = result.response.text().trim();
        const parsed = JSON.parse(text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim());
        
        if (!parsed.steps || !Array.isArray(parsed.steps)) throw new Error("Invalid schema");
        
        for (const step of parsed.steps) {
          if (!step.why_it_matters || !step.what_if_skipped || !step.real_world_example || !step.next_action) {
            throw new Error("Missing mandatory explainability fields");
          }
        }
        
        return parsed;
      } catch (err: any) {
        lastError = err;
        if (err?.status === 429 || err?.status === 503) {
          await new Promise(r => setTimeout(r, 1000 * attempt));
          continue;
        }
      }
    }
  }
  
  return {
    steps: [
      {
        id: "voter-id-prep",
        title: "Voter Identity Preparation",
        description: "Verify your eligibility and gather identification documents like Aadhaar or Passport.",
        why_it_matters: "Without valid ID, you cannot complete the registration (Form 6).",
        what_if_skipped: "You will be turned away at the polling booth or registration portal.",
        real_world_example: "Many first-time voters miss elections because their ID details don't match their records.",
        next_action: "Visit the NVSP portal and click on 'New Registration for General Electors'."
      }
    ]
  };
}

export async function POST(req: Request) {
  try {
    const { formData } = await req.json();

    // CACHE LOOKUP
    const cacheKey = `journey_${JSON.stringify(formData)}`.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 100);
    const cachedData = await getCache(cacheKey);
    if (cachedData) return NextResponse.json(cachedData);

    const prompt = `
      You are an expert Indian Electoral System Architect. 
      Generate a customized, step-by-step voter journey based on this user profile:
      ${JSON.stringify(formData)}

      Each step MUST strictly follow this JSON schema:
      {
        "steps": [
          {
            "id": "unique-id",
            "title": "Clear title",
            "description": "Step-by-step instructions",
            "why_it_matters": "Legal significance",
            "what_if_skipped": "Negative consequences",
            "real_world_example": "Historical context",
            "next_action": "The exact next thing the user should do"
          }
        ]
      }

      Edge Case Handling:
      - If user is already registered, suggest 'Verification of Name' and 'Polling Station Location'.
      - If user missed the registration deadline for a specific election, suggest 'Registration for future polls'.
    `;

    const data = await generateWithFallback(prompt);
    
    // Save to Cache
    await setCache(cacheKey, data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Critical Error in Journey API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
