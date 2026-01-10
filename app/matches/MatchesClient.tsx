"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Match = {
    _id: string;
    name: string;
    city: string;
    online: boolean;
    priceRange?: string;
    description?: string;
    matchScore: number;
    matchReasons: string[];
};

export default function MatchesClient() {
    const router = useRouter();
    const [items, setItems] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/matches", { cache: "no-store" })
            .then((r) => r.json())
            .then(setItems)
            .catch(() => setError("Failed to load matches"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="p-10">Loading…</div>;
    }

    if (error) {
        return (
            <div className="p-10 text-red-600">{error}</div>
        );
    }

    if (!items.length) {
        return (
            <div className="p-10">
                <h1 className="text-xl font-semibold">
                    No matches yet
                </h1>
                <p className="text-gray-600 mt-2">
                    Complete onboarding to get recommendations.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">
                    Your therapist matches
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((t) => (
                        <div
                            key={t._id}
                            className="bg-white border rounded-2xl p-5"
                        >
                            <div className="flex justify-between">
                                <h3 className="text-lg font-semibold">
                                    {t.name}
                                </h3>
                                <span className="text-sm rounded-full px-3 py-1 bg-indigo-50 text-indigo-700">
                                    Score {t.matchScore}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mt-1">
                                {t.city} • {t.online ? "Online" : "In-person"}
                            </p>

                            {t.description && (
                                <p className="text-sm text-gray-700 mt-3">
                                    {t.description}
                                </p>
                            )}

                            {t.matchReasons?.length > 0 && (
                                <ul className="mt-3 text-sm list-disc pl-5 text-gray-700">
                                    {t.matchReasons.slice(0, 4).map((r, i) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>
                            )}

                            <div className="mt-4 flex gap-2">
                                <button
                                    className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                                    onClick={() =>
                                        router.push(`/therapists/${t._id}`)
                                    }
                                >
                                    View profile
                                </button>

                                <button
                                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                                    onClick={() =>
                                        router.push(`/book/${t._id}`)
                                    }
                                >
                                    Book session
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
