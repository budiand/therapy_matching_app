"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

type Slot = {
    id: string;      // local UI id
    start: string;   // "09:00"
    end: string;     // "12:30"
};

const DAYS: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function minutes(t: string) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}

function overlaps(a: Slot, b: Slot) {
    const aS = minutes(a.start);
    const aE = minutes(a.end);
    const bS = minutes(b.start);
    const bE = minutes(b.end);
    return aS < bE && bS < aE;
}

function sortSlots(slots: Slot[]) {
    return [...slots].sort((x, y) => minutes(x.start) - minutes(y.start));
}

function uid() {
    return Math.random().toString(16).slice(2);
}

function emptyAvailability(): Record<DayKey, Slot[]> {
    return {
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
    };
}

type ApiWeekly = Record<DayKey, { start: string; end: string }[]>;

function apiToUi(weekly: ApiWeekly): Record<DayKey, Slot[]> {
    const out = emptyAvailability();
    for (const d of DAYS) {
        out[d] = (weekly?.[d] ?? []).map((s) => ({ id: uid(), start: s.start, end: s.end }));
    }
    return out;
}

function uiToApi(av: Record<DayKey, Slot[]>): ApiWeekly {
    const out = {} as ApiWeekly;
    for (const d of DAYS) {
        out[d] = (av[d] ?? []).map((s) => ({ start: s.start, end: s.end }));
    }
    return out;
}

