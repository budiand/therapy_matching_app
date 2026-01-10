import { NextResponse } from "next/server";
import Availability from "@/models/Availability";
import connectMongo from "@/db/mongoose";

export async function GET(_: any, { params }: any) {
    await connectMongo();

    const doc = await Availability.findOne({ therapistId: params.id }).lean();

    return NextResponse.json({
        weekly: (doc as any)?.weekly || {},
    });
}
