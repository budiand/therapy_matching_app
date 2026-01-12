"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import posthog from "posthog-js";

/* ---------------- Types ---------------- */

type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no_show";

type Appointment = {
    id: string;
    userId: string;
    userName: string;
    dateISO: string;
    durationMin: number;
    location: "online" | "in_person";
    status: AppointmentStatus;
};

type UserItem = {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    age?: number;
    lastSessionISO?: string | null;
};

/* ---------------- Helpers ---------------- */

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

/* ---------------- Page ---------------- */

export default function TherapistDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [users, setUsers] = useState<UserItem[]>([]);
    const [upcoming, setUpcoming] = useState<Appointment[]>([]);
    const [allUpcomingCount, setAllUpcomingCount] = useState<number>(0);
    const [weekCount, setWeekCount] = useState<number>(0);

    /* ---- Dashboard viewed ---- */
    useEffect(() => {
        posthog.capture("therapist_dashboard_viewed");
    }, []);

    /* ---- Load dashboard data ---- */
    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError("");

            try {
                /* -------- Clients -------- */
                const usersRes = await fetch("/api/therapists/clients", { method: "GET" });
                const usersJson = await usersRes.json().catch(() => null);
                if (!usersRes.ok) {
                    throw new Error(usersJson?.error || `Failed to load users (${usersRes.status})`);
                }

                const usersList: UserItem[] = (usersJson?.users ?? []).map((u: any) => ({
                    id: String(u.id ?? u._id),
                    name: u.name,
                    email: u.email,
                    phone: u.phone,
                    age: u.age,
                    lastSessionISO: u.lastSessionISO ?? null,
                }));

                /* -------- Appointments preview -------- */
                const apptRes = await fetch(
                    "/api/therapists/appointments?scope=upcoming&limit=3",
                    { method: "GET" }
                );

                const apptJson = await apptRes.json().catch(() => null);
                if (!apptRes.ok) {
                    console.warn("Appointments endpoint missing or failing:", apptJson);
                }

                const previewAppointments: Appointment[] = (apptJson?.appointments ?? []).map(
                    (a: any) => ({
                        id: String(a.id ?? a._id),
                        userId: String(a.userId ?? a.clientId ?? ""),
                        userName: String(a.userName ?? a.clientName ?? "User"),
                        dateISO: new Date(a.dateISO).toISOString(),
                        durationMin: Number(a.durationMin ?? 50),
                        location: a.location === "in_person" ? "in_person" : "online",
                        status: (a.status ?? "scheduled") as AppointmentStatus,
                    })
                );

                const totalUpcoming = Number(
                    apptJson?.counts?.upcoming ??
                        previewAppointments.filter((a) => isUpcoming(a.dateISO)).length
                );

                const totalThisWeek = Number(apptJson?.counts?.thisWeek ?? 0);

                if (!cancelled) {
                    setUsers(usersList);
                    setUpcoming(previewAppointments);
                    setAllUpcomingCount(totalUpcoming);
                    setWeekCount(totalThisWeek);

                    /* ---- Dashboard loaded (PostHog) ---- */
                    posthog.capture("therapist_dashboard_loaded", {
                        active_clients: usersList.length,
                        upcoming_preview_count: previewAppointments.length,
                        upcoming_total: totalUpcoming,
                        week_count: totalThisWeek,
                    });
                }
            } catch (e: any) {
                if (!cancelled) {
                    setError(e?.message || "Failed to load dashboard.");

                    /* ---- Dashboard load failed (PostHog) ---- */
                    posthog.capture("therapist_dashboard_load_failed", {
                        error: e?.message ?? "unknown_error",
                    });
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const activeClients = users.length;

    const weekCountFallback = useMemo(() => {
        return weekCount;
    }, [weekCount]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Therapist Dashboard</h1>
                        <p className="text-gray-600 mt-1">
                            Manage your sessions, clients and availability.
                        </p>
                    </div>

                    <Link
                        href="/therapists/dashboard/profile"
                        onClick={() =>
                            posthog.capture("therapist_dashboard_click", {
                                destination: "profile",
                            })
                        }
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                    >
                        Edit profile
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                    <StatCard title="Upcoming sessions" value={loading ? "—" : String(allUpcomingCount)} />
                    <StatCard title="Active clients" value={loading ? "—" : String(activeClients)} />
                    <StatCard
                        title="This week"
                        value={loading ? "—" : `${weekCountFallback} sessions`}
                    />
                    <StatCard title="Profile status" value={loading ? "—" : "Pending review"} />
                </div>

                {/* Main actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardCard
                        title="Appointments"
                        description="View and manage your scheduled sessions."
                        href="/therapists/dashboard/appointments"
                    />
                    <DashboardCard
                        title="Availability"
                        description="Set your weekly availability."
                        href="/therapists/dashboard/availability"
                    />
                    <DashboardCard
                        title="Clients"
                        description="View all your clients and notes."
                        href="/therapists/dashboard/clients"
                    />
                    <DashboardCard
                        title="Profile"
                        description="Update your professional profile."
                        href="/therapists/dashboard/profile"
                    />
                </div>

                {/* Upcoming appointments preview */}
                <div className="mt-12">
                    <h2 className="text-xl font-semibold mb-4">Next appointments</h2>

                    {loading ? (
                        <div className="bg-white rounded-xl border shadow-sm p-6 text-gray-600">
                            Loading appointments...
                        </div>
                    ) : upcoming.length === 0 ? (
                        <div className="bg-white rounded-xl border shadow-sm p-6 text-gray-600">
                            No upcoming appointments yet.
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border shadow-sm divide-y">
                            {upcoming.map((a) => (
                                <AppointmentRow
                                    key={a.id}
                                    name={a.userName}
                                    when={`${formatDateTime(a.dateISO)} · ${a.durationMin} min`}
                                    href={`/therapists/dashboard/clients/${a.userId}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ---------------- Components ---------------- */

function StatCard({ title, value }: { title: string; value: string }) {
    return (
        <div className="bg-white rounded-xl border p-5 shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
    );
}

function DashboardCard({
    title,
    description,
    href,
}: {
    title: string;
    description: string;
    href: string;
}) {
    function onClick() {
        posthog.capture("therapist_dashboard_click", {
            destination: title.toLowerCase().replace(/\s+/g, "_"),
            href,
        });
    }

    return (
        <Link
            href={href}
            onClick={onClick}
            className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition"
        >
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-gray-600 mt-2">{description}</p>
        </Link>
    );
}

function AppointmentRow({
    name,
    when,
    href,
}: {
    name: string;
    when: string;
    href: string;
}) {
    return (
        <div className="flex items-center justify-between p-4">
            <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-gray-500">{when}</p>
            </div>

            <Link
                href={href}
                onClick={() =>
                    posthog.capture("therapist_open_client", {
                        client_name: name,
                        source: "dashboard_upcoming_preview",
                    })
                }
                className="text-indigo-600 text-sm font-medium hover:underline"
            >
                Open
            </Link>
        </div>
    );
}
