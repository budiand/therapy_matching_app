import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import connectMongo from "@/db/mongoose";
import User from "@/models/User";
import Booking from "@/models/Booking";

function getTherapistIdFromCookie() {
    return cookies().get("tm_tid")?.value || null;
}

export async function GET() {
    try {
        await connectMongo();

        const tid = getTherapistIdFromCookie();
        if (!tid) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        if (!mongoose.Types.ObjectId.isValid(tid)) {
            return NextResponse.json({ error: "Invalid therapist id" }, { status: 400 });
        }

        // 1) Luăm toate bookings ale terapeutului -> extragem userId distinct
        const bookings = await Booking.find({ therapistId: tid })
            .select("userId dateISO createdAt")
            .lean();

        const mapLastSession = new Map<string, string>(); // userId -> lastSessionISO
        for (const b of bookings) {
            const uid = String((b as any).userId);
            const when = (b as any).dateISO || (b as any).createdAt;
            const iso = when ? new Date(when).toISOString() : null;
            if (!iso) continue;

            const prev = mapLastSession.get(uid);
            if (!prev || new Date(iso).getTime() > new Date(prev).getTime()) {
                mapLastSession.set(uid, iso);
            }
        }

        const userIds = Array.from(mapLastSession.keys());
        if (userIds.length === 0) {
            return NextResponse.json({ ok: true, users: [] }, { status: 200 });
        }

        // 2) Fetch users reali (fără passwordHash)
        const users = await User.find({ _id: { $in: userIds } })
            .select("name email phone age createdAt updatedAt")
            .lean();

        // 3) Atașăm lastSessionISO în răspuns + sortăm
        const out = users
            .map((u: any) => ({
                id: String(u._id),
                name: u.name,
                email: u.email,
                phone: u.phone,
                age: u.age,
                lastSessionISO: mapLastSession.get(String(u._id)) || null,
                createdAt: u.createdAt,
                updatedAt: u.updatedAt,
            }))
            .sort((a, b) => {
                const at = a.lastSessionISO ? new Date(a.lastSessionISO).getTime() : 0;
                const bt = b.lastSessionISO ? new Date(b.lastSessionISO).getTime() : 0;
                return bt - at; // cei mai recenți sus
            });

        return NextResponse.json({ ok: true, users: out }, { status: 200 });
    } catch (e) {
        console.error("THERAPIST USERS GET ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
