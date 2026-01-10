import { NextResponse } from "next/server";
import Availability from "@/models/Availability";
import connectMongo from "@/db/mongoose";

type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
type Slot = { start: string; end: string };
type Weekly = Record<DayKey, Slot[]>;

const EMPTY_WEEKLY: Weekly = {
  Mon: [],
  Tue: [],
  Wed: [],
  Thu: [],
  Fri: [],
  Sat: [],
  Sun: [],
};

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await connectMongo();

  const doc = (await Availability.findOne({
    therapistId: params.id,
  }).lean()) as { weekly?: Weekly } | null;

  return NextResponse.json(
    {
      weekly: doc?.weekly ?? EMPTY_WEEKLY,
    },
    { status: 200 }
  );
}
