import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import connectMongo from "@/db/mongoose";
import Appointment from "@/models/Appointment";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectMongo();

        const tid = cookies().get("tm_tid")?.value;
        if (!tid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        if (!mongoose.Types.ObjectId.isValid(tid)) {
            return NextResponse.json({ error: "Invalid therapist id" }, { status: 400 });
        }

        const appts = await Appointment.find({ therapistId: tid })
            .sort({ dateISO: 1 })
            .lean();

        // populate manual (simplu)
        const userIds = Array.from(new Set(appts.map((a: any) => String(a.userId))));
        const users = await User.find({ _id: { $in: userIds } }).select("name").lean();
        const nameMap = new Map(users.map((u: any) => [String(u._id), u.name]));

        const out = appts.map((a: any) => ({
            id: String(a._id),
            userId: String(a.userId),
            userName: nameMap.get(String(a.userId)) || "User",
            dateISO: new Date(a.dateISO).toISOString(),
            durationMin: a.durationMin,
            location: a.location,
            status: a.status,
            notesPreview: a.notesPreview || null,
        }));

        return NextResponse.json({ ok: true, appointments: out }, { status: 200 });
    } catch (e) {
        console.error("THERAPIST APPOINTMENTS GET ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
