"use client";

import { useEffect, useMemo, useState } from "react";

type Therapist = {
    _id: string;
    name: string;
    city: string;
    online: boolean;
    priceRange?: string;
    description?: string;

    specializations?: string[];
    approaches?: string[];

    matchScore: number;
    matchReasons: string[];
};

export default function ResultsPage() {
    const [loading, setLoading] = useState(true);
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        async function run() {
            try {
                const raw = sessionStorage.getItem("intake");
                if (!raw) {
                    setError("No onboarding data found. Please complete onboarding first.");
                    setLoading(false);
                    return;
                }

                const intake = JSON.parse(raw);

                const res = await fetch("/api/match", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(intake),
                });

                if (!res.ok) {
                    const txt = await res.text().catch(() => "");
                    throw new Error(txt || "Failed to fetch matches.");
                }

                const data = (await res.json()) as Therapist[];
                setTherapists(data);
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : "Something went wrong.");
            } finally {
                setLoading(false);
            }
        }

        run();
    }, []);

    const topCount = useMemo(() => therapists.length, [therapists.length]);

    if (loading) {
        return (
            <div className="p-10 min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200">
                Loading matches...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 min-h-screen bg-gray-50">
                <div className="max-w-2xl mx-auto bg-white border rounded-2xl p-6">
                    <h1 className="text-xl font-semibold">Couldn’t load matches</h1>
                    <p className="text-gray-600 mt-2">{error}</p>

                    <a
                        href="/onboarding"
                        className="inline-block mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        Go to onboarding
                    </a>
                </div>
            </div>
        );
    }

    async function bookNow(t: Therapist) {
        // MVP: slot fix (mâine 10:00–10:50)
        const start = new Date();
        start.setDate(start.getDate() + 1);
        start.setHours(10, 0, 0, 0);

        const end = new Date(start);
        end.setMinutes(end.getMinutes() + 50);

        try {
            const res = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                therapistName: t.name,
                start: start.toISOString(),
                end: end.toISOString(),
            }),
            });

            if (!res.ok) {
            throw new Error("Booking failed");
            }

            alert("Session booked successfully!");
        } catch {
            alert("Could not book session. Please try again.");
        }
        }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <header className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold">Your best matches</h1>
                    <p className="text-gray-600 mt-2">
                        We found {topCount} therapists that fit your preferences and needs.
                    </p>
                </header>

                {therapists.length === 0 ? (
                    <div className="bg-white border rounded-2xl p-6">
                        <h2 className="text-lg font-semibold">No strong matches yet</h2>
                        <p className="text-gray-600 mt-2">
                            Try adjusting your preferences (city/format/style) and run onboarding again.
                        </p>
                        <a
                            href="/onboarding"
                            className="inline-block mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            Update onboarding
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {therapists.map((t) => (
                            <div key={t._id} className="bg-white border rounded-2xl p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-lg font-semibold">{t.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {t.city} • {t.online ? "Online available" : "In-person only"}
                                            {t.priceRange ? ` • ${t.priceRange}` : ""}
                                        </p>
                                    </div>

                                    <div className="text-sm rounded-full border px-3 py-1 bg-indigo-50 text-indigo-700 border-indigo-200">
                                        Score: {t.matchScore}
                                    </div>
                                </div>

                                {t.approaches?.length ? (
                                    <p className="text-sm text-gray-700 mt-3">
                                        <span className="font-medium">Approaches:</span>{" "}
                                        {t.approaches.join(", ")}
                                    </p>
                                ) : null}

                                {t.specializations?.length ? (
                                    <p className="text-sm text-gray-700 mt-2">
                                        <span className="font-medium">Specializations:</span>{" "}
                                        {t.specializations.slice(0, 5).join(", ")}
                                        {t.specializations.length > 5 ? "…" : ""}
                                    </p>
                                ) : null}

                                {t.description ? (
                                    <p className="text-sm text-gray-600 mt-3">{t.description}</p>
                                ) : null}

                                {t.matchReasons?.length ? (
                                    <div className="mt-4">
                                        <div className="text-sm font-semibold">Why this match</div>
                                        <ul className="mt-2 space-y-1 text-sm text-gray-700 list-disc pl-5">
                                            {t.matchReasons.slice(0, 4).map((r, idx) => (
                                                <li key={idx}>{r}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}

                                <div className="mt-5 flex gap-2">
                                    <button
                                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                                    onClick={() => bookNow(t)}
                                    >
                                    Book a session
                                    </button>

                                    <button
                                        className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                                        onClick={() => alert("Next: therapist profile page")}
                                    >
                                        View profile
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
