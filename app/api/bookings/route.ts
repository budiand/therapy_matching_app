import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import connectMongo from "@/db/mongoose";
import Appointment from "@/models/Appointment";

export const dynamic = "force-dynamic";

function cleanLocation(x: any) {
  const s = String(x || "").trim();
  return s === "online" || s === "in_person" ? s : null;
}

export async function POST(req: Request) {
  try {
    await connectMongo();
    const body = await req.json().catch(() => ({}));

    const uid = cookies().get("tm_uid")?.value;
    if (!uid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!mongoose.Types.ObjectId.isValid(uid)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const therapistId = String(body?.therapistId || "");
    if (!mongoose.Types.ObjectId.isValid(therapistId)) {
      return NextResponse.json({ error: "Invalid therapistId" }, { status: 400 });
    }

    const location = cleanLocation(body?.location);
    if (!location) return NextResponse.json({ error: "Invalid location" }, { status: 400 });

    const dateISO = body?.dateISO;
    const dt = new Date(dateISO);
    if (!dateISO || Number.isNaN(dt.getTime())) {
      return NextResponse.json({ error: "Invalid dateISO" }, { status: 400 });
    }

    const durationMin = Number(body?.durationMin ?? 50);
    if (!Number.isFinite(durationMin) || durationMin <= 0 || durationMin > 240) {
      return NextResponse.json({ error: "Invalid durationMin" }, { status: 400 });
    }

    // (optional dar recomandat) prevenire dubluri identice
    const exists = await Appointment.findOne({
      therapistId,
      userId: uid,
      dateISO: dt,
      status: { $in: ["scheduled"] },
    }).lean();

    if (exists) {
      return NextResponse.json({ error: "This slot is already booked." }, { status: 409 });
    }

    const created = await Appointment.create({
      therapistId,
      userId: uid,
      dateISO: dt,
      durationMin,
      location,
      status: "scheduled",
    });

    return NextResponse.json(
        {
          ok: true,
          appointment: {
            id: String(created._id),
            therapistId: String(created.therapistId),
            userId: String(created.userId),
            dateISO: created.dateISO.toISOString(),
            durationMin: created.durationMin,
            location: created.location,
            status: created.status,
          },
        },
        { status: 201 }
    );
  } catch (e) {
    console.error("BOOKING CREATE ERROR:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
