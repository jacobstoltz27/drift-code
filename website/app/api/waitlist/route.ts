import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: string; vibe?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const vibe = body.vibe?.trim() || null;

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 }
    );
  }

  // Graceful fallback before Supabase is wired up.
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json(
      {
        ok: true,
        pending: true,
        message: "You're on the list (local mode — connect Supabase to store it).",
      },
      { status: 200 }
    );
  }

  const { error } = await supabase
    .from("waitlist")
    .insert({ email, vibe, source: "website" });

  if (error) {
    // 23505 = unique violation → already on the list. Treat as success.
    if (error.code === "23505") {
      return NextResponse.json(
        { ok: true, message: "You're already on the list — see you out there." },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong. Try again in a moment." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { ok: true, message: "You're on the list. The world just got bigger." },
    { status: 200 }
  );
}