export default function TherapistAvailabilityPage() {
    const [availability, setAvailability] = useState<Record<DayKey, Slot[]>>(emptyAvailability());

    const [activeDay, setActiveDay] = useState<DayKey>("Mon");
    const [start, setStart] = useState("09:00");
    const [end, setEnd] = useState("10:00");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const daySlots = useMemo(() => availability[activeDay] ?? [], [availability, activeDay]);

    // ✅ LOAD from API on mount
    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError("");
            try {
                const res = await fetch("/api/therapists/availability", { method: "GET" });
                const data = await res.json().catch(() => null);

                if (!res.ok) {
                    throw new Error(data?.error || `Failed to load availability (${res.status}).`);
                }

                const weekly = (data?.weekly ?? emptyAvailability()) as ApiWeekly;
                if (!cancelled) setAvailability(apiToUi(weekly));
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
    }, []);

    function addSlot() {
        setError("");

        if (!start || !end) return setError("Please select a start and end time.");
        if (minutes(end) <= minutes(start)) return setError("End time must be after start time.");

        const newSlot: Slot = { id: uid(), start, end };
        const existing = availability[activeDay] ?? [];

        for (const s of existing) {
            if (overlaps(s, newSlot)) return setError("This time range overlaps an existing slot.");
        }

        setAvailability((prev) => ({
            ...prev,
            [activeDay]: sortSlots([...(prev[activeDay] ?? []), newSlot]),
        }));
    }

    function removeSlot(day: DayKey, id: string) {
        setAvailability((prev) => ({
            ...prev,
            [day]: (prev[day] ?? []).filter((s) => s.id !== id),
        }));
    }

    function clearDay(day: DayKey) {
        setAvailability((prev) => ({ ...prev, [day]: [] }));
    }

    function copyDayTo(dayFrom: DayKey, dayTo: DayKey) {
        setAvailability((prev) => ({
            ...prev,
            [dayTo]: (prev[dayFrom] ?? []).map((s) => ({ ...s, id: uid() })),
        }));
    }

    function copyToMultiple(targetDays: DayKey[]) {
        setAvailability((prev) => {
            const base = (prev[activeDay] ?? []).map((s) => ({ ...s }));
            const next = { ...prev };
            for (const d of targetDays) {
                if (d === activeDay) continue;
                next[d] = base.map((s) => ({ ...s, id: uid() }));
            }
            return next;
        });
    }

    // ✅ SAVE to API
    async function onSave() {
        setSaving(true);
        setError("");
        try {
            const res = await fetch("/api/therapists/availability", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ weekly: uiToApi(availability) }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.error || `Failed to save (${res.status}).`);

            // refresh state from server response
            const weekly = (data?.weekly ?? emptyAvailability()) as ApiWeekly;
            setAvailability(apiToUi(weekly));
        } catch (e: any) {
            setError(e?.message || "Something went wrong while saving.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Availability</h1>
                        <p className="text-gray-600 mt-1">
                            Add your weekly time slots. Clients can book only inside these windows.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/therapists/dashboard"
                            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                        >
                            Back
                        </Link>

                        <button
                            onClick={onSave}
                            disabled={saving || loading}
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save availability"}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="bg-white rounded-2xl border shadow-sm p-10 text-center text-gray-600">
                        Loading availability...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Day selector + editor */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Days */}
                            <div className="bg-white rounded-2xl border shadow-sm p-4">
                                <p className="text-sm font-medium text-gray-700 mb-3">Select a day</p>
                                <div className="grid grid-cols-7 gap-2">
                                    {DAYS.map((d) => (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => {
                                                setActiveDay(d);
                                                setError("");
                                            }}
                                            className={[
                                                "py-2 rounded-xl border text-sm font-medium transition",
                                                activeDay === d
                                                    ? "bg-indigo-600 text-white border-indigo-600"
                                                    : "bg-white hover:bg-gray-50",
                                            ].join(" ")}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Add slot */}
                            <div className="bg-white rounded-2xl border shadow-sm p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold">Add time slot</h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Create bookable windows for <span className="font-medium">{activeDay}</span>.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => clearDay(activeDay)}
                                        className="text-sm font-medium text-red-700 hover:underline"
                                    >
                                        Clear day
                                    </button>
                                </div>

                                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                                    <div>
                                        <label className="text-sm font-medium">Start</label>
                                        <input
                                            type="time"
                                            className="mt-1 w-full border rounded-xl px-3 py-2 bg-white"
                                            value={start}
                                            onChange={(e) => setStart(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">End</label>
                                        <input
                                            type="time"
                                            className="mt-1 w-full border rounded-xl px-3 py-2 bg-white"
                                            value={end}
                                            onChange={(e) => setEnd(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addSlot}
                                        className="w-full md:w-auto px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                                    >
                                        Add slot
                                    </button>
                                </div>

                                {/* Slots list */}
                                <div className="mt-6">
                                    <p className="text-sm font-medium text-gray-700">Slots for {activeDay}</p>

                                    {daySlots.length === 0 ? (
                                        <div className="mt-3 rounded-xl border bg-gray-50 p-4 text-sm text-gray-600">
                                            No slots yet. Add one above.
                                        </div>
                                    ) : (
                                        <div className="mt-3 divide-y rounded-xl border bg-white">
                                            {daySlots.map((s) => (
                                                <div key={s.id} className="flex items-center justify-between px-4 py-3">
                                                    <div>
                                                        <p className="font-medium">
                                                            {s.start} – {s.end}
                                                        </p>
                                                        <p className="text-xs text-gray-500">Bookable window</p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeSlot(activeDay, s.id)}
                                                        className="text-sm font-medium text-red-700 hover:underline"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Weekly overview + copy helpers */}
                        <div className="space-y-6">
                            {/* Weekly overview */}
                            <div className="bg-white rounded-2xl border shadow-sm p-5">
                                <h2 className="text-lg font-semibold">Weekly overview</h2>
                                <p className="text-sm text-gray-600 mt-1">Quick view of your schedule by day.</p>

                                <div className="mt-4 space-y-3">
                                    {DAYS.map((d) => (
                                        <div
                                            key={d}
                                            className="flex items-center justify-between rounded-xl border bg-gray-50 px-4 py-3"
                                        >
                                            <div>
                                                <p className="font-medium">{d}</p>
                                                <p className="text-xs text-gray-600 mt-0.5">
                                                    {(availability[d] ?? []).length === 0
                                                        ? "No slots"
                                                        : `${(availability[d] ?? []).length} slot(s)`}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                className="text-sm font-medium text-indigo-700 hover:underline"
                                                onClick={() => setActiveDay(d)}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Copy helper */}
                            <div className="bg-white rounded-2xl border shadow-sm p-5">
                                <h2 className="text-lg font-semibold">Copy slots</h2>
                                <p className="text-sm text-gray-600 mt-1">Reuse {activeDay} slots to save time.</p>

                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    {DAYS.filter((d) => d !== activeDay).map((d) => (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => copyDayTo(activeDay, d)}
                                            className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm"
                                            disabled={(availability[activeDay] ?? []).length === 0}
                                        >
                                            Copy to {d}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
                                        disabled={(availability[activeDay] ?? []).length === 0}
                                        onClick={() => copyToMultiple(DAYS.filter((d) => d !== activeDay))}
                                    >
                                        Copy to all days
                                    </button>
                                </div>

                                <p className="text-xs text-gray-500 mt-3">
                                    Tip: later you can support exceptions (vacations, one-off days) using date-specific availability.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
