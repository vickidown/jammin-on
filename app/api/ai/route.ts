import { NextRequest } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are an expert Ontario music jam coordinator. 
          Current public events: Open Mic in London on April 12, Blues Jam in St. Thomas on April 15, Folk Circle in Toronto on April 18.
          Help the user with jam recommendations, suggestions, or generating event ideas.
          User question: ${prompt}`,
        },
      ],
    });


    const responseText = message.content[0].type === "text" 
      ? message.content[0].text 
      : "No response from Claude.";

    return Response.json({ response: responseText });
  } catch (error) {
    console.error(error);
    return Response.json(
      { response: "Sorry, there was an error with the AI. Please check your ANTHROPIC_API_KEY in .env.local and Vercel." },
      { status: 500 }
    );
  }
}