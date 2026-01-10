import { NextResponse } from "next/server";
import crypto from "crypto";
import connectMongo from "@/db/mongoose";
import Therapist from "@/models/Therapist";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

const THERAPIST_TYPES = new Set([
  "clinical_psychologist",
  "psychotherapist",
  "counselor",
  "psychiatrist",
  "trainee_supervised",
  "other",
]);

const SESSION_STRUCTURES = new Set(["structured", "semi", "free"]);
const THERAPIST_ACTIVITIES = new Set(["active", "balanced", "listening"]);
const COMMUNICATION_STYLES = new Set(["monologue", "questions", "mix"]);
const GUIDANCE_STYLES = new Set(["autonomous", "need_push", "mix"]);
const FOCUS_STYLES = new Set(["thoughts", "emotions", "mix"]);

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

    // REQUIRED (by your schema)
    const therapistType = String(body?.therapistType || "").trim();
    const sessionStructure = String(body?.sessionStructure || "").trim();
    const therapistActivity = String(body?.therapistActivity || "").trim();
    const communicationStyle = String(body?.communicationStyle || "").trim();
    const guidanceStyle = String(body?.guidanceStyle || "").trim();
    const focusStyle = String(body?.focusStyle || "").trim();

    // Validate required fields clearly
    const missing: string[] = [];
    if (!name) missing.push("name");
    if (!email) missing.push("email");
    if (!phone) missing.push("phone");
    if (!password) missing.push("password");
    if (!city) missing.push("city");

    if (!therapistType) missing.push("therapistType");
    if (!sessionStructure) missing.push("sessionStructure");
    if (!therapistActivity) missing.push("therapistActivity");
    if (!communicationStyle) missing.push("communicationStyle");
    if (!guidanceStyle) missing.push("guidanceStyle");
    if (!focusStyle) missing.push("focusStyle");

    if (missing.length) {
      return NextResponse.json(
          { error: `Missing required fields: ${missing.join(", ")}` },
          { status: 400 }
      );
    }

    // Validate enums (avoid saving invalid values)
    if (!THERAPIST_TYPES.has(therapistType)) {
      return NextResponse.json({ error: "Invalid therapistType." }, { status: 400 });
    }
    if (!SESSION_STRUCTURES.has(sessionStructure)) {
      return NextResponse.json({ error: "Invalid sessionStructure." }, { status: 400 });
    }
    if (!THERAPIST_ACTIVITIES.has(therapistActivity)) {
      return NextResponse.json({ error: "Invalid therapistActivity." }, { status: 400 });
    }
    if (!COMMUNICATION_STYLES.has(communicationStyle)) {
      return NextResponse.json({ error: "Invalid communicationStyle." }, { status: 400 });
    }
    if (!GUIDANCE_STYLES.has(guidanceStyle)) {
      return NextResponse.json({ error: "Invalid guidanceStyle." }, { status: 400 });
    }
    if (!FOCUS_STYLES.has(focusStyle)) {
      return NextResponse.json({ error: "Invalid focusStyle." }, { status: 400 });
    }

    // Check existing
    const existing = await Therapist.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }

    const created = await Therapist.create({
      name,
      email,
      phone,
      city,
      online,
      passwordHash: hashPassword(password),

      therapistType,
      sessionStructure,
      therapistActivity,
      communicationStyle,
      guidanceStyle,
      focusStyle,
    });

    const res = NextResponse.json(
        { ok: true, therapistId: String(created._id) },
        { status: 201 }
    );

    // Cookie (secure only in production; otherwise local dev breaks)
    res.cookies.set("tm_tid", String(created._id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (e) {
    console.error("THERAPIST REGISTER ERROR:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
