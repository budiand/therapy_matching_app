"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type UserRow = {
    id: string;
    name: string;
    email: string;
    phone: string;
    age?: number;
    status: "active" | "paused" | "archived";
    sinceISO?: string | null;
    lastSessionISO?: string | null;
};

function formatDate(iso?: string | null) {
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
            .join("") || "U"
    );
}

export default function TherapistClientsPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [users, setUsers] = useState<UserRow[]>([]);

    const [query, setQuery] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError("");
            try {
                const res = await fetch("/api/therapists/users", { method: "GET" });
                const data = await res.json().catch(() => null);
                if (!res.ok) throw new Error(data?.error || `Failed to load users (${res.status}).`);

                if (!cancelled) setUsers((data?.users ?? []) as UserRow[]);
            } catch (e: any) {
                if (!cancelled) setError(e?.message || "Failed to load users.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return users;
        return users.filter((u) => {
            return (
                u.name.toLowerCase().includes(q) ||
                (u.email || "").toLowerCase().includes(q) ||
                (u.phone || "").toLowerCase().includes(q)
            );
        });
    }, [users, query]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Clients</h1>
                        <p className="text-gray-600 mt-1">
                            This list is generated from your bookings. If you have no bookings, it will be empty.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/therapists/dashboard"
                            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                        >
                            Back
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Controls */}
                <div className="bg-white rounded-2xl border shadow-sm p-4 md:p-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <div className="flex-1">
                            <input
                                className="w-full border rounded-xl px-4 py-2 bg-white"
                                placeholder="Search by name, email, phone..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        <div className="text-sm text-gray-600">
                            {loading ? "Loading..." : `${filtered.length} client(s)`}
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="mt-6">
                    {loading ? (
                        <div className="bg-white rounded-2xl border shadow-sm p-10 text-center text-gray-600">
                            Loading clients...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="bg-white rounded-2xl border shadow-sm p-10 text-center">
                            <h3 className="text-lg font-semibold">No clients yet</h3>
                            <p className="text-gray-600 mt-2">
                                You’ll see clients here after someone books a session with you.
                            </p>
                            <div className="mt-6 flex justify-center gap-3">
                                <Link
                                    href="/therapists/dashboard/availability"
                                    className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                                >
                                    Set availability
                                </Link>
                                <Link
                                    href="/therapists/dashboard/appointments"
                                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    View appointments
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                            <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
                                <div className="col-span-6">Client</div>
                                <div className="col-span-3">Last session</div>
                                <div className="col-span-3 text-right">Actions</div>
                            </div>

                            <div className="divide-y">
                                {filtered.map((u) => (
                                    <div key={u.id} className="grid grid-cols-12 gap-3 px-5 py-4 items-center">
                                        <div className="col-span-12 md:col-span-6">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                                    {initials(u.name)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{u.name}</p>
                                                    <p className="text-sm text-gray-600 mt-1">{u.email}</p>
                                                    <p className="text-sm text-gray-600">{u.phone}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-6 md:col-span-3">
                                            <p className="font-medium">{formatDate(u.lastSessionISO)}</p>
                                            <p className="text-sm text-gray-600">Since: {formatDate(u.sinceISO)}</p>
                                        </div>

                                        <div className="col-span-6 md:col-span-3 flex justify-end gap-2">
                                            <button
                                                className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 text-sm"
                                                onClick={() => router.push(`/therapists/dashboard/clients/${u.id}`)}
                                            >
                                                Open
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-xs text-gray-500 mt-4">
                    Note: clients are derived from your bookings (therapistId cookie + Booking.userId).
                </p>
            </div>
        </div>
    );
}
