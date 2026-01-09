import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import connectMongo from "@/db/mongoose";
import Booking from "@/models/Booking";

export async function POST(req: Request) {
  await connectMongo();

  const userId = cookies().get("tm_uid")?.value;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { therapistName, start, end } = await req.json();

  if (!therapistName || !start || !end) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const booking = await Booking.create({
    userId: new mongoose.Types.ObjectId(userId),
    therapistName,
    start: new Date(start),
    end: new Date(end),
  });

  return NextResponse.json(booking, { status: 201 });
}

export async function GET() {
  await connectMongo();

  const userId = cookies().get("tm_uid")?.value;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json([]);
  }

  const bookings = await Booking.find({
    userId: new mongoose.Types.ObjectId(userId),
  }).sort({ start: 1 });

  return NextResponse.json(bookings);
}
