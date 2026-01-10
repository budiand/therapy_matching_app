"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no_show";

type Appointment = {
    id: string;
    clientId: string;
    clientName: string;
    dateISO: string; // ISO string
    durationMin: number;
    location: "online" | "in_person";
    status: AppointmentStatus;
    notesPreview?: string;
};

function formatDateTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function isUpcoming(iso: string) {
    return new Date(iso).getTime() >= Date.now();
}

export default function TherapistAppointmentsPage() {
    const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
    const [statusFilter, setStatusFilter] = useState<"all" | AppointmentStatus>("all");
    const [query, setQuery] = useState("");

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError("");

            try {
                const res = await fetch("/api/therapists/appointments", { method: "GET" });
                const data = await res.json().catch(() => null);

                if (!res.ok) {
                    throw new Error(data?.error || data?.message || `Failed to load (${res.status})`);
                }

                setAppointments(Array.isArray(data?.appointments) ? data.appointments : []);
            } catch (e: any) {
                setError(e?.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    const filtered = useMemo(() => {
        const byTab = appointments.filter((a) =>
            tab === "upcoming" ? isUpcoming(a.dateISO) : !isUpcoming(a.dateISO)
        );

        const byStatus = statusFilter === "all" ? byTab : byTab.filter((a) => a.status === statusFilter);

        const q = query.trim().toLowerCase();
        const byQuery = q ? byStatus.filter((a) => a.clientName.toLowerCase().includes(q)) : byStatus;

        // Sort
        return byQuery.sort((a, b) =>
            tab === "upcoming"
                ? new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()
                : new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
        );
    }, [appointments, tab, statusFilter, query]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Appointments</h1>
                        <p className="text-gray-600 mt-1">
                            Review upcoming sessions, past sessions, and manage changes.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/therapists/dashboard"
                            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                        >
                            Back
                        </Link>

                        <button
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                            onClick={() => alert("Add appointment flow goes here")}
                            type="button"
                        >
                            + New appointment
                        </button>
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
                        {/* Tabs */}
                        <div className="flex rounded-xl border p-1 bg-gray-50 w-fit">
                            <TabButton active={tab === "upcoming"} label="Upcoming" onClick={() => setTab("upcoming")} />
                            <TabButton active={tab === "past"} label="Past" onClick={() => setTab("past")} />
                        </div>

                        {/* Search */}
                        <div className="flex-1">
                            <input
                                className="w-full border rounded-xl px-4 py-2 bg-white"
                                placeholder="Search by client name..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        {/* Status filter */}
                        <div className="min-w-[190px]">
                            <select
                                className="w-full border rounded-xl px-3 py-2 bg-white"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                            >
                                <option value="all">All statuses</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="no_show">No-show</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="mt-6">
                    {loading ? (
                        <div className="bg-white rounded-2xl border shadow-sm p-10 text-center text-gray-600">
                            Loading appointments…
                        </div>
                    ) : filtered.length === 0 ? (
                        <EmptyState tab={tab} />
                    ) : (
                        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                            <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
                                <div className="col-span-5">Client</div>
                                <div className="col-span-3">Date & time</div>
                                <div className="col-span-2">Type</div>
                                <div className="col-span-2 text-right">Actions</div>
                            </div>

                            <div className="divide-y">
                                {filtered.map((a) => (
                                    <div key={a.id} className="grid grid-cols-12 gap-3 px-5 py-4 items-center">
                                        <div className="col-span-12 md:col-span-5">
                                            <div className="flex items-start gap-3">
                                                <Avatar name={a.clientName} />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold">{a.clientName}</p>
                                                        <StatusPill status={a.status} />
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {a.notesPreview ?? "No notes yet."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-6 md:col-span-3">
                                            <p className="font-medium">{formatDateTime(a.dateISO)}</p>
                                            <p className="text-sm text-gray-600">
                                                {a.durationMin} min · {a.location === "online" ? "Online" : "In person"}
                                            </p>
                                        </div>

                                        <div className="col-span-6 md:col-span-2">
                                            <p className="text-sm font-medium text-gray-800">
                                                {a.location === "online" ? "Video session" : "Office session"}
                                            </p>
                                        </div>

                                        <div className="col-span-12 md:col-span-2 flex md:justify-end gap-2">
                                            <Link
                                                href={`/therapists/dashboard/clients/${a.clientId}`}
                                                className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 text-sm"
                                            >
                                                Open client
                                            </Link>

                                            <button
                                                className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 text-sm"
                                                onClick={() => alert(`Reschedule flow for appointment ${a.id}`)}
                                                type="button"
                                            >
                                                Reschedule
                                            </button>

                                            <button
                                                className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-sm"
                                                onClick={() => alert(`Cancel flow for appointment ${a.id}`)}
                                                type="button"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ---------------- UI helpers ---------------- */

function TabButton({
                       active,
                       label,
                       onClick,
                   }: {
    active: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "px-4 py-2 rounded-lg text-sm font-medium transition",
                active ? "bg-white shadow-sm border text-gray-900" : "text-gray-600 hover:text-gray-900",
            ].join(" ")}
        >
            {label}
        </button>
    );
}

function StatusPill({ status }: { status: AppointmentStatus }) {
    const map: Record<AppointmentStatus, string> = {
        scheduled: "bg-indigo-50 text-indigo-700 border-indigo-200",
        completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
        cancelled: "bg-red-50 text-red-700 border-red-200",
        no_show: "bg-amber-50 text-amber-800 border-amber-200",
    };

    const label: Record<AppointmentStatus, string> = {
        scheduled: "Scheduled",
        completed: "Completed",
        cancelled: "Cancelled",
        no_show: "No-show",
    };

    return (
        <span className={["text-xs px-2 py-0.5 rounded-full border", map[status]].join(" ")}>
      {label[status]}
    </span>
    );
}

function Avatar({ name }: { name: string }) {
    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((s) => s[0]?.toUpperCase())
        .join("");

    return (
        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            {initials || "U"}
        </div>
    );
}

function EmptyState({ tab }: { tab: "upcoming" | "past" }) {
    return (
        <div className="bg-white rounded-2xl border shadow-sm p-10 text-center">
            <h3 className="text-lg font-semibold">
                {tab === "upcoming" ? "No upcoming appointments" : "No past appointments"}
            </h3>
            <p className="text-gray-600 mt-2">
                {tab === "upcoming"
                    ? "When clients book sessions, they’ll appear here."
                    : "Completed and previous sessions will show up here."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
                <Link
                    href="/therapists/dashboard/availability"
                    className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                >
                    Set availability
                </Link>
                <Link
                    href="/therapists/dashboard/clients"
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    View clients
                </Link>
            </div>
        </div>
    );
}
