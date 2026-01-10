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

        // 1) All appointments of this therapist
        const appts = await Appointment.find({ therapistId: tid })
            .select("userId dateISO createdAt")
            .lean();

        // 2) compute lastSessionISO per userId
        const lastMap = new Map<string, string>();
        for (const a of appts) {
            const uid = String((a as any).userId);
            const when = (a as any).dateISO || (a as any).createdAt;
            if (!uid || !when) continue;

            const iso = new Date(when).toISOString();
            const prev = lastMap.get(uid);

            if (!prev || new Date(iso).getTime() > new Date(prev).getTime()) {
                lastMap.set(uid, iso);
            }
        }

        const userIds = Array.from(lastMap.keys()).filter((id) => mongoose.Types.ObjectId.isValid(id));
        if (userIds.length === 0) {
            return NextResponse.json({ ok: true, users: [] }, { status: 200, headers: { "Cache-Control": "no-store" } });
        }

        // 3) Fetch users
        const users = await User.find({ _id: { $in: userIds } })
            .select("name email phone age createdAt updatedAt")
            .lean();

        // 4) Output sorted by lastSession
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
            { ok: true, users: out },
            { status: 200, headers: { "Cache-Control": "no-store" } }
        );
    } catch (e) {
        console.error("THERAPIST USERS GET ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
