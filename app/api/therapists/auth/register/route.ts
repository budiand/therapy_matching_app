export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import crypto from "crypto";
import connectMongo from "@/db/mongoose";
import Therapist from "@/models/Therapist";
import Availability from "@/models/Availability"; // opțional, vezi mai jos

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

const COOKIE_NAME = "tm_tid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 zile

// enums
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

function asString(v: any) {
  return String(v ?? "").trim();
}
function asLowerEmail(v: any) {
  return asString(v).toLowerCase();
}
function asBool(v: any) {
  return Boolean(v);
}

export async function POST(req: Request) {
  try {
    await connectMongo();

    const body = await req.json().catch(() => ({}));

    // ✅ Basic (din form)
    const name = asString(body?.name);
    const email = asLowerEmail(body?.email);
    const phone = asString(body?.phone);
    const city = asString(body?.city);
    const online = asBool(body?.online);
    const password = String(body?.password ?? "");

    // ✅ Matching required (din form)
    const therapistType = asString(body?.therapistType);
    const sessionStructure = asString(body?.sessionStructure);
    const therapistActivity = asString(body?.therapistActivity);
    const communicationStyle = asString(body?.communicationStyle);
    const guidanceStyle = asString(body?.guidanceStyle);
    const focusStyle = asString(body?.focusStyle);

    // ✅ (optional) alte câmpuri pe care vrei să le salvezi la register
    // dacă le-ai adăugat în schema Therapist:
    const languages = asString(body?.languages); // "ro,en" sau "Romanian, English"
    const gender = asString(body?.gender);       // "female"/"male"/...
    const yearsOfExperienceRaw = body?.yearsOfExperience;
    const yearsOfExperience =
        yearsOfExperienceRaw === undefined || yearsOfExperienceRaw === null || yearsOfExperienceRaw === ""
            ? undefined
            : Number(yearsOfExperienceRaw);

    const description = asString(body?.description);
    const priceRange = asString(body?.priceRange);

    // ✅ validate required
    const missing: string[] = [];
    if (!name) missing.push("name");
    if (!email) missing.push("email");
    if (!phone) missing.push("phone");
    if (!city) missing.push("city");
    if (!password) missing.push("password");

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

    // ✅ validate enums
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

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    // ✅ email unique
    const existing = await Therapist.findOne({ email }).select("_id").lean();
    if (existing) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }

    // ✅ IMPORTANT: salvezi explicit doar câmpurile permise (whitelist)
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

      // optional (doar dacă există în schema Therapist)
      ...(languages ? { languages } : {}),
      ...(gender ? { gender } : {}),
      ...(Number.isFinite(yearsOfExperience) ? { yearsOfExperience } : {}),
      ...(description ? { description } : {}),
      ...(priceRange ? { priceRange } : {}),
    });

    // ✅ opțional: creezi availability empty la register
    // ca să nu ai “not found” după login
    try {
      await Availability.updateOne(
          { therapistId: created._id },
          { $setOnInsert: { therapistId: created._id, weekly: {} } },
          { upsert: true }
      );
    } catch (e) {
      // nu blocăm register-ul dacă availability fail
      console.warn("AVAILABILITY INIT WARN:", e);
    }

    const res = NextResponse.json(
        { ok: true, therapistId: String(created._id) },
        { status: 201, headers: { "Cache-Control": "no-store" } }
    );

    res.cookies.set(COOKIE_NAME, String(created._id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: COOKIE_MAX_AGE,
    });

    return res;
  } catch (e) {
    console.error("THERAPIST REGISTER ERROR:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
