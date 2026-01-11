"use client";

import { useEffect, useState } from "react";

type Therapist = {
    _id: string;
    name: string;
    gender?: string;
    languages?: string[];
    city?: string;
    online?: boolean;
    priceRange?: string;
    description?: string;
    yearsOfExperience?: number;
    specializations?: string[];
    approaches?: string[];
    sessionStructure?: string;
    communicationStyle?: string;
    guidanceStyle?: string;
    focusStyle?: string;
    givesHomework?: boolean;
    worksWithHabits?: boolean;
    acceptsOnlineOnly?: boolean;
    ageGroups?: string[];
    rating?: number;

    // OPTIONAL – pentru viitor
    photoUrl?: string;
};

function initials(name: string) {
    return name
        .split(" ")
        .slice(0, 2)
        .map((x) => x[0]?.toUpperCase())
        .join("");
}

export default function TherapistPublicClient({ id }: { id: string }) {
    const [t, setT] = useState<Therapist | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/therapists/${id}`)
            .then((r) => r.json())
            .then((data) => {
                setT(data);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div className="p-10 text-center">Loading therapist…</div>;
    }

    if (!t) {
        return <div className="p-10 text-center">Therapist not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto bg-white border rounded-2xl p-6 space-y-6">

                {/* HEADER with PHOTO */}
                <div className="flex items-center gap-5">
                    {t.photoUrl ? (
                        <img
                            src={t.photoUrl}
                            alt={t.name}
                            className="w-24 h-24 rounded-2xl object-cover border"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-bold">
                            {initials(t.name)}
                        </div>
                    )}

                    <div>
                        <h1 className="text-3xl font-bold">{t.name}</h1>
                        <p className="text-gray-600 mt-1">
                            {t.city} • {t.online ? "Online" : "In-person"}
                        </p>
                    </div>
                </div>

                {/* Description */}
                {t.description && (
                    <p className="text-gray-800 leading-relaxed">
                        {t.description}
                    </p>
                )}

                {/* Key facts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <Fact label="Experience" value={t.yearsOfExperience ? `${t.yearsOfExperience} years` : undefined} />
                    <Fact label="Price range" value={t.priceRange} />
                    <Fact label="Languages" value={t.languages?.join(", ")} />
                    <Fact label="Age groups" value={t.ageGroups?.join(", ")} />
                    <Fact label="Rating" value={t.rating ? `⭐ ${t.rating}` : undefined} />
                </div>

                {/* Specializations */}
                {t.specializations?.length && (
                    <Section title="Specializations">
                        <TagList items={t.specializations} />
                    </Section>
                )}

                {/* Therapeutic approaches */}
                {t.approaches?.length && (
                    <Section title="Therapeutic approaches">
                        <TagList items={t.approaches} />
                    </Section>
                )}

                {/* Style */}
                <Section title="Working style">
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>Session structure: {t.sessionStructure}</li>
                        <li>Communication style: {t.communicationStyle}</li>
                        <li>Guidance style: {t.guidanceStyle}</li>
                        <li>Focus: {t.focusStyle}</li>
                        <li>Homework: {t.givesHomework ? "Yes" : "No"}</li>
                        <li>Habit work: {t.worksWithHabits ? "Yes" : "No"}</li>
                    </ul>
                </Section>

                {/* CTA */}
                <button
                    onClick={() => (location.href = `/book/${t._id}`)}
                    className="w-full px-4 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                >
                    Book a session
                </button>
            </div>
        </div>
    );
}

/* ---------- UI helpers ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {children}
        </div>
    );
}

function TagList({ items }: { items: string[] }) {
    return (
        <div className="flex flex-wrap gap-2">
            {items.map((x) => (
                <span
                    key={x}
                    className="px-3 py-1 text-sm rounded-full border bg-gray-50 text-gray-700"
                >
                    {x}
                </span>
            ))}
        </div>
    );
}

function Fact({ label, value }: { label: string; value?: string }) {
    if (!value) return null;
    return (
        <div>
            <div className="text-gray-500">{label}</div>
            <div className="font-medium">{value}</div>
        </div>
    );
}
