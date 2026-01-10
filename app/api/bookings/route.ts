import { NextResponse } from "next/server";
import Booking from "@/models/Booking";
import connectMongo from "@/db/mongoose";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  await connectMongo();
  const body = await req.json();

  const userId = cookies().get("tm_uid")?.value;

  await Booking.create({
    therapistId: body.therapistId,
    clientId: userId,
    dateISO: new Date(),
    durationMin: 50,
    location: body.location,
    status: "scheduled"
  });

  return NextResponse.json({ ok: true });
}
