"use client";
import { useEffect, useState } from "react";

export default function BookClient({ therapistId }: { therapistId: string }) {
    const [weekly, setWeekly] = useState<any>(null);
    const [day, setDay] = useState("Mon");
    const [slot, setSlot] = useState<any>(null);
    const [location, setLocation] = useState("online");

    useEffect(() => {
        fetch(`/api/therapists/${therapistId}/availability`)
            .then(r => r.json())
            .then(d => setWeekly(d.weekly));
    }, [therapistId]);

    if (!weekly) return <div className="p-10">Loading availability...</div>;

    async function book() {
        await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                therapistId,
                day,
                start: slot.start,
                end: slot.end,
                location
            })
        });
        alert("Booked!");
    }

    return (
        <div className="p-10 max-w-xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Book session</h1>

            <select onChange={e => setDay(e.target.value)} value={day}>
                {Object.keys(weekly).map(d => (
                    <option key={d}>{d}</option>
                ))}
            </select>

            <div className="mt-4 space-y-2">
                {weekly[day].map((s: any, i: number) => (
                    <button
                        key={i}
                        onClick={() => setSlot(s)}
                        className="block border p-2 rounded w-full text-left"
                    >
                        {s.start} – {s.end}
                    </button>
                ))}
            </div>

            <select className="mt-4" onChange={e => setLocation(e.target.value)}>
                <option value="online">Online</option>
                <option value="in_person">In person</option>
            </select>

            <button
                disabled={!slot}
                onClick={book}
                className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg"
            >
                Confirm booking
            </button>
        </div>
    );
}
