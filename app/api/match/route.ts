import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "../../../db/mongoose";
import Therapist from "../../../models/Therapist";
import User from "../../../models/User";

type Intake = {
  city: string;
  mode: "online" | "in_person" | "either";
  language: string;
  reasons: string[];
  therapistGenderPreference?: string;
  sessionStructure?: "structured" | "semi" | "free";
  therapistActivity?: "active" | "balanced" | "listening";
  communicationStyle?: "monologue" | "questions" | "mix";
  guidanceNeed?: "autonomous" | "need_push" | "mix";
  focusStyle?: "thoughts" | "emotions" | "mix";
  dealbreakers?: string[];
};

function normalize(s?: string) {
  return (s || "").trim().toLowerCase();
}

function scoreTherapist(t: any, intake: Intake) {
  let score = 0;
  const reasons: string[] = [];

  const userCity = normalize(intake.city);
  const therapistCity = normalize(t.city);

  if (intake.mode === "online") {
    if (t.online) {
      score += 4;
      reasons.push("Offers online sessions");
    } else score -= 10;
  } else if (intake.mode === "in_person") {
    if (userCity && therapistCity && userCity === therapistCity) {
      score += 4;
      reasons.push("Available in your city");
    } else score -= 6;
  } else {
    if (userCity && therapistCity && userCity === therapistCity) {
      score += 2;
      reasons.push("Available in your city");
    }
    if (t.online) {
      score += 2;
      reasons.push("Offers online sessions");
    }
  }

  if (intake.language && Array.isArray(t.languages)) {
    if (t.languages.includes(intake.language)) {
      score += 2;
      reasons.push(`Speaks ${intake.language}`);
    } else score -= 1;
  }

  if (
    intake.therapistGenderPreference &&
    intake.therapistGenderPreference !== "No preference"
  ) {
    const map: Record<string, string> = {
      Female: "female",
      Male: "male",
      "Non-binary": "non_binary",
    };
    if (map[intake.therapistGenderPreference] === t.gender) {
      score += 1;
      reasons.push("Matches your therapist gender preference");
    }
  }

  if (Array.isArray(intake.reasons) && Array.isArray(t.specializations)) {
    const overlap = intake.reasons.filter((r) =>
      t.specializations.includes(r)
    );
    if (overlap.length) {
      score += overlap.length * 2;
      reasons.push(
        `Works with your topics: ${overlap.slice(0, 3).join(", ")}`
      );
    } else score -= 1;
  }

  const checks = [
    ["sessionStructure", "sessionStructure", 2, "Session structure matches"],
    ["therapistActivity", "therapistActivity", 2, "Activity level matches"],
    ["communicationStyle", "communicationStyle", 1, "Communication style matches"],
    ["guidanceNeed", "guidanceStyle", 1, "Guidance style matches"],
    ["focusStyle", "focusStyle", 1, "Focus style matches"],
  ] as const;

  for (const [u, tKey, pts, label] of checks) {
    if ((intake as any)[u] && (intake as any)[u] === t[tKey]) {
      score += pts;
      reasons.push(label);
    }
  }

  const db = intake.dealbreakers || [];
  if (db.includes("Too passive / mostly listening") && t.therapistActivity === "listening")
    score -= 3;
  if (db.includes("Too rigid") && t.sessionStructure === "structured")
    score -= 2;

  return { score, reasons };
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const intake = (await req.json()) as Intake;
    if (!intake?.city || !intake?.mode || !intake?.language) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const therapists = await Therapist.find({ isActive: true }).lean();

    const scored = therapists
      .map((t: any) => {
        const { score, reasons } = scoreTherapist(t, intake);
        return { therapistId: t._id, score, reasons };
      })
      .filter((t) => t.score >= 3)
      .sort((a, b) => b.score - a.score);

    const uid = cookies().get("tm_uid")?.value;
    if (uid) {
      await User.findByIdAndUpdate(uid, {
        recommendedTherapists: scored,
      });
    }

    const full = await Therapist.find({
      _id: { $in: scored.map((s) => s.therapistId) },
    }).lean();

    const map = new Map(scored.map((s) => [String(s.therapistId), s]));
    const out = full.map((t) => ({
      ...t,
      matchScore: map.get(String(t._id))?.score,
      matchReasons: map.get(String(t._id))?.reasons,
    }));

    return NextResponse.json(out, { status: 200 });
  } catch (e) {
    console.error("MATCH API ERROR:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
