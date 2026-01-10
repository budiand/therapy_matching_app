"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

const nav: { href: string; label: string }[] = [
    { href: "/therapists/dashboard", label: "Overview" },
    { href: "/therapists/dashboard/appointments", label: "Appointments" },
    { href: "/therapists/dashboard/availability", label: "Availability" },
    { href: "/therapists/dashboard/clients", label: "Clients" },
    { href: "/therapists/dashboard/profile", label: "Profile" },
];

export default function TherapistDashboardLayout({ children }: { children: ReactNode }) {
    const router = useRouter();

    async function onLogout() {
        try {
            await fetch("/api/therapists/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
            });
        } finally {
            // chiar dacă request-ul pică, te scoatem din portalul terapeutului
            router.push("/therapists/auth/sign-in");
            router.refresh();
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex gap-6">
                    <aside className="hidden md:block w-72">
                        <div className="bg-white border rounded-2xl shadow-sm p-5 sticky top-6">
                            <div className="mb-5">
                                <p className="text-xs text-gray-500">Therapist Portal</p>
                                <h2 className="text-lg font-bold">TherapyMatching</h2>
                            </div>

                            <nav className="space-y-1">
                                {nav.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-medium"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-6 pt-5 border-t">
                                <button
                                    type="button"
                                    onClick={onLogout}
                                    className="w-full px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm"
                                >
                                    Log out
                                </button>
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1">{children}</main>
                </div>
            </div>
        </div>
    );
}
