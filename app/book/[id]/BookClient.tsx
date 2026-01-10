"use client";

import { useEffect, useState } from "react";

type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
type Slot = { start: string; end: string };
type Weekly = Record<DayKey, Slot[]>;

function nextDateForDay(dayKey: DayKey) {
    const map: Record<DayKey, number> = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6,
    };

    const target = map[dayKey];
    const now = new Date();
    const current = now.getDay();

    let diff = (target - current + 7) % 7;
    if (diff === 0) diff = 7; // dacă e azi, ia următoarea săptămână

    const d = new Date(now);
    d.setDate(now.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

export default function BookClient({ therapistId }: { therapistId: string }) {
    const [weekly, setWeekly] = useState<Weekly | null>(null);
    const [day, setDay] = useState<DayKey>("Mon");
    const [slot, setSlot] = useState<Slot | null>(null);
    const [location, setLocation] = useState<"online" | "in_person">("online");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError("");
            try {
                const res = await fetch(`/api/therapists/${therapistId}/availability`, { cache: "no-store" });
                const data = await res.json().catch(() => null);

                if (!res.ok) throw new Error(data?.error || `Failed to load availability (${res.status})`);

                if (!cancelled) setWeekly((data?.weekly ?? null) as Weekly | null);
            } catch (e: any) {
                if (!cancelled) setError(e?.message || "Failed to load availability.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [therapistId]);

    async function book() {
        if (!slot) return;

        setSaving(true);
        setError("");

        try {
            // Construim dateISO real (următoarea zi selectată + ora slotului)
            const base = nextDateForDay(day);
            const [hh, mm] = String(slot.start).split(":").map(Number);

            const start = new Date(base);
            start.setHours(hh, mm, 0, 0);

            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    therapistId,
                    dateISO: start.toISOString(), // ✅ backend-ul vrea dateISO
                    durationMin: 50,
                    location,
                }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.error || `Booking failed (${res.status})`);

            alert("Booked!");
        } catch (e: any) {
            setError(e?.message || "Booking failed.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-10">Loading availability...</div>;

    if (error && !weekly) {
        return (
            <div className="p-10 max-w-xl mx-auto">
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
            </div>
        );
    }

    if (!weekly) return <div className="p-10">No availability.</div>;

    const days = Object.keys(weekly) as DayKey[];
    const slots = weekly[day] ?? [];

    return (
        <div className="p-10 max-w-xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Book session</h1>

            {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            <label className="text-sm font-medium">Day</label>
            <select
                className="mt-1 w-full border rounded-lg p-2 bg-white"
                onChange={(e) => {
                    setDay(e.target.value as DayKey);
                    setSlot(null);
                }}
                value={day}
            >
                {days.map((d) => (
                    <option key={d} value={d}>
                        {d}
                    </option>
                ))}
            </select>

            <div className="mt-4 space-y-2">
                {slots.length === 0 ? (
                    <div className="text-sm text-gray-600">No slots for this day.</div>
                ) : (
                    slots.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => setSlot(s)}
                            className={[
                                "block border p-2 rounded w-full text-left",
                                slot?.start === s.start && slot?.end === s.end ? "border-indigo-600 bg-indigo-50" : "",
                            ].join(" ")}
                        >
                            {s.start} – {s.end}
                        </button>
                    ))
                )}
            </div>

            <label className="text-sm font-medium mt-4 block">Type</label>
            <select
                className="mt-1 w-full border rounded-lg p-2 bg-white"
                value={location}
                onChange={(e) => setLocation(e.target.value as any)}
            >
                <option value="online">Online</option>
                <option value="in_person">In person</option>
            </select>

            <button
                disabled={!slot || saving}
                onClick={book}
                className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg disabled:opacity-50"
            >
                {saving ? "Booking..." : "Confirm booking"}
            </button>
        </div>
    );
}
