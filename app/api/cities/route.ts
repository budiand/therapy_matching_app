import { NextResponse } from "next/server";
import dbConnect from "@/db/mongoose";
import City from "@/models/City";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const q = (searchParams.get("q") || "").toLowerCase().trim();

        const filter = q
            ? { normalized: { $regex: q, $options: "i" } }
            : {};

        const cities = await City.find(filter)
            .sort({ name: 1 })
            .limit(20)
            .lean();

        return NextResponse.json(
            cities.map((c: any) => c.name),
            { status: 200 }
        );
    } catch (e) {
        console.error("CITIES API ERROR:", e);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
