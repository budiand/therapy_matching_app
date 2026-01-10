import { NextResponse } from "next/server";
import Booking from "@/models/Booking";
import connectMongo from "@/db/mongoose";
import { cookies } from "next/headers";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectMongo();
    const body = await req.json().catch(() => ({}));

    const userId = cookies().get("tm_uid")?.value;
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { therapistId, dateISO, durationMin = 50, location } = body;

    if (!therapistId || !mongoose.Types.ObjectId.isValid(therapistId)) {
      return NextResponse.json({ error: "Invalid therapistId" }, { status: 400 });
    }

    if (!dateISO) {
      return NextResponse.json({ error: "Missing dateISO" }, { status: 400 });
    }

    if (!["online", "in_person"].includes(location)) {
      return NextResponse.json({ error: "Invalid location" }, { status: 400 });
    }

    const created = await Booking.create({
      therapistId,
      userId, // sau clientId dacă așa e schema ta
      dateISO: new Date(dateISO),
      durationMin,
      location,
      status: "scheduled",
    });

    return NextResponse.json({ ok: true, bookingId: String(created._id) }, { status: 201 });
  } catch (e) {
    console.error("BOOKING POST ERROR:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
