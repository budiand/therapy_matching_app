"use client";
import { useEffect, useState } from "react";

export default function TherapistPublicClient({ id }: { id: string }) {
    const [t, setT] = useState<any>(null);

    useEffect(() => {
        fetch(`/api/therapists/${id}`).then(r => r.json()).then(setT);
    }, [id]);

    if (!t) return <div className="p-10">Loading...</div>;

    return (
        <div className="p-10 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold">{t.name}</h1>
            <p>{t.city}</p>
            <p>{t.description}</p>

            <button
                onClick={() => location.href = `/book/${id}`}
                className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
                Book session
            </button>
        </div>
    );
}
