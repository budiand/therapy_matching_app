import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectMongo from "@/db/mongoose";
import User from "@/models/User";
import UserNote from "@/models/UserNote";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        await connectMongo();

        const tid = cookies().get("tm_tid")?.value;
        if (!tid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

        // ✅ SAFE ONLY if User has therapistId
        const user = await User.findOne({ _id: params.id, therapistId: tid }).lean();
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const notes = await UserNote.find({ therapistId: tid, userId: params.id })
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
            { status: 200 }
        );
    } catch (e) {
        console.error("USER NOTES GET ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectMongo();

        const tid = cookies().get("tm_tid")?.value;
        if (!tid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

        // ✅ SAFE ONLY if User has therapistId
        const user = await User.findOne({ _id: params.id, therapistId: tid }).lean();
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

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
            userId: params.id,
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
            { status: 201 }
        );
    } catch (e) {
        console.error("USER NOTES POST ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectMongo();

        const tid = cookies().get("tm_tid")?.value;
        if (!tid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const noteId = searchParams.get("noteId");
        if (!noteId) return NextResponse.json({ error: "Missing noteId" }, { status: 400 });

        // ✅ SAFE ONLY if User has therapistId
        const user = await User.findOne({ _id: params.id, therapistId: tid }).lean();
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const deleted = await UserNote.deleteOne({ _id: noteId, therapistId: tid, userId: params.id });
        if (!deleted.deletedCount) return NextResponse.json({ error: "Note not found" }, { status: 404 });

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (e) {
        console.error("USER NOTES DELETE ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
