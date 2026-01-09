'use client';

import Link from "next/link";

export default function TherapistDashboardPage() {
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

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                    <StatCard title="Upcoming sessions" value="3" />
                    <StatCard title="Active clients" value="12" />
                    <StatCard title="This week" value="7 sessions" />
                    <StatCard title="Profile status" value="Pending review" />
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

                    <div className="bg-white rounded-xl border shadow-sm divide-y">
                        <AppointmentRow name="Maria D." date="Today" time="14:00" />
                        <AppointmentRow name="Alex P." date="Tomorrow" time="10:30" />
                        <AppointmentRow name="Anonymous" date="Friday" time="16:00" />
                    </div>
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
                            date,
                            time,
                        }: {
    name: string;
    date: string;
    time: string;
}) {
    return (
        <div className="flex items-center justify-between p-4">
            <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-gray-500">{date} · {time}</p>
            </div>

            <button className="text-indigo-600 text-sm font-medium hover:underline">
                Open
            </button>
        </div>
    );
}
