export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectMongo from "@/db/mongoose";
import Therapist from "@/models/Therapist";

export async function GET() {
  await connectMongo();

  const cities = await Therapist.distinct("city");

  return NextResponse.json(cities.sort());
}
