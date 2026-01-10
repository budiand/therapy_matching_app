export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectMongo from "@/db/mongoose";
import Therapist from "@/models/Therapist";

export async function GET(req: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);

    const city = (searchParams.get("city") || "").trim();
    const onlineParam = searchParams.get("online"); // "true" | "false" | null
    const issue = (searchParams.get("issue") || "").trim(); // ex: "Anxiety"
    const q = (searchParams.get("q") || "").trim(); // search text
    const approach = (searchParams.get("approach") || "").trim(); // ex: "CBT"

    const query: any = { isActive: true };

    // city filter
    if (city) query.city = { $regex: city, $options: "i" };

    // online filter (only if provided)
    if (onlineParam === "true") query.online = true;
    if (onlineParam === "false") query.online = false;

    // issue/topic filter:
    // - prefer specializations (array enum)
    // - fallback to specialization (legacy string) if you still have it
    if (issue) {
      query.$or = [
        { specializations: issue }, // exact match in array
        { specialization: { $regex: issue, $options: "i" } }, // legacy
      ];
    }

    // approach filter (array)
    if (approach) {
      query.approaches = { $in: [approach] };
    }

    // free-text search (name/description)
    if (q) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
          { city: { $regex: q, $options: "i" } },
        ],
      });
    }

    const therapists = await Therapist.find(query)
        // ✅ don’t leak auth/sensitive fields
        .select(
            [
              "name",
              "city",
              "online",
              "priceRange",
              "description",
              "languages",
              "gender",
              "specializations",
              "approaches",
              "yearsOfExperience",
              "therapistType",
              "sessionStructure",
              "therapistActivity",
              "communicationStyle",
              "guidanceStyle",
              "focusStyle",
              "profilePhotoUrl",
              "verificationStatus",
              "isVerified",
              "createdAt",
            ].join(" ")
        )
        .sort({ createdAt: -1 })
        .lean();

    return NextResponse.json(therapists, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.error("THERAPISTS GET ERROR:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ⚠️ de obicei nu vrei POST public aici.
// Dacă îl păstrezi, trebuie AUTH + validare.
export async function POST(req: Request) {
  try {
    await connectMongo();
    const body = await req.json().catch(() => ({}));

    // ❗ recomandat: scoate acest POST din ruta publică
    // sau verifică un admin/therapist auth înainte de create.

    const therapist = await Therapist.create(body);

    // return safe view
    return NextResponse.json(
        { ok: true, therapistId: String(therapist._id) },
        { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("THERAPISTS POST ERROR:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
