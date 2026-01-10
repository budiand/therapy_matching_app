"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no_show";

type Appointment = {
    id: string;
    userId: string; // IMPORTANT: userId (nu clientId)
    userName: string;
    dateISO: string; // ISO string
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

function startOfWeek(d: Date) {
    // Monday-based week
    const date = new Date(d);
    const day = date.getDay(); // 0=Sun
    const diff = (day === 0 ? -6 : 1) - day;
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
}

function endOfWeek(d: Date) {
    const s = startOfWeek(d);
    const e = new Date(s);
    e.setDate(e.getDate() + 7);
    return e;
}

export default function TherapistDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [users, setUsers] = useState<UserItem[]>([]);
    const [upcoming, setUpcoming] = useState<Appointment[]>([]);
    const [allUpcomingCount, setAllUpcomingCount] = useState<number>(0);
    const [weekCount, setWeekCount] = useState<number>(0);

    // Load dashboard data
    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError("");

            try {
                // 1) Users (clients list for therapist)
                const usersRes = await fetch("/api/therapists/users", { method: "GET" });
                const usersJson = await usersRes.json().catch(() => null);
                if (!usersRes.ok) {
                    throw new Error(usersJson?.error || `Failed to load users (${usersRes.status}).`);
                }
                const usersList: UserItem[] = (usersJson?.users ?? []).map((u: any) => ({
                    id: String(u.id ?? u._id),
                    name: u.name,
                    email: u.email,
                    phone: u.phone,
                    age: u.age,
                    lastSessionISO: u.lastSessionISO ?? null,
                }));

                // 2) Appointments (upcoming preview + stats)
                // Endpoint recomandat: /api/therapists/appointments
                // query: scope=upcoming, limit=3 pentru preview
                const apptRes = await fetch("/api/therapists/appointments?scope=upcoming&limit=3", {
                    method: "GET",
                });
                const apptJson = await apptRes.json().catch(() => null);
                if (!apptRes.ok) {
                    // Dacă nu ai încă route-ul, nu blocăm tot dashboard-ul.
                    // Arătăm users + acțiuni, iar appointments rămân goale.
                    console.warn("Appointments endpoint missing or failing:", apptJson);
                }

                const previewAppointments: Appointment[] = (apptJson?.appointments ?? []).map((a: any) => ({
                    id: String(a.id ?? a._id),
                    userId: String(a.userId ?? a.clientId ?? ""),
                    userName: String(a.userName ?? a.clientName ?? "User"),
                    dateISO: new Date(a.dateISO).toISOString(),
                    durationMin: Number(a.durationMin ?? 50),
                    location: a.location === "in_person" ? "in_person" : "online",
                    status: (a.status ?? "scheduled") as AppointmentStatus,
                }));

                // 3) Stats (optional: server may return counts to avoid loading all)
                // Dacă route-ul îți trimite și counts, le folosim.
                const totalUpcoming = Number(apptJson?.counts?.upcoming ?? previewAppointments.filter(a => isUpcoming(a.dateISO)).length);

                // This week: dacă server trimite counts.week îl folosim.
                // altfel, calculăm din "appointmentsAllThisWeek" dacă îl trimiți.
                // aici încercăm să citim apptJson.counts.week, altfel 0.
                const totalThisWeek = Number(apptJson?.counts?.thisWeek ?? 0);

                if (!cancelled) {
                    setUsers(usersList);
                    setUpcoming(previewAppointments);
                    setAllUpcomingCount(totalUpcoming);
                    setWeekCount(totalThisWeek);
                }
            } catch (e: any) {
                if (!cancelled) setError(e?.message || "Failed to load dashboard.");
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

    // fallback if server didn't provide weekCount:
    const weekCountFallback = useMemo(() => {
        // If you later decide to fetch all appointments, calculate here.
        // For now, keep the value we got (could be 0 if endpoint doesn’t send it).
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
                    <StatCard title="This week" value={loading ? "—" : `${weekCountFallback} sessions`} />
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
    return (
        <Link
            href={href}
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
                className="text-indigo-600 text-sm font-medium hover:underline"
            >
                Open
            </Link>
        </div>
    );
}
