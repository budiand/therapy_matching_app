import { NextResponse } from "next/server";
import crypto from "crypto";
import connectMongo from "@/db/mongoose";
import Therapist from "@/models/Therapist";

export const dynamic = "force-dynamic";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password, "utf8").digest("hex");
}

// --- enums (trebuie să fie IDENTICE cu schema ta) ---
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

const PACE = new Set(["slow", "medium", "fast"]);

const SPECIALIZATIONS = new Set([
  // Emotional health
  "Anxiety",
  "Depression",
  "Panic attacks",
  "Burnout",
  "Stress",
  "Sleep problems",
  "Emotional regulation",
  "Overthinking / rumination",
  "Perfectionism",
  "Trauma",
  "Grief",

  // Relationships
  "Relationships",
  "Family",
  "Couples",
  "Communication issues",
  "Attachment / fear of abandonment",
  "Conflict & boundaries",
  "Social difficulties",
  "Social anxiety",

  // Identity & personal life
  "Self-esteem",
  "LGBTQ+",
  "Gender identity",
  "Meaning & life direction",
  "Self-exploration",

  // Professional life
  "Career",
  "Performance",
  "Major decisions",
  "Work-life balance",

  // Behaviors
  "Procrastination",
  "Habits I want to change",
  "Addictions",
  "Anger management",

  // Clinical topics
  "ADHD",
  "Eating disorders",
]);

const APPROACHES = new Set([
  "CBT",
  "ACT",
  "Psychodynamic",
  "Humanistic",
  "Schema therapy",
  "Systemic",
  "Integrative",
  "Mindfulness-based",
  "Gestalt",
  "DBT",
  "EMDR",
]);

const GENDER = new Set(["female", "male", "non_binary", "other", "prefer_not_to_say"]);
const AGE_GROUPS = new Set(["children", "teens", "adults", "seniors"]);

function asString(v: any) {
  return String(v ?? "").trim();
}

function asLowerEmail(v: any) {
  return String(v ?? "").trim().toLowerCase();
}

function asBool(v: any) {
  return Boolean(v);
}

function asNumberOrUndef(v: any) {
  if (v === null || v === undefined || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function asStringArray(v: any) {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x).trim()).filter(Boolean);
}

function filterEnumArray(arr: string[], allowed: Set<string>) {
  return arr.filter((x) => allowed.has(x));
}

export async function POST(req: Request) {
  try {
    await connectMongo();

    const body = await req.json().catch(() => ({}));

    // --- required ---
    const name = asString(body?.name);
    const email = asLowerEmail(body?.email);
    const password = String(body?.password ?? "");

    const city = asString(body?.city);

    const therapistType = asString(body?.therapistType);
    const sessionStructure = asString(body?.sessionStructure);
    const therapistActivity = asString(body?.therapistActivity);
    const communicationStyle = asString(body?.communicationStyle);
    const guidanceStyle = asString(body?.guidanceStyle);
    const focusStyle = asString(body?.focusStyle);

    const missing: string[] = [];
    if (!name) missing.push("name");
    if (!email) missing.push("email");
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

    // --- enum validation for required ---
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

    // --- check existing ---
    const existing = await Therapist.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }

    // --- optional fields (sanitize) ---
    const phone = asString(body?.phone) || undefined;
    const age = asNumberOrUndef(body?.age);
    const yearsOfExperience = asNumberOrUndef(body?.yearsOfExperience);

    const gender = asString(body?.gender);
    const genderSafe = GENDER.has(gender) ? gender : undefined;

    const online = asBool(body?.online);
    const acceptsOnlineOnly = asBool(body?.acceptsOnlineOnly);
    const worksWithHabits = asBool(body?.worksWithHabits);

    const languages = asStringArray(body?.languages); // ex ["Romanian","English"]
    const priceRange = asString(body?.priceRange) || undefined;
    const description = asString(body?.description) || undefined;

    const licenseNumber = asString(body?.licenseNumber) || undefined;
    const professionalBody = asString(body?.professionalBody) || undefined;
    const profilePhotoUrl = asString(body?.profilePhotoUrl) || undefined;

    const specializations = filterEnumArray(asStringArray(body?.specializations), SPECIALIZATIONS);
    const approaches = filterEnumArray(asStringArray(body?.approaches), APPROACHES);

    const directness = asNumberOrUndef(body?.directness);
    const warmth = asNumberOrUndef(body?.warmth);

    const pace = asString(body?.pace);
    const paceSafe = PACE.has(pace) ? pace : undefined;

    const givesHomework = asBool(body?.givesHomework);
    const offersStructuredPrograms = asBool(body?.offersStructuredPrograms);

    const ageGroups = filterEnumArray(asStringArray(body?.ageGroups), AGE_GROUPS);

    const primaryCredentialUrl = asString(body?.primaryCredentialUrl) || undefined;

    // credentials: trebuie să fie array de obiecte cu fileUrl obligatoriu
    const credentialsIn = Array.isArray(body?.credentials) ? body.credentials : [];
    const credentials = credentialsIn
        .map((c: any) => ({
          label: asString(c?.label) || undefined,
          type: asString(c?.type) || undefined,
          relatedApproaches: filterEnumArray(asStringArray(c?.relatedApproaches), APPROACHES),
          issuer: asString(c?.issuer) || undefined,
          issuedAt: c?.issuedAt ? new Date(c.issuedAt) : undefined,
          expiresAt: c?.expiresAt ? new Date(c.expiresAt) : undefined,
          fileUrl: asString(c?.fileUrl), // required by schema
          fileName: asString(c?.fileName) || undefined,
          fileType: asString(c?.fileType) || undefined,
        }))
        .filter((c: any) => c.fileUrl); // păstrăm doar cele valide

    const created = await Therapist.create({
      // required
      name,
      email,
      city,
      passwordHash: hashPassword(password),

      therapistType,
      sessionStructure,
      therapistActivity,
      communicationStyle,
      guidanceStyle,
      focusStyle,

      // optional (saved if provided)
      phone,
      age,
      gender: genderSafe,
      languages,

      online,
      acceptsOnlineOnly,
      worksWithHabits,

      priceRange,
      description,
      yearsOfExperience,

      licenseNumber,
      professionalBody,
      profilePhotoUrl,

      specializations,
      approaches,

      directness: directness ?? undefined,
      warmth: warmth ?? undefined,
      pace: paceSafe ?? undefined,

      givesHomework,
      offersStructuredPrograms,

      ageGroups,

      primaryCredentialUrl,
      credentials,

      // meta defaults are handled by schema
    });

    const res = NextResponse.json(
        { ok: true, therapistId: String(created._id) },
        { status: 201 }
    );

    res.cookies.set("tm_tid", String(created._id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return res;
  } catch (e) {
    console.error("THERAPIST REGISTER ERROR:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
