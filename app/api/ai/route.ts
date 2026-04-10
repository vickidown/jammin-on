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
      max_tokens: 2048,
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
        } as any,
      ],
      system: `You are an AI Jam Assistant for a music app called Jam Finder, focused on Southwestern Ontario (St. Thomas, London, Toronto area).
 
You help musicians in two ways:
1. Help them find jam sessions, open mics, and music meetups — using BOTH the real events in the database AND web search for events not yet listed
2. Give practical music and jamming tips
 
REAL EVENTS ALREADY IN JAMFINDER:
${eventList}
 
INSTRUCTIONS:
- For event-related questions, ALWAYS search the web for additional local events not in the database
- When you find events via web search, present them clearly with name, date, location, and a note that they're "not yet on JamFinder"
- Format any web-found events like this so they can be added to the app:
  🌐 [Event Name] | [Date] | [Location] | [Brief description] | [latitude] | [longitude] | [venue_type] | ADD_TO_APP
- venue_type must be one of: bar, community, private-home, studio, karaoke, open-mic, other
- For recurring events (every Saturday, weekly, etc.), use the next upcoming occurrence date in YYYY-MM-DD format
- Always convert dates to YYYY-MM-DD format
- For coordinates, look up the actual venue address and provide real lat/lng coordinates for the specific city/venue in Ontario. For example London ON is 42.9849,-81.2451 and St. Thomas ON is 42.7775,-81.1823 and Toronto ON is 43.6532,-79.3832. Try to be as specific as possible to the actual venue.
- For events already in JamFinder, show them normally without the ADD_TO_APP tag
- Keep responses friendly and music-focused`,
      messages: [{ role: "user", content: message }],
    });
 
    // Collect all text blocks including tool results
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
