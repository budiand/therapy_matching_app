"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardPage() {
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    async function logout() {
        setLoggingOut(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/");
        } finally {
            setLoggingOut(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-gray-600 mt-2">What would you like to do?</p>
                    </div>

                    <button
                        onClick={logout}
                        disabled={loggingOut}
                        className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        {loggingOut ? "Logging out..." : "Log out"}
                    </button>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <button
                        onClick={() => router.push("/onboarding")}
                        className="bg-white border rounded-2xl p-5 text-left hover:shadow-sm transition"
                    >
                        <div className="text-lg font-semibold">Find me a match</div>
                        <div className="text-sm text-gray-600 mt-1">
                            Take the onboarding and get therapist matches.
                        </div>
                    </button>

                    <button
                        onClick={() => router.push("/therapists")}
                        className="bg-white border rounded-2xl p-5 text-left hover:shadow-sm transition"
                    >
                        <div className="text-lg font-semibold">Explore therapists</div>
                        <div className="text-sm text-gray-600 mt-1">
                            Browse all therapists and filter by city/online.
                        </div>
                    </button>

                    <button
                        onClick={() => router.push("/others")}
                        className="bg-white border rounded-2xl p-5 text-left hover:shadow-sm transition"
                    >
                        <div className="text-lg font-semibold">Others</div>
                        <div className="text-sm text-gray-600 mt-1">Coming soon.</div>
                    </button>
                </div>
            </div>
        </div>
    );
}
