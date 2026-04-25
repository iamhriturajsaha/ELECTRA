import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// --- Simple in-memory rate limiter ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;       // max requests
const RATE_WINDOW_MS = 60_000; // per 60 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// --- Input sanitizer: strips HTML tags ---
function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim().slice(0, 2000);
}

/** Allowed response languages — prevents prompt injection via language field */
const ALLOWED_LANGUAGES = new Set([
  "English", "Hindi", "Tamil", "Telugu", "Bengali",
  "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi",
  "Odia", "Urdu", "Assamese",
]);

const getSystemPrompt = (language: string) => `
You are ELECTRA, the specialized Election Education AI for India.
Provide clear, accurate, and professional advice on voter registration and polling.
Politely decline any non-election related queries.

CRITICAL: You must respond entirely in ${language}.
Maintain the futuristic and professional tone.
Keep your responses concise and to the point.
`;

export async function POST(req: Request) {
  // Enforce JSON content-type
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ content: "Invalid content type." }, { status: 415 });
  }

  // Rate limiting
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "anonymous";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { content: "Rate limit exceeded. Please wait before sending more messages." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { messages, language: rawLanguage = "English" } = body;

    // Validate language against allowlist — prevents prompt injection
    const language = ALLOWED_LANGUAGES.has(rawLanguage) ? rawLanguage : "English";

    // Input validation
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ content: "Invalid request format." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables.");
      return NextResponse.json({ content: "System Error: API key is missing. Please set GEMINI_API_KEY in .env.local" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const userMessages = messages.filter((msg: { role: string }) => msg.role === "user");
    const rawMessage = userMessages[userMessages.length - 1]?.content || "";
    const latestMessage = sanitize(rawMessage);

    if (!latestMessage) {
      return NextResponse.json({ content: "Empty message received." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: getSystemPrompt(language),
    });
    
    // Use streaming for faster first-token response
    const result = await model.generateContentStream(latestMessage);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullText = "";
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              fullText += text;
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();

          // Fire-and-forget: log to Firestore after streaming completes (non-blocking)
          addDoc(collection(db, "chat_logs"), {
            ip,
            language,
            messageLength: latestMessage.length,
            responseLength: fullText.length,
            timestamp: serverTimestamp(),
          }).catch((logErr) => {
            console.warn("Firestore audit log failed:", logErr);
          });
        } catch (streamError) {
          console.error("Stream error:", streamError);
          controller.enqueue(encoder.encode("AI LINK FAILURE. Please verify your connection."));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("GEMINI_CRITICAL_FAILURE:", errorMessage);
    return NextResponse.json(
      { content: "AI LINK FAILURE. Please verify your connection." },
      { status: 500 }
    );
  }
}
