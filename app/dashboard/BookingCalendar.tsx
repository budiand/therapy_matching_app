"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useState } from "react";

export default function BookingCalendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => {
        setEvents(
          data.map((b: any) => ({
            title: b.therapistName,
            start: b.start,
            end: b.end,

            // vizual
            backgroundColor: "#6366f1", // indigo-500
            borderColor: "#4f46e5",
            textColor: "white",

            extendedProps: {
              therapistName: b.therapistName,
            },
          }))
        );
      });
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 border">
      <h2 className="text-xl font-semibold mb-4">
        Your scheduled sessions
      </h2>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        height="auto"
        events={events}

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

        eventClick={(info) => {
          setSelectedEvent(info.event);
        }}

        eventContent={(arg) => (
          <div className="text-xs leading-tight">
            <div className="font-semibold">
              {arg.event.title}
            </div>
            <div>
              {arg.timeText}
            </div>
          </div>
        )}
      />

      {/* MODAL DETALII EVENIMENT */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedEvent(null)}
          />

          {/* modal */}
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              Session details
            </h2>

            <div className="space-y-2 text-gray-700">
              <div>
                <span className="font-medium">Therapist:</span>{" "}
                {selectedEvent.title}
              </div>

              <div>
                <span className="font-medium">Date:</span>{" "}
                {selectedEvent.start?.toLocaleDateString()}
              </div>

              <div>
                <span className="font-medium">Time:</span>{" "}
                {selectedEvent.start?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                –{" "}
                {selectedEvent.end?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
              >
                Close
              </button>

              {/* pregătit pentru viitor */}
              {/* 
              <button className="px-4 py-2 rounded-lg bg-red-600 text-white">
                Cancel session
              </button>
              */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
