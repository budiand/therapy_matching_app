export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import connectMongo from "@/db/mongoose";
import Appointment from "@/models/Appointment";
import User from "@/models/User";

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

        const userIds = Array.from(new Set(appts.map((a: any) => String(a.userId))))
            .filter((id) => mongoose.Types.ObjectId.isValid(id));

        const users = userIds.length
            ? await User.find({ _id: { $in: userIds } }).select("name").lean()
            : [];

        const nameMap = new Map(users.map((u: any) => [String(u._id), u.name || "User"]));

        // ✅ IMPORTANT: UI-ul tău vrea clientId/clientName
        const out = appts.map((a: any) => ({
            id: String(a._id),
            clientId: String(a.userId),
            clientName: nameMap.get(String(a.userId)) || "User",
            dateISO: new Date(a.dateISO).toISOString(),
            durationMin: a.durationMin ?? 50,
            location: a.location,
            status: a.status,
            notesPreview: a.notesPreview || null,
        }));

        return NextResponse.json({ ok: true, appointments: out }, { status: 200, headers: { "Cache-Control": "no-store" } });
    } catch (e) {
        console.error("THERAPIST APPOINTMENTS GET ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
