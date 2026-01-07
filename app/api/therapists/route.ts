export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectMongo from "@/db/mongoose";
import Therapist from "@/models/Therapist";

export async function GET(req: Request) {
  await connectMongo();

  const { searchParams } = new URL(req.url);

  const city = searchParams.get("city");
  const online = searchParams.get("online");
  const issue = searchParams.get("issue"); // optional (MVP: îl mapăm simplu)

  const query: any = {};

  if (city) query.city = { $regex: city, $options: "i" };
  if (online !== null) query.online = online === "true";

  // MVP mapping: issue -> specialization (simplu, fără AI)
  if (issue) query.specialization = { $regex: issue, $options: "i" };

  const therapists = await Therapist.find(query).sort({ createdAt: -1 });

  return NextResponse.json(therapists);
}

export async function POST(req: Request) {
  await connectMongo();
  const body = await req.json();

  const therapist = await Therapist.create(body);
  return NextResponse.json(therapist);
}
