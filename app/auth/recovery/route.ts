import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/site";

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${site.url}/account/reset-password`);
  }

  return NextResponse.redirect(`${site.url}/account/reset-password?error=expired`);
}