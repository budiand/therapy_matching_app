import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import connectMongo from "@/db/mongoose";
import Therapist from "@/models/Therapist";

export const dynamic = "force-dynamic";

function getTherapistIdFromCookie() {
    return cookies().get("tm_tid")?.value || null;
}

function currentAgreementVersion() {
    // fără dayjs, fără deps
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function agreementText(version: string) {
    // aici pui textul tău legal (rezumat / complet)
    // IMPORTANT: include explicit comision 15%
    return `
ACORD DE PRESTARE SERVICII & CONFIDENȚIALITATE (v${version})

1) Confidențialitate:
Terapeutul se obligă să respecte confidențialitatea datelor și informațiilor despre client.

2) Prestarea serviciilor:
Platforma facilitează programarea și managementul ședințelor.

3) Comision:
Terapeutul este de acord ca platforma să rețină un comision de 15% din prețul fiecărei ședințe efectuate prin platformă.

4) Alte clauze:
...
`.trim();
}

export async function GET() {
    const version = currentAgreementVersion();
    return NextResponse.json(
        {
            ok: true,
            version,
            commissionPct: 15,
            text: agreementText(version),
        },
        { status: 200, headers: { "Cache-Control": "no-store" } }
    );
}

export async function POST(req: Request) {
    try {
        await connectMongo();

        const tid = getTherapistIdFromCookie();
        if (!tid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        if (!mongoose.Types.ObjectId.isValid(tid)) {
            return NextResponse.json({ error: "Invalid therapist id" }, { status: 400 });
        }

        const body = await req.json().catch(() => ({}));
        const agreed = Boolean(body?.agreed);
        const version = String(body?.version || currentAgreementVersion());
        const commissionPct = Number(body?.commissionPct ?? 15);

        if (!agreed) {
            return NextResponse.json({ error: "You must accept the agreement." }, { status: 400 });
        }

        await Therapist.updateOne(
            { _id: tid },
            {
                $set: {
                    "agreements.accepted": true,
                    "agreements.acceptedAt": new Date(),
                    "agreements.version": version,
                    "agreements.commissionPct": commissionPct,
                },
            }
        );

        return NextResponse.json(
            { ok: true },
            { status: 200, headers: { "Cache-Control": "no-store" } }
        );
    } catch (e) {
        console.error("AGREEMENTS POST ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
