"use client";

import { useRouter } from "next/navigation";
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
    const router = useRouter();
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function run() {
            const raw = sessionStorage.getItem("intake");
            if (!raw) return;

            const res = await fetch("/api/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: raw,
            });

            const data = await res.json();
            setTherapists(data);
            setLoading(false);
        }
        run();
    }, []);

    if (loading) return <div className="p-10">Loading...</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Your best matches</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {therapists.map((t) => (
                    <div key={t._id} className="bg-white border rounded-xl p-5">
                        <h3 className="font-semibold text-lg">{t.name}</h3>
                        <p className="text-sm text-gray-600">{t.city}</p>

                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => router.push(`/therapists/${t._id}`)}
                                className="px-4 py-2 rounded-lg border"
                            >
                                View profile
                            </button>

                            <button
                                onClick={() => router.push(`/book/${t._id}`)}
                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
                            >
                                Book a session
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
