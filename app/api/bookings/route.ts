import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import connectMongo from "@/db/mongoose";
import Appointment from "@/models/Appointment";
import Therapist from "@/models/Therapist";

export const dynamic = "force-dynamic";

function getUid() {
  return cookies().get("tm_uid")?.value || null;
}

// ✅ CLIENT calendar: returns [{ id, therapistName, start, end, location, status }]
export async function GET() {
  try {
    await connectMongo();

    const uid = getUid();
    if (!uid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!mongoose.Types.ObjectId.isValid(uid)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const appts = await Appointment.find({ userId: uid })
        .sort({ dateISO: 1 })
        .lean();

    const therapistIds = Array.from(new Set(appts.map((a: any) => String(a.therapistId))));
    const therapists = await Therapist.find({ _id: { $in: therapistIds } })
        .select("name")
        .lean();

    const therapistNameMap = new Map<string, string>(
        therapists.map((t: any) => [String(t._id), t.name])
    );

    const out = appts.map((a: any) => {
      const start = new Date(a.dateISO);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + (a.durationMin ?? 50));

      return {
        id: String(a._id),
        therapistId: String(a.therapistId),
        therapistName: therapistNameMap.get(String(a.therapistId)) || "Therapist",
        start: start.toISOString(),
        end: end.toISOString(),
        location: a.location,
        status: a.status,
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

// ✅ (optional) păstrează POST-ul tău aici, dar asigură-te că:
// - salvează în Appointment
// - primește dateISO, therapistId, location
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

    const location = String(body?.location || "");
    if (!["online", "in_person"].includes(location)) {
      return NextResponse.json({ error: "Invalid location" }, { status: 400 });
    }

    const dt = new Date(body?.dateISO);
    if (!body?.dateISO || Number.isNaN(dt.getTime())) {
      return NextResponse.json({ error: "Invalid dateISO" }, { status: 400 });
    }

    const durationMin = Number(body?.durationMin ?? 50);

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
          appointmentId: String(created._id),
        },
        { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("BOOKINGS POST ERROR:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
