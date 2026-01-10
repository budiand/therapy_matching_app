"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useMemo, useState } from "react";

type BookingDTO = {
    id?: string;
    therapistName: string;
    start: string; // ISO
    end: string;   // ISO
    location?: "online" | "in_person";
    status?: string;
};

type SelectedEvent = {
    title: string;
    start?: string;
    end?: string;
    location?: string;
    status?: string;
};

export default function BookingCalendar() {
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setError("");
            try {
                const res = await fetch("/api/bookings", { cache: "no-store" }); // ✅ client-safe
                const data = await res.json().catch(() => null);

                if (!res.ok) {
                    throw new Error(data?.error || `Failed to load bookings (${res.status})`);
                }

                const list: BookingDTO[] = Array.isArray(data) ? data : (data?.bookings ?? []);
                const mapped = list.map((b, idx) => ({
                    id: b.id || String(idx),
                    title: b.therapistName || "Session",
                    start: b.start,
                    end: b.end,
                    extendedProps: {
                        location: b.location,
                        status: b.status,
                    },
                }));

                if (!cancelled) setEvents(mapped);
            } catch (e: any) {
                if (!cancelled) setError(e?.message || "Failed to load bookings.");
            }
        };

        void load(); // ✅ no ignored promise warning

        return () => {
            cancelled = true;
        };
    }, []);

    const calendarEvents = useMemo(() => events, [events]);

    return (
        <div className="bg-white rounded-2xl p-6 border">
            <h2 className="text-xl font-semibold mb-4">Your scheduled sessions</h2>

            {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="timeGridWeek"
                height="auto"
                events={calendarEvents}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                eventTimeFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                }}
                eventClick={(info: any) => {
                    // ✅ avoid circular object in state
                    setSelectedEvent({
                        title: info.event.title,
                        start: info.event.start?.toISOString(),
                        end: info.event.end?.toISOString(),
                        location: info.event.extendedProps?.location,
                        status: info.event.extendedProps?.status,
                    });
                }}
                eventContent={(arg: any) => (
                    <div className="text-xs leading-tight">
                        <div className="font-semibold">{arg.event.title}</div>
                        <div>{arg.timeText}</div>
                    </div>
                )}
            />

            {/* MODAL */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setSelectedEvent(null)}
                    />

                    <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Session details</h2>

                        <div className="space-y-2 text-gray-700">
                            <div>
                                <span className="font-medium">Therapist:</span> {selectedEvent.title}
                            </div>

                            <div>
                                <span className="font-medium">Date:</span>{" "}
                                {selectedEvent.start
                                    ? new Date(selectedEvent.start).toLocaleDateString()
                                    : "—"}
                            </div>

                            <div>
                                <span className="font-medium">Time:</span>{" "}
                                {selectedEvent.start
                                    ? new Date(selectedEvent.start).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : "—"}
                                {" – "}
                                {selectedEvent.end
                                    ? new Date(selectedEvent.end).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : "—"}
                            </div>

                            {selectedEvent.location && (
                                <div>
                                    <span className="font-medium">Type:</span> {selectedEvent.location}
                                </div>
                            )}

                            {selectedEvent.status && (
                                <div>
                                    <span className="font-medium">Status:</span> {selectedEvent.status}
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
