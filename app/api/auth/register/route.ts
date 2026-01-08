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

        const name = String(body?.name || "").trim();
        const email = String(body?.email || "").trim().toLowerCase();
        const phone = String(body?.phone || "").trim();
        const password = String(body?.password || "");
        const age = Number(body?.age);

        if (!name || !email || !phone || !password || !Number.isFinite(age)) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        if (age < 13 || age > 120) {
            return NextResponse.json({ error: "Invalid age." }, { status: 400 });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json(
                { error: "Email already registered." },
                { status: 409 }
            );
        }

        const created = await User.create({
            name,
            email,
            phone,
            age,
            passwordHash: hashPassword(password),
        });

        const res = NextResponse.json(
            { ok: true, userId: String(created._id) },
            { status: 201 }
        );

        res.cookies.set("tm_uid", String(created._id), {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
        });

        return res;
    } catch (e) {
        console.error("REGISTER ERROR:", e);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
