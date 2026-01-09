import { NextResponse } from "next/server";
import crypto from "crypto";
import connectMongo from "@/db/mongoose";
import Therapist from "@/models/Therapist";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(req: Request) {
  try {
    await connectMongo();

    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!email || !password) {
      return NextResponse.json(
          { error: "Email and password required." },
          { status: 400 }
      );
    }

    const therapist = await Therapist.findOne({ email });
    if (!therapist || therapist.passwordHash !== hashPassword(password)) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const res = NextResponse.json(
        { ok: true, therapistId: String(therapist._id) },
        { status: 200 }
    );

    res.cookies.set("tm_tid", String(therapist._id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (e) {
    console.error("THERAPIST LOGIN ERROR:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
