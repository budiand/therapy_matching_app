import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectMongo from "@/db/mongoose";
import Availability from "@/models/Availability";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type DayKey = (typeof DAYS)[number];

type Slot = { start: string; end: string };
type Weekly = Record<DayKey, Slot[]>;

function cleanTime(t: any): string | null {
    const s = String(t || "").trim();
    if (!/^\d{2}:\d{2}$/.test(s)) return null;
    return s;
}

function emptyWeekly(): Weekly {
    return DAYS.reduce((acc, d) => {
        acc[d] = [];
        return acc;
    }, {} as Weekly);
}

export async function GET() {
    try {
        await connectMongo();

        const tid = cookies().get("tm_tid")?.value;
        if (!tid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

        const doc = await Availability.findOne({ therapistId: tid }).lean();
        return NextResponse.json(
            { ok: true, weekly: (doc as any)?.weekly ?? emptyWeekly() },
            { status: 200 }
        );
    } catch (e) {
        console.error("AVAILABILITY GET ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await connectMongo();

        const tid = cookies().get("tm_tid")?.value;
        if (!tid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

        const body = await req.json().catch(() => ({}));
        const weeklyIn = body?.weekly;

        if (!weeklyIn || typeof weeklyIn !== "object") {
            return NextResponse.json({ error: "Missing weekly availability." }, { status: 400 });
        }

        // sanitize payload
        const weekly: Weekly = emptyWeekly();
        for (const d of DAYS) {
            const arr = Array.isArray(weeklyIn[d]) ? weeklyIn[d] : [];
            weekly[d] = arr
                .map((s: any) => ({ start: cleanTime(s?.start), end: cleanTime(s?.end) }))
                .filter((s: any) => s.start && s.end) as Slot[];
        }

        // Upsert (update), then re-read (avoids null + typing pain)
        await Availability.updateOne(
            { therapistId: tid },
            { $set: { therapistId: tid, weekly } },
            { upsert: true }
        );

        const saved = await Availability.findOne({ therapistId: tid }).lean();

        return NextResponse.json(
            { ok: true, weekly: (saved as any)?.weekly ?? emptyWeekly() },
            { status: 200 }
        );
    } catch (e) {
        console.error("AVAILABILITY PUT ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
