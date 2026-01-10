import { NextResponse } from "next/server";
import Therapist from "@/models/Therapist";
import connectMongo from "@/db/mongoose";

export async function GET(_: any, { params }: any) {
    await connectMongo();
    const t = await Therapist.findById(params.id).lean();
    return NextResponse.json(t);
}
