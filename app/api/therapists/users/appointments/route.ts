import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import connectMongo from "@/db/mongoose";
import Appointment from "@/models/Appointment";
import Therapist from "@/models/Therapist";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectMongo();

        const uid = cookies().get("tm_uid")?.value;
        if (!uid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        if (!mongoose.Types.ObjectId.isValid(uid)) {
            return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
        }

        const appts = await Appointment.find({ userId: uid })
            .sort({ dateISO: 1 })
            .lean();

        const therapistIds = Array.from(new Set(appts.map((a: any) => String(a.therapistId))));
        const therapists = await Therapist.find({ _id: { $in: therapistIds } }).select("name").lean();
        const nameMap = new Map(therapists.map((t: any) => [String(t._id), t.name]));

        const out = appts.map((a: any) => ({
            id: String(a._id),
            therapistId: String(a.therapistId),
            therapistName: nameMap.get(String(a.therapistId)) || "Therapist",
            dateISO: new Date(a.dateISO).toISOString(),
            durationMin: a.durationMin,
            location: a.location,
            status: a.status,
        }));

        return NextResponse.json({ ok: true, appointments: out }, { status: 200 });
    } catch (e) {
        console.error("USER APPOINTMENTS GET ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
