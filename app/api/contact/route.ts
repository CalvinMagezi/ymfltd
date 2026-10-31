import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
  const name = clip(body.name, 120);
  const email = clip(body.email, 200);
  const message = clip(body.message, 5000);
  if (!name || !email.includes("@") || !message) {
    return NextResponse.json({ message: "Please add your name, a valid email and a message." }, { status: 400 });
  }
  if (!process.env.SANITY_API_TOKEN) {
    console.error("Contact form: SANITY_API_TOKEN is not set for this environment");
    return NextResponse.json({ message: "The form is not available right now." }, { status: 503 });
  }
  try {
    await sanityClient.create({
      _type: "contact",
      subject: [clip(body.interest, 80), clip(body.project, 80)].filter(Boolean).join(" · ") || "Website enquiry",
      name,
      email,
      phone: clip(body.phone, 40),
      organisation: clip(body.organisation, 160),
      message,
    });
    return NextResponse.json({ message: "Sent" }, { status: 200 });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ message: "Could not send the message." }, { status: 500 });
  }
}
