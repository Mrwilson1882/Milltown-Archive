import { NextResponse } from "next/server";
import { COOKIE_NAME, inboxConfigured, issueToken, passwordMatches } from "@/lib/whatsapp/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Sign in to the inbox. POST a password; DELETE to sign out. */
export async function POST(request: Request) {
  if (!inboxConfigured()) {
    return NextResponse.json(
      { ok: false, message: "INBOX_PASSWORD is not set on this deployment." },
      { status: 503 },
    );
  }

  let password: unknown;
  try {
    password = ((await request.json()) as { password?: unknown }).password;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  if (typeof password !== "string" || !passwordMatches(password)) {
    return NextResponse.json({ ok: false, message: "That password is not right." }, { status: 401 });
  }

  const token = issueToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: token.maxAge,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
