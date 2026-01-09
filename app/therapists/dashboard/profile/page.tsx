import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectMongo from "@/db/mongoose";
import Therapist from "@/models/Therapist";

export async function GET() {
    try {
        await connectMongo();

        const tid = cookies().get("tm_tid")?.value;
        if (!tid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

        const therapist = await Therapist.findById(tid).select("-passwordHash");
        if (!therapist) return NextResponse.json({ error: "Therapist not found" }, { status: 404 });

        return NextResponse.json({ ok: true, therapist }, { status: 200 });
    } catch (e) {
        console.error("ME GET ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await connectMongo();

        const tid = cookies().get("tm_tid")?.value;
        if (!tid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

        const body = await req.json().catch(() => ({}));

        // IMPORTANT: don’t allow email/passwordHash change here
        const allowed = {
            name: body?.name,
            phone: body?.phone,
            city: body?.city,
            online: body?.online,

            age: body?.age ?? undefined,
            gender: body?.gender,
            languages: Array.isArray(body?.languages) ? body.languages : [],

            therapistType: body?.therapistType,
            yearsOfExperience: body?.yearsOfExperience ?? undefined,
            acceptsOnlineOnly: body?.acceptsOnlineOnly,
            priceRange: body?.priceRange,
            description: body?.description,

            specializations: Array.isArray(body?.specializations) ? body.specializations : [],
            approaches: Array.isArray(body?.approaches) ? body.approaches : [],

            sessionStructure: body?.sessionStructure,
            therapistActivity: body?.therapistActivity,
            communicationStyle: body?.communicationStyle,
            guidanceStyle: body?.guidanceStyle,
            focusStyle: body?.focusStyle,

            givesHomework: body?.givesHomework,
            offersStructuredPrograms: body?.offersStructuredPrograms,
            worksWithHabits: body?.worksWithHabits,

            directness: body?.directness,
            warmth: body?.warmth,
            pace: body?.pace,
        };

        const updated = await Therapist.findByIdAndUpdate(tid, allowed, {
            new: true,
            runValidators: true,
        }).select("-passwordHash");

        if (!updated) return NextResponse.json({ error: "Therapist not found" }, { status: 404 });

        return NextResponse.json({ ok: true, therapist: updated }, { status: 200 });
    } catch (e) {
        console.error("ME PUT ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
