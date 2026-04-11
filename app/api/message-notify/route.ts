import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { senderName, recipientId, body } = await req.json();

    // Always notify admin for now
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "vickidown@yahoo.com",
      subject: `💬 New JamFinder Message from ${senderName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: #064e3b; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">💬 New Message on JamFinder</h1>
          </div>
          <p style="font-size: 16px; color: #374151;"><strong>${senderName}</strong> sent a message to a musician:</p>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #16a34a;">
            <p style="margin: 0; color: #374151;">${body}</p>
          </div>
          <a href="https://jammin-on.ca/inbox" style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
            View in Inbox →
          </a>
        </div>
      `,
    });

    if (error) console.error("Email error:", error);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Message notify error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}