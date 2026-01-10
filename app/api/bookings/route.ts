export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import connectMongo from "@/db/mongoose";
import Appointment from "@/models/Appointment";
import Therapist from "@/models/Therapist";

function getUid() {
  return cookies().get("tm_uid")?.value || null;
}

// ✅ CLIENT calendar: returns [{ id, therapistId, therapistName, start, end, location, status }]
export async function GET() {
  try {
    await connectMongo();

    const uid = getUid();
    if (!uid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!mongoose.Types.ObjectId.isValid(uid)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    // ✅ FIX: Appointment has clientId (not userId)
    const appts = await Appointment.find({ clientId: uid })
        .sort({ dateISO: 1 })
        .lean();

    const therapistIds = Array.from(new Set(appts.map((a: any) => String(a.therapistId))))
        .filter((id) => mongoose.Types.ObjectId.isValid(id));

    const therapists = therapistIds.length
        ? await Therapist.find({ _id: { $in: therapistIds } }).select("name").lean()
        : [];

    const therapistNameMap = new Map<string, string>(
        therapists.map((t: any) => [String(t._id), t.name || "Therapist"])
    );

    const out = appts.map((a: any) => {
      const start = new Date(a.dateISO);
      const end = new Date(start.getTime() + Number(a.durationMin ?? 50) * 60 * 1000);

      return {
        id: String(a._id),
        therapistId: String(a.therapistId),
        therapistName: therapistNameMap.get(String(a.therapistId)) || "Therapist",
        start: start.toISOString(),
        end: end.toISOString(),
        location: a.location || "online",
        status: a.status || "scheduled",
      };
    });

    return NextResponse.json(out, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.error("BOOKINGS GET ERROR:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectMongo();
    const body = await req.json().catch(() => ({}));

    const uid = getUid();
    if (!uid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!mongoose.Types.ObjectId.isValid(uid)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const therapistId = String(body?.therapistId || "");
    if (!mongoose.Types.ObjectId.isValid(therapistId)) {
      return NextResponse.json({ error: "Invalid therapistId" }, { status: 400 });
    }

    const location = String(body?.location || "online");
    if (!["online", "in_person"].includes(location)) {
      return NextResponse.json({ error: "Invalid location" }, { status: 400 });
    }

    const dt = new Date(body?.dateISO);
    if (!body?.dateISO || Number.isNaN(dt.getTime())) {
      return NextResponse.json({ error: "Invalid dateISO" }, { status: 400 });
    }

    const durationMin = Number(body?.durationMin ?? 50);

    // ✅ FIX: save as clientId, because schema is clientId
    const created = await Appointment.create({
      therapistId,
      clientId: uid,
      dateISO: dt,
      durationMin,
      location,
      status: "scheduled",
    });

    return NextResponse.json(
        { ok: true, appointmentId: String(created._id) },
        { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("BOOKINGS POST ERROR:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
