"use client";

type Props = {
  therapistName: string;
};

export default function BookSessionButton({ therapistName }: Props) {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(10, 0, 0, 0);

  const end = new Date(start);
  end.setHours(11);

  const handleBooking = async () => {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        therapistName,
        start: start.toISOString(),
        end: end.toISOString(),
      }),
    });

    if (res.ok) {
      alert("Session booked successfully!");
    } else {
      alert("Booking failed.");
    }
  };

  return (
    <button
      onClick={handleBooking}
      className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
    >
      Book a session
    </button>
  );
}
