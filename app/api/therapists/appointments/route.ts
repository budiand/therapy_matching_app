import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectMongo from "@/db/mongoose";
import Appointment from "@/models/Appointment";

export async function GET() {
    try {
        await connectMongo();

        const tid = cookies().get("tm_tid")?.value;
        if (!tid) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const appts = await Appointment.find({ therapistId: tid })
            .sort({ dateISO: 1 })
            .lean();

        // shape for UI
        const result = appts.map((a: any) => ({
            id: String(a._id),
            clientId: String(a.clientId),
            // TEMP: if you don’t have Client model populated yet:
            clientName: a.clientName || "Client",
            dateISO: new Date(a.dateISO).toISOString(),
            durationMin: a.durationMin,
            location: a.location,
            status: a.status,
            notesPreview: a.notesPreview || "",
        }));

        return NextResponse.json({ ok: true, appointments: result }, { status: 200 });
    } catch (e) {
        console.error("APPOINTMENTS GET ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
