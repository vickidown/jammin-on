import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
 
const resend = new Resend(process.env.RESEND_API_KEY);
 
export async function POST(req: NextRequest) {
  try {
    const { title, date, location, description, venueType, type } = await req.json();
 
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "vickidown@yahoo.com",
      subject: `🎸 New Jam Posted: ${title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: #064e3b; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎸 New Jam on JamFinder!</h1>
          </div>
 
          <h2 style="font-size: 22px; color: #111;">${title}</h2>
 
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 120px;">📅 Date</td>
              <td style="padding: 8px 0; font-weight: bold;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">📍 Location</td>
              <td style="padding: 8px 0; font-weight: bold;">${location}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">🏛️ Venue Type</td>
              <td style="padding: 8px 0; font-weight: bold;">${venueType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">🔒 Type</td>
              <td style="padding: 8px 0; font-weight: bold;">${type === "private" ? "Private" : "Public"}</td>
            </tr>
          </table>
 
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; color: #444;">${description}</p>
          </div>
 
          <a href="https://jamfinder.ca/events" 
             style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
            View on JamFinder →
          </a>
 
          <p style="margin-top: 32px; font-size: 12px; color: #999;">
            You're receiving this because you're the JamFinder admin.
          </p>
        </div>
      `,
    });
 
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
 
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notify route error:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}