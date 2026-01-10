export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import connectMongo from "@/db/mongoose";
import Appointment from "@/models/Appointment";
import UserNote from "@/models/UserNote";

function getTherapistIdFromCookie() {
    return cookies().get("tm_tid")?.value || null;
}

async function assertRelationOr404(tid: string, userId: string) {
    if (!mongoose.Types.ObjectId.isValid(tid) || !mongoose.Types.ObjectId.isValid(userId)) {
        return { ok: false as const, res: NextResponse.json({ error: "Invalid id" }, { status: 400 }) };
    }

    const hasRelation = await Appointment.exists({ therapistId: tid, userId });
    if (!hasRelation) {
        return { ok: false as const, res: NextResponse.json({ error: "Not found" }, { status: 404 }) };
    }

    return { ok: true as const };
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        await connectMongo();

        const tid = getTherapistIdFromCookie();
        if (!tid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

        const userId = params?.id;

        const guard = await assertRelationOr404(tid, userId);
        if (!guard.ok) return guard.res;

        const notes = await UserNote.find({ therapistId: tid, userId })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(
            {
                ok: true,
                notes: notes.map((n: any) => ({
                    id: String(n._id),
                    createdAtISO: new Date(n.createdAt).toISOString(),
                    title: n.title ?? undefined,
                    content: n.content,
                    tags: Array.isArray(n.tags) ? n.tags : [],
                })),
            },
            { status: 200, headers: { "Cache-Control": "no-store" } }
        );
    } catch (e) {
        console.error("USER NOTES GET ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectMongo();

        const tid = getTherapistIdFromCookie();
        if (!tid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

        const userId = params?.id;

        const guard = await assertRelationOr404(tid, userId);
        if (!guard.ok) return guard.res;

        const body = await req.json().catch(() => ({}));
        const title = typeof body?.title === "string" ? body.title.trim() : "";
        const content = typeof body?.content === "string" ? body.content.trim() : "";
        const tags = Array.isArray(body?.tags)
            ? body.tags.map((t: any) => String(t).trim()).filter(Boolean)
            : [];

        if (content.length < 10) {
            return NextResponse.json({ error: "Content too short." }, { status: 400 });
        }

        const created = await UserNote.create({
            therapistId: tid,
            userId,
            title: title || undefined,
            content,
            tags,
        });

        return NextResponse.json(
            {
                ok: true,
                note: {
                    id: String(created._id),
                    createdAtISO: new Date(created.createdAt).toISOString(),
                    title: created.title ?? undefined,
                    content: created.content,
                    tags: created.tags ?? [],
                },
            },
            { status: 201, headers: { "Cache-Control": "no-store" } }
        );
    } catch (e) {
        console.error("USER NOTES POST ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectMongo();

        const tid = getTherapistIdFromCookie();
        if (!tid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

        const userId = params?.id;

        const guard = await assertRelationOr404(tid, userId);
        if (!guard.ok) return guard.res;

        const { searchParams } = new URL(req.url);
        const noteId = searchParams.get("noteId");
        if (!noteId) return NextResponse.json({ error: "Missing noteId" }, { status: 400 });
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return NextResponse.json({ error: "Invalid noteId" }, { status: 400 });
        }

        const deleted = await UserNote.deleteOne({ _id: noteId, therapistId: tid, userId });
        if (!deleted.deletedCount) return NextResponse.json({ error: "Note not found" }, { status: 404 });

        return NextResponse.json({ ok: true }, { status: 200, headers: { "Cache-Control": "no-store" } });
    } catch (e) {
        console.error("USER NOTES DELETE ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
