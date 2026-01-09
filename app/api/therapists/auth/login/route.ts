import { NextResponse } from "next/server";
import crypto from "crypto";
import connectMongo from "@/db/mongoose";
import Therapist from "@/models/Therapist";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(req: Request) {
  await connectMongo();

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 }
    );
  }

  const therapist = await Therapist.findOne({
    email: email.toLowerCase(),
  });

  if (!therapist || therapist.passwordHash !== hashPassword(password)) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set("tm_tid", String(therapist._id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: true
  });

  return res;
}
