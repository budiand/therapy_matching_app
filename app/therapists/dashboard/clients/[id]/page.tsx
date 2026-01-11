"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Note = {
    id: string; // noteId in DB
    createdAtISO: string;
    title?: string;
    content: string;
    tags: string[];
};

type ClientProfile = {
    id: string;
    name: string;
    status: "active" | "paused" | "archived";
    sinceISO: string;
    lastSessionISO?: string;
    goals?: string;
    quickSummary?: string;
};

function formatDateTime(iso?: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatDate(iso?: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });
}

function initials(name: string) {
    return (
        name
            .split(" ")
            .slice(0, 2)
            .map((x) => x[0]?.toUpperCase())
            .join("") || "C"
    );
}

export default function TherapistClientDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const clientId = params?.id ?? "unknown";

    const [loading, setLoading] = useState(true);
    const [loadingNotes, setLoadingNotes] = useState(true);
    const [error, setError] = useState("");

    const [client, setClient] = useState<ClientProfile | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);

    // Add note form
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tagsInput, setTagsInput] = useState("CBT, homework");
    const [savingNote, setSavingNote] = useState(false);

    const sortedNotes = useMemo(() => {
        return [...notes].sort(
            (a, b) => new Date(b.createdAtISO).getTime() - new Date(a.createdAtISO).getTime()
        );
    }, [notes]);

    // ✅ load client + notes
    useEffect(() => {
        let cancelled = false;

        async function loadClient() {
            setLoading(true);
            setError("");
            try {
                const res = await fetch(`/api/therapists/clients/${clientId}`, { method: "GET" });
                const data = await res.json().catch(() => null);
                if (!res.ok) throw new Error(data?.error || `Failed to load client (${res.status}).`);

                if (!cancelled) setClient(data.client as ClientProfile);
            } catch (e: any) {
                if (!cancelled) setError(e?.message || "Failed to load client.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        async function loadNotes() {
            setLoadingNotes(true);
            setError("");

            try {
                const res = await fetch(
                    `/api/therapists/clients/${clientId}/notes`,
                    { method: "GET" }
                );

                const data = await res.json().catch(() => null);
                if (!res.ok) {
                    throw new Error(data?.error || `Failed to load notes (${res.status}).`);
                }

                if (!cancelled) {
                    const normalizedNotes: Note[] = (data.notes ?? []).map((n: any) => ({
                        id: n.id || n._id,
                        createdAtISO: n.createdAtISO || n.createdAt,
                        title: n.title,
                        content: n.content,
                        tags: n.tags ?? [],
                    }));

                    setNotes(normalizedNotes);
                }
            } catch (e: any) {
                if (!cancelled) {
                    setError(e?.message || "Failed to load notes.");
                }
            } finally {
                if (!cancelled) {
                    setLoadingNotes(false);
                }
            }
        }

        loadClient();
        loadNotes();

        return () => {
            cancelled = true;
        };
    }, [clientId]);

    async function onAddNote() {
        setError("");

        if (content.trim().length < 10) {
            setError("Please write at least 10 characters.");
            return;
        }

        const tags = tagsInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

        setSavingNote(true);

        try {
            const res = await fetch(`/api/therapists/clients/${clientId}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim() || undefined,
                    content: content.trim(),
                    tags,
                }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(data?.error || `Failed to add note (${res.status}).`);
            }

            const created = data.note;

            // ✅ NORMALIZARE
            const normalizedNote: Note = {
                id: created.id || created._id,
                createdAtISO: created.createdAtISO || created.createdAt,
                title: created.title,
                content: created.content,
                tags: created.tags ?? [],
            };

            setNotes((prev) => [normalizedNote, ...prev]);
            setTitle("");
            setContent("");
            setTagsInput("CBT, homework");
        } catch (e: any) {
            setError(e?.message || "Failed to add note.");
        } finally {
            setSavingNote(false);
        }
    }

    async function onDeleteNote(noteId: string) {
        if (!confirm("Delete this note?")) return;

        setError("");
        try {
            const res = await fetch(
                `/api/therapists/clients/${clientId}/notes?noteId=${encodeURIComponent(noteId)}`,
                { method: "DELETE" }
            );
            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.error || `Failed to delete note (${res.status}).`);

            setNotes((prev) => prev.filter((n) => n.id !== noteId));
        } catch (e: any) {
            setError(e?.message || "Failed to delete note.");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                            {initials(client?.name ?? "Client")}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{client?.name ?? "Client"}</h1>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/therapists/dashboard/clients"
                            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                        >
                            Back to clients
                        </Link>

                        <button
                            onClick={() => router.push("/therapists/dashboard/appointments")}
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                        >
                            View appointments
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="bg-white rounded-2xl border shadow-sm p-10 text-center text-gray-600">
                        Loading client...
                    </div>
                ) : !client ? (
                    <div className="bg-white rounded-2xl border shadow-sm p-10 text-center">
                        <h3 className="font-semibold">Client not found</h3>
                        <p className="text-gray-600 text-sm mt-1">This client may not belong to your account.</p>
                    </div>
                ) : (
                    <>
                        {/* Top cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card title="Client overview">
                                <div className="space-y-2 text-sm">
                                    <Row label="Status" value={<StatusPill status={client.status} />} />
                                    <Row label="Since" value={formatDate(client.sinceISO)} />
                                    <Row label="Last session" value={formatDateTime(client.lastSessionISO)} />
                                </div>
                            </Card>

                            <Card title="Goals">
                                <p className="text-sm text-gray-700 leading-relaxed">{client.goals || "—"}</p>
                            </Card>

                            <Card title="Quick summary">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {client.quickSummary || "—"}
                                </p>
                            </Card>
                        </div>

                        {/* Notes + Add note */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                            {/* Add note */}
                            <div className="lg:col-span-1">
                                <Card title="Add a note" subtitle="Saved chronologically for this client">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium">Title (optional)</label>
                                            <input
                                                className="mt-1 w-full border rounded-xl px-3 py-2 bg-white"
                                                placeholder="e.g. Session #3 - main points"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium">Note</label>
                                            <textarea
                                                className="mt-1 w-full border rounded-xl px-3 py-2 bg-white min-h-[140px]"
                                                placeholder="Write session insights, key events, homework, risks, etc."
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium">Tags (comma-separated)</label>
                                            <input
                                                className="mt-1 w-full border rounded-xl px-3 py-2 bg-white"
                                                placeholder="e.g. CBT, homework, sleep"
                                                value={tagsInput}
                                                onChange={(e) => setTagsInput(e.target.value)}
                                            />
                                        </div>

                                        <button
                                            onClick={onAddNote}
                                            disabled={savingNote}
                                            className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            {savingNote ? "Saving..." : "Add note"}
                                        </button>
                                    </div>
                                </Card>
                            </div>

                            {/* Timeline */}
                            <div className="lg:col-span-2">
                                <Card title="Notes timeline" subtitle="Most recent first">
                                    {loadingNotes ? (
                                        <div className="rounded-xl border bg-gray-50 p-6 text-center text-gray-600">
                                            Loading notes...
                                        </div>
                                    ) : sortedNotes.length === 0 ? (
                                        <div className="rounded-xl border bg-gray-50 p-6 text-center">
                                            <h3 className="font-semibold">No notes yet</h3>
                                            <p className="text-gray-600 text-sm mt-1">Add your first note on the left.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {sortedNotes.map((n) => (
                                                <div key={n.id} className="rounded-2xl border bg-white p-5">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <p className="text-xs text-gray-500">{formatDateTime(n.createdAtISO)}</p>
                                                            <p className="font-semibold mt-1">{n.title || "Session note"}</p>
                                                        </div>

                                                        <button
                                                            onClick={() => onDeleteNote(n.id)}
                                                            className="text-sm font-medium text-red-700 hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>

                                                    <p className="text-sm text-gray-700 mt-3 leading-relaxed whitespace-pre-wrap">
                                                        {n.content}
                                                    </p>

                                                    {n.tags.length > 0 && (
                                                        <div className="mt-4 flex flex-wrap gap-2">
                                                            {n.tags.map((t) => (
                                                                <span
                                                                    key={t}
                                                                    className="text-xs px-2 py-1 rounded-full border bg-gray-50 text-gray-700"
                                                                >
                                  {t}
                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

/* ---------------- UI helpers ---------------- */

function Card({
                  title,
                  subtitle,
                  children,
              }: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-2xl border shadow-sm p-5 md:p-6">
            <div className="mb-4">
                <h2 className="text-lg font-semibold">{title}</h2>
                {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <p className="text-gray-600">{label}</p>
            <div className="text-gray-900 font-medium">{value}</div>
        </div>
    );
}

function StatusPill({ status }: { status: "active" | "paused" | "archived" }) {
    const map: Record<string, string> = {
        active: "bg-emerald-50 text-emerald-700 border-emerald-200",
        paused: "bg-amber-50 text-amber-800 border-amber-200",
        archived: "bg-gray-100 text-gray-700 border-gray-200",
    };

    const label: Record<string, string> = {
        active: "Active",
        paused: "Paused",
        archived: "Archived",
    };

    return <span className={["text-xs px-2 py-0.5 rounded-full border", map[status]].join(" ")}>{label[status]}</span>;
}
