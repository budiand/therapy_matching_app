import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectMongo from "@/db/mongoose";
import Therapist from "@/models/Therapist";

export async function GET() {
    try {
        await connectMongo();

        const tid = cookies().get("tm_tid")?.value;
        if (!tid) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const therapist = await Therapist.findById(tid).select("-passwordHash");
        if (!therapist) {
            return NextResponse.json({ error: "Therapist not found" }, { status: 404 });
        }

        return NextResponse.json({ ok: true, therapist }, { status: 200 });
    } catch (e) {
        console.error("THERAPIST ME ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
