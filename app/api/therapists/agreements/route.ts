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
SERVICE PROVISION & CONFIDENTIALITY AGREEMENT (v${version})

This Agreement is entered into between:

The Platform, operated by [COMPANY NAME], hereinafter referred to as the "Platform",

and

The Therapist, an individual or legal entity legally authorized to provide therapeutic or counseling services, hereinafter referred to as the "Therapist".

By accepting this Agreement, the Therapist confirms full understanding and acceptance of all terms and conditions below.

---

1. Purpose of the Agreement

The Platform provides digital infrastructure for the promotion, scheduling, communication, and payment processing of therapy sessions between the Therapist and clients.

The Platform does not provide therapeutic services and does not interfere in the professional relationship between Therapist and client.

---

2. Professional Qualifications and Documents

The Therapist declares and guarantees that:

- They hold all necessary licenses, certifications, diplomas, and legal authorizations to practice.
- They will provide valid documentation upon request by the Platform.
- All provided information is accurate, complete, and up to date.

The Therapist agrees to immediately notify the Platform of any suspension, restriction, or loss of their right to practice.

The Platform reserves the right to suspend or terminate the Therapist’s account if documentation is missing, invalid, or misleading.

---

3. Confidentiality

The Therapist agrees to maintain strict confidentiality regarding all client information, session content, and personal data.

The Platform agrees to process and store personal data in compliance with GDPR and applicable data protection laws.

Neither party may disclose confidential information to third parties without legal obligation or written consent.

---

4. Service Provision

The Therapist is solely responsible for:

- The quality and content of the services provided;
- Ethical and professional compliance;
- Client outcomes and decisions;
- Proper record keeping as required by law.

The Platform is not responsible for therapy results, advice given, or any professional consequences arising from the Therapist’s services.

---

5. Financial Terms and Commission

The Therapist agrees that the Platform will retain a commission of **15%** from the gross price of each session paid through the Platform.

The remaining balance will be transferred to the Therapist according to the Platform’s payment policy.

The commission covers platform usage, payment processing, technical support, and marketing exposure.

---

6. Payments

Payments are processed electronically through the Platform.

The Therapist agrees that all sessions booked via the Platform must be paid through the Platform.

Direct payments outside the Platform for Platform-generated clients are strictly prohibited.

---

7. Taxes

The Therapist is solely responsible for declaring and paying all applicable taxes, fees, and social contributions related to their income.

The Platform bears no tax responsibility on behalf of the Therapist.

---

8. Intellectual Property

All platform software, branding, and content remain the exclusive property of the Platform.

The Therapist grants the Platform a limited right to display their profile, name, photo, and qualifications for promotional purposes.

---

9. Liability

The Therapist bears full legal responsibility for their professional actions.

The Platform shall not be liable for:

- Client dissatisfaction;
- Emotional, physical, or financial outcomes;
- Disputes between Therapist and client;
- Professional malpractice claims.

---

10. Termination

Either party may terminate this Agreement at any time by written notice.

All financial obligations prior to termination remain enforceable.

---

11. Non-Circumvention

The Therapist agrees not to redirect clients obtained through the Platform outside the Platform for the purpose of avoiding commission.

Violation of this clause may result in immediate termination and legal action.

---

12. Governing Law

This Agreement shall be governed by and interpreted according to the laws of [COUNTRY / JURISDICTION].

---

13. Final Provisions

This Agreement represents the entire understanding between the parties.

Acceptance by electronic means constitutes a legally binding agreement.

---

By clicking "I Agree", the Therapist confirms acceptance of all terms and conditions stated above.
`.trim();
}

export async function GET() {
    await connectMongo();

    const tid = getTherapistIdFromCookie();
    if (!tid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const therapist = await Therapist.findById(tid).select("agreements").lean();
    if (!therapist) return NextResponse.json({ error: "Therapist not found" }, { status: 404 });

    const version = currentAgreementVersion();

    return NextResponse.json(
        {
            ok: true,
            version,
            commissionPct: 15,
            text: agreementText(version),
            accepted: Boolean((therapist as any)?.agreements?.accepted),
        },
        { status: 200, headers: { "Cache-Control": "no-store" } }
    );
}

export async function POST(req: Request) {
    await connectMongo();

    const tid = getTherapistIdFromCookie();
    if (!tid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

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

    const res = NextResponse.json({ ok: true }, { status: 200 });

    // ✅ cookie care ne ajută în middleware să nu mai lase dashboard fără accept
    res.cookies.set("tm_ta", "1", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 365, // 1 an
    });

    return res;
}

