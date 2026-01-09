import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "../../../../db/mongoose";
import User from "../../../../models/User";

function hashPassword(password: string) {
    return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();

        const email = String(body?.email || "").trim().toLowerCase();
        const password = String(body?.password || "");

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password required." },
                { status: 400 }
            );
        }

        // IMPORTANT: fără .lean() ca să evităm problemele TS cu _id / passwordHash
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials." },
                { status: 401 }
            );
        }

        if (user.passwordHash !== hashPassword(password)) {
            return NextResponse.json(
                { error: "Invalid credentials." },
                { status: 401 }
            );
        }

        const res = NextResponse.json({ ok: true }, { status: 200 });

        res.cookies.set("tm_uid", String(user._id), {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: true, // activează în production pe HTTPS
        });

        return res;
    } catch (e) {
        console.error("LOGIN ERROR:", e);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
