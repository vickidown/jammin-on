import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: `You are an AI Jam Assistant for a music app called Jam Finder. 
You help musicians in two ways:
1. Help them find jam sessions, open mics, and music meetups near them (ask for their city/location if not provided)
2. Give practical music and jamming tips — gear advice, technique, how to connect with other musicians, etc.

Keep responses friendly, concise, and music-focused. Use a conversational tone. 
If someone asks about finding jams, ask for their location and genre preferences.
If they ask for tips, give actionable, specific advice.`,
      messages: [{ role: "user", content: message }],
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { type: "text"; text: string }).text)
      .join("\n");

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Anthropic API error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
