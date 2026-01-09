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

    const body = await req.json();

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const phone = String(body?.phone || "").trim();
    const password = String(body?.password || "");
    const city = String(body?.city || "").trim();
    const online = Boolean(body?.online);

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const existing = await Therapist.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered." },
        { status: 409 }
      );
    }

    const created = await Therapist.create({
      name,
      email,
      phone,
      city,
      online,
      passwordHash: hashPassword(password),
    });

    const res = NextResponse.json(
      { ok: true, therapistId: String(created._id) },
      { status: 201 }
    );

    // 🍪 cookie TERAPEUT
    res.cookies.set("tm_tid", String(created._id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: true,
    });

    return res;
  } catch (e) {
    console.error("THERAPIST REGISTER ERROR:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
