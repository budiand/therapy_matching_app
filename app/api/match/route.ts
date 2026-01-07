import { NextResponse } from "next/server";
import dbConnect from "../../../db/mongoose";
import Therapist from "../../../models/Therapist";

type Intake = {
    city: string;
    mode: "online" | "in_person" | "either";
    language: string;

    reasons: string[];

    therapistGenderPreference?: string; // "No preference" | "Female" | "Male" | "Non-binary"

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

    // -------------------------
    // Format / location fit
    // -------------------------
    const userCity = normalize(intake.city);
    const therapistCity = normalize(t.city);

    if (intake.mode === "online") {
        if (t.online) {
            score += 4;
            reasons.push("Offers online sessions");
        } else {
            score -= 10;
        }
    } else if (intake.mode === "in_person") {
        if (userCity && therapistCity && userCity === therapistCity) {
            score += 4;
            reasons.push("Available in your city");
        } else {
            score -= 6;
        }
    } else {
        // either
        if (userCity && therapistCity && userCity === therapistCity) {
            score += 2;
            reasons.push("Available in your city");
        }
        if (t.online) {
            score += 2;
            reasons.push("Offers online sessions");
        }
    }

    // -------------------------
    // Language fit
    // -------------------------
    if (intake.language && Array.isArray(t.languages)) {
        if (t.languages.includes(intake.language)) {
            score += 2;
            reasons.push(`Speaks ${intake.language}`);
        } else {
            // small penalty, not hard block
            score -= 1;
        }
    }

    // -------------------------
    // Gender preference (soft)
    // -------------------------
    if (intake.therapistGenderPreference && intake.therapistGenderPreference !== "No preference") {
        const prefMap: Record<string, string> = {
            Female: "female",
            Male: "male",
            "Non-binary": "non_binary",
        };

        const pref = prefMap[intake.therapistGenderPreference];
        if (pref && t.gender === pref) {
            score += 1;
            reasons.push("Matches your therapist gender preference");
        }
    }

    // -------------------------
    // Topic overlap (core)
    // -------------------------
    if (Array.isArray(intake.reasons) && intake.reasons.length && Array.isArray(t.specializations)) {
        const overlap = intake.reasons.filter((r) => t.specializations.includes(r));
        if (overlap.length > 0) {
            score += overlap.length * 2;
            reasons.push(
                `Works with your topics: ${overlap.slice(0, 3).join(", ")}${overlap.length > 3 ? "…" : ""}`
            );
        } else {
            // slight penalty if zero overlap
            score -= 1;
        }
    }

    // -------------------------
    // Style fit (core differentiator)
    // -------------------------
    const styleChecks: Array<{
        userKey: keyof Intake;
        therapistKey: string;
        points: number;
        reason: string;
    }> = [
        {
            userKey: "sessionStructure",
            therapistKey: "sessionStructure",
            points: 2,
            reason: "Session structure matches your preference",
        },
        {
            userKey: "therapistActivity",
            therapistKey: "therapistActivity",
            points: 2,
            reason: "Therapist activity level matches your preference",
        },
        {
            userKey: "communicationStyle",
            therapistKey: "communicationStyle",
            points: 1,
            reason: "Communication style matches your preference",
        },
        {
            userKey: "guidanceNeed",
            therapistKey: "guidanceStyle",
            points: 1,
            reason: "Guidance style matches your preference",
        },
        {
            userKey: "focusStyle",
            therapistKey: "focusStyle",
            points: 1,
            reason: "Focus (thoughts/emotions) matches your preference",
        },
    ];

    for (const c of styleChecks) {
        const userVal = intake[c.userKey];
        const therapistVal = t[c.therapistKey];
        if (userVal && therapistVal && userVal === therapistVal) {
            score += c.points;
            reasons.push(c.reason);
        }
    }

    // Homework preference (if therapist has it, it's a bonus when user likes structure/activity)
    if (t.givesHomework) {
        if (intake.sessionStructure === "structured" || intake.therapistActivity === "active") {
            score += 1;
            reasons.push("Practical, exercise-oriented approach (homework)");
        }
    }

    // -------------------------
    // Dealbreakers (soft penalties)
    // -------------------------
    const db = intake.dealbreakers || [];
    if (db.includes("Too passive / mostly listening") && t.therapistActivity === "listening") {
        score -= 3;
    }
    if (db.includes("Too rigid") && t.sessionStructure === "structured") {
        score -= 2;
    }

    return { score, reasons };
}

export async function POST(req: Request) {
    try {
        await dbConnect();

        const intake = (await req.json()) as Intake;

        // basic validation
        if (!intake || !intake.city || !intake.mode || !intake.language) {
            return NextResponse.json(
                { error: "Missing required fields (city, mode, language)." },
                { status: 400 }
            );
        }

        // pull candidates
        const therapists = await Therapist.find({ isActive: true }).lean();

        const scored = therapists
            .map((t: any) => {
                const { score, reasons } = scoreTherapist(t, intake);
                return { ...t, matchScore: score, matchReasons: reasons };
            })
            // keep only decent matches
            .filter((t: any) => t.matchScore >= 3)
            .sort((a: any, b: any) => b.matchScore - a.matchScore);

        return NextResponse.json(scored, { status: 200 });
    } catch (err) {
        console.error("MATCH API ERROR:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
