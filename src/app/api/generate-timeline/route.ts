import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCache, setCache } from "@/lib/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Multi-model optimization: Using Pro for complex reasoning
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
            temperature: 0.2,
          },
        });
        const result = await m.generateContent(prompt);
        const text = result.response.text().trim();
        
        const parsed = JSON.parse(text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim());
        if (!parsed.events || !Array.isArray(parsed.events)) throw new Error("Invalid schema: missing events array");
        
        for (const event of parsed.events) {
          if (!event.why_it_matters || !event.what_if_skipped || !event.real_world_example || !event.next_action) {
            throw new Error("Invalid schema: missing explainability or action fields");
          }
        }
        
        return parsed;
      } catch (err: any) {
        lastError = err;
        console.warn(`Attempt ${attempt} with ${modelName} failed: ${err.message}`);
        if (err?.status === 429 || err?.status === 503) {
          await new Promise(r => setTimeout(r, 1000 * attempt));
          continue;
        }
      }
    }
  }
  
  return {
    events: [
      {
        title: "Standard Election Cycle Initiation",
        date: "March 2024",
        description: "Official announcement of the election schedule by the Election Commission of India (ECI).",
        why_it_matters: "This activates the Model Code of Conduct, ensuring a level playing field for all candidates.",
        what_if_skipped: "Without this, the election lacks a legal framework and schedule, leading to administrative chaos.",
        real_world_example: "In 2019, the ECI announced the schedule on March 10th, immediately triggering state-wide readiness.",
        next_action: "Check your local state schedule and ensure your name is on the electoral roll."
      }
    ]
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { state, electionType, year } = body;

    if (!state || !electionType || !year) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // CACHE LOOKUP
    const cacheKey = `timeline_${state}_${electionType}_${year}`.toLowerCase().replace(/\s+/g, "_");
    const cachedData = await getCache(cacheKey);
    if (cachedData) return NextResponse.json(cachedData);

    const prompt = `
      You are a Senior Constitutional Advisor for the Election Commission of India. 
      Generate a hyper-reliable 5-step election timeline for:
      State/UT: ${state}
      Election Type: ${electionType}
      Year: ${year}

      Each event MUST strictly follow this JSON schema:
      {
        "events": [
          {
            "title": "Clear concise title",
            "date": "Specific or relative date",
            "description": "Procedural description",
            "why_it_matters": "The legal or constitutional significance",
            "what_if_skipped": "The negative impact if this step is not followed",
            "real_world_example": "A specific historical or practical instance",
            "next_action": "Recommended next action for the user"
          }
        ]
      }

      Context Requirements:
      - Handle edge cases like missed deadlines or already registered users by providing alternative guidance in description.
      - Ensure 100% accuracy based on ECI guidelines.
      - No markdown, no unstructured text.
    `;

    const data = await generateWithFallback(prompt);
    
    // Save to Cache
    await setCache(cacheKey, data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Critical Error in Timeline API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
