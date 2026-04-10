import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Fetch real events from Supabase
    const { data: events } = await supabase
      .from("events")
      .select("title, date, location, venue_type, description, type")
      .order("date", { ascending: true });

    const eventList = events && events.length > 0
      ? events.map((e) =>
          `- ${e.title} | ${e.date} | ${e.location} | ${e.venue_type} | ${e.type === "private" ? "Private" : "Public"} | ${e.description}`
        ).join("\n")
      : "No events currently listed.";

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: `You are an AI Jam Assistant for a music app called Jam Finder, focused on Southwestern Ontario (St. Thomas, London, Toronto area).

You help musicians in two ways:
1. Help them find jam sessions, open mics, and music meetups — using the REAL events listed below
2. Give practical music and jamming tips — gear advice, technique, how to connect with other musicians

REAL UPCOMING EVENTS (pulled live from the database):
${eventList}

When someone asks about events or jams:
- Reference the real events above by name, date, and location
- If they ask about a specific city, filter to relevant events
- If no events match, suggest they check back soon or post their own jam
- For private events, mention they need to contact the host for details

Keep responses friendly, concise, and music-focused. Use a conversational tone.`,
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
