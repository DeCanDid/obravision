import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { isLocked, recordFailure } from "@/lib/rate-limit";
import { sendContactEmail } from "@/lib/mailgun";

const SUBJECTS = ["General enquiry", "Wholesale or bulk quote", "Help with an order", "Other"];
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(request: Request) {
  const forwarded = (await headers()).get("x-forwarded-for");
  const key = `contact:${forwarded?.split(",")[0].trim() ?? "unknown"}`;

  if (isLocked(key)) {
    return fail("You have sent several messages recently. Please try again in a few minutes, or message us on WhatsApp.", 429);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.");
  }

  // Hidden field that real visitors never fill in; bots do
  if (String(body.website ?? "").trim() !== "") return NextResponse.json({ ok: true });

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const subject = String(body.subject ?? "");
  const message = String(body.message ?? "").trim();

  if (name.length < 2 || name.length > 80) return fail("Please enter your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) return fail("Please enter a valid email address.");
  if (phone.length > 30) return fail("Please enter a valid phone number.");
  if (!SUBJECTS.includes(subject)) return fail("Please choose a subject.");
  if (message.length < 10) return fail("Please write a little more so we can help you properly.");
  if (message.length > 2000) return fail("Your message is too long. Please keep it under 2000 characters.");

  recordFailure(key); // counts every submission toward the limit

  try {
    await sendContactEmail({ name, email, phone: phone || null, subject, message });
  } catch (err) {
    console.error("Mailgun contact:", err);
    return fail("We could not send your message right now. Please message us on WhatsApp instead.", 502);
  }

  return NextResponse.json({ ok: true });
}