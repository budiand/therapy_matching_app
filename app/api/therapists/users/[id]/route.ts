import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import connectMongo from "@/db/mongoose";
import User from "@/models/User";
import Booking from "@/models/Booking";

function getTherapistIdFromCookie() {
    return cookies().get("tm_tid")?.value || null;
}

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectMongo();

        const tid = getTherapistIdFromCookie();
        if (!tid) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const userId = params?.id;
        if (!mongoose.Types.ObjectId.isValid(tid) || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ error: "Invalid id" }, { status: 400 });
        }

        // ✅ SECURITY: userul trebuie să fie "al" terapeutului (prin Booking)
        const hasRelation = await Booking.exists({
            therapistId: tid,
            userId: userId,
        });

        if (!hasRelation) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const user = await User.findById(userId)
            .select("name email phone age createdAt updatedAt")
            .lean();

        if (!user) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        // Optional: aducem și ultima ședință (din bookings)
        const lastBooking = await Booking.findOne({ therapistId: tid, userId })
            .sort({ dateISO: -1, createdAt: -1 })
            .select("dateISO createdAt")
            .lean();

        const lastSessionISO =
            (lastBooking as any)?.dateISO
                ? new Date((lastBooking as any).dateISO).toISOString()
                : (lastBooking as any)?.createdAt
                    ? new Date((lastBooking as any).createdAt).toISOString()
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
                    lastSessionISO,
                    createdAt: (user as any).createdAt,
                    updatedAt: (user as any).updatedAt,
                },
            },
            { status: 200 }
        );
    } catch (e) {
        console.error("THERAPIST USER GET ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
