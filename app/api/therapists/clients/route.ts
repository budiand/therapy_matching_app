export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import connectMongo from "@/db/mongoose";
import Appointment from "@/models/Appointment";
import User from "@/models/User";

function getTherapistIdFromCookie() {
    return cookies().get("tm_tid")?.value || null;
}

export async function GET() {
    try {
        await connectMongo();

        const tid = getTherapistIdFromCookie();
        if (!tid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        if (!mongoose.Types.ObjectId.isValid(tid)) {
            return NextResponse.json({ error: "Invalid therapist id" }, { status: 400 });
        }

        // 1) all appointments for this therapist
        const appts = await Appointment.find({ therapistId: tid })
            .select("userId dateISO createdAt")
            .lean();

        // 2) compute lastSessionISO per userId
        const lastMap = new Map<string, string>();
        for (const a of appts) {
            const uid = String((a as any).userId || "");
            if (!mongoose.Types.ObjectId.isValid(uid)) continue;

            const when = (a as any).dateISO || (a as any).createdAt;
            if (!when) continue;

            const iso = new Date(when).toISOString();
            const prev = lastMap.get(uid);

            if (!prev || new Date(iso).getTime() > new Date(prev).getTime()) {
                lastMap.set(uid, iso);
            }
        }

        const userIds = Array.from(lastMap.keys());
        if (userIds.length === 0) {
            return NextResponse.json(
                { ok: true, clients: [] },
                { status: 200, headers: { "Cache-Control": "no-store" } }
            );
        }

        // 3) load users
        const users = await User.find({ _id: { $in: userIds } })
            .select("name email phone age createdAt updatedAt")
            .lean();

        // 4) response
        const out = users
            .map((u: any) => ({
                id: String(u._id),
                name: u.name,
                email: u.email,
                phone: u.phone,
                age: u.age,
                sinceISO: u.createdAt ? new Date(u.createdAt).toISOString() : null,
                lastSessionISO: lastMap.get(String(u._id)) || null,
                createdAt: u.createdAt,
                updatedAt: u.updatedAt,
            }))
            .sort((a, b) => {
                const at = a.lastSessionISO ? new Date(a.lastSessionISO).getTime() : 0;
                const bt = b.lastSessionISO ? new Date(b.lastSessionISO).getTime() : 0;
                return bt - at;
            });

        return NextResponse.json(
            { ok: true, clients: out },
            { status: 200, headers: { "Cache-Control": "no-store" } }
        );
    } catch (e) {
        console.error("THERAPIST CLIENTS GET ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
