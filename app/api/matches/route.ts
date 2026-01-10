import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import dbConnect from "@/db/mongoose";
import User from "@/models/User";
import Therapist from "@/models/Therapist";

type Recommended = {
    therapistId: mongoose.Types.ObjectId;
    score: number;
    reasons: string[];
};

type UserLean = {
    _id: mongoose.Types.ObjectId;
    recommendedTherapists?: Recommended[];
};

export async function GET() {
    try {
        await dbConnect();

        const uid = cookies().get("tm_uid")?.value;
        if (!uid || !mongoose.Types.ObjectId.isValid(uid)) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const user = (await User.findById(uid).lean()) as UserLean | null;

        if (!user || !user.recommendedTherapists || user.recommendedTherapists.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        const ids = user.recommendedTherapists.map(
            (r) => r.therapistId
        );

        const therapists = await Therapist.find({
            _id: { $in: ids },
        }).lean();

        const scoreMap = new Map(
            user.recommendedTherapists.map((r) => [
                String(r.therapistId),
                r,
            ])
        );

        const result = therapists.map((t: any) => ({
            ...t,
            matchScore: scoreMap.get(String(t._id))?.score,
            matchReasons: scoreMap.get(String(t._id))?.reasons || [],
        }));

        return NextResponse.json(result, { status: 200 });
    } catch (e) {
        console.error("MATCHES GET ERROR:", e);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
