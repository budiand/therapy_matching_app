export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import connectMongo from "@/db/mongoose";
import User from "@/models/User";
import Appointment from "@/models/Appointment";

function getTherapistIdFromCookie() {
    return cookies().get("tm_tid")?.value || null;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        await connectMongo();

        const tid = getTherapistIdFromCookie();
        if (!tid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

        const userId = params?.id;
        if (!mongoose.Types.ObjectId.isValid(tid) || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ error: "Invalid id" }, { status: 400 });
        }

        // ✅ relation exists if at least one appointment therapist<->user
        const hasRelation = await Appointment.exists({ therapistId: tid, userId });
        if (!hasRelation) return NextResponse.json({ error: "Not found" }, { status: 404 });

        const user = await User.findById(userId).select("name email phone age createdAt updatedAt").lean();
        if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

        const lastAppt = await Appointment.findOne({ therapistId: tid, userId })
            .sort({ dateISO: -1, createdAt: -1 })
            .select("dateISO createdAt")
            .lean();

        const lastSessionISO =
            (lastAppt as any)?.dateISO
                ? new Date((lastAppt as any).dateISO).toISOString()
                : (lastAppt as any)?.createdAt
                    ? new Date((lastAppt as any).createdAt).toISOString()
                    : null;

        return NextResponse.json(
            {
                ok: true,
                user: {
                    id: String((user as any)._id),
                    name: (user as any).name,
                    email: (user as any).email,
                    phone: (user as any).phone,
                    age: (user as any).age,
                    sinceISO: (user as any).createdAt ? new Date((user as any).createdAt).toISOString() : null,
                    lastSessionISO,
                    createdAt: (user as any).createdAt,
                    updatedAt: (user as any).updatedAt,
                },
            },
            { status: 200, headers: { "Cache-Control": "no-store" } }
        );
    } catch (e) {
        console.error("THERAPIST USER GET ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
