"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CityAutocomplete from "../components/CityAutocomplete";

type Therapist = {
  _id: string;
  name: string;
  city: string;
  online: boolean;
  priceRange?: string;
  description?: string;
  specialization?: string; // în modelul tău existent
  approaches?: string[];   // dacă ai adăugat în model
};

const ISSUES = [
  { value: "", label: "All topics" },
  { value: "anxiety", label: "Anxiety" },
  { value: "depression", label: "Depression" },
  { value: "burnout", label: "Burnout" },
  { value: "relationships", label: "Relationships" },
  { value: "family", label: "Family" },
  { value: "lgbtq", label: "LGBTQ+" },
];

const APPROACHES = [
  { value: "", label: "Any approach" },
  { value: "CBT", label: "CBT" },
  { value: "Psychodynamic", label: "Psychodynamic" },
  { value: "ACT", label: "ACT" },
  { value: "Schema", label: "Schema therapy" },
  { value: "Gestalt", label: "Gestalt" },
];

const PRICE = [
  { value: "", label: "Any price" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

function cn(...x: Array<string | false | undefined>) {
  return x.filter(Boolean).join(" ");
}

function getMockSlots() {
  // MVP: ore mock (poți înlocui cu API real)
  const base = new Date();
  const slots: { label: string; iso: string }[] = [];
  for (let d = 0; d < 5; d++) {
    for (const hour of [10, 12, 15, 18]) {
      const dt = new Date(base);
      dt.setDate(base.getDate() + d);
      dt.setHours(hour, 0, 0, 0);
      slots.push({
        label: dt.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        iso: dt.toISOString(),
      });
    }
  }
  return slots;
}

function Modal({
                 open,
                 title,
                 children,
                 onClose,
               }: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative w-full max-w-lg rounded-2xl bg-white border shadow-xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="text-lg font-semibold">{title}</div>
            <button
                onClick={onClose}
                className="px-2 py-1 rounded-lg border bg-white hover:bg-gray-50"
                aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      </div>
  );
}

export default function TherapistsClient() {
  const router = useRouter();

  // filters
  const [city, setCity] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [issue, setIssue] = useState("");
  const [approach, setApproach] = useState("");
  const [price, setPrice] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"newest" | "name">("newest");

  // data
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Therapist[]>([]);
  const [error, setError] = useState("");

  // booking modal
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingTherapist, setBookingTherapist] = useState<Therapist | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const slots = useMemo(() => getMockSlots(), []);
  const filteredLocal = useMemo(() => {
    // additional local filters for q/approach/price (since API route currently supports city/online/issue)
    let arr = [...items];

    if (q.trim()) {
      const qq = q.toLowerCase();
      arr = arr.filter((t) =>
          (t.name || "").toLowerCase().includes(qq) ||
          (t.description || "").toLowerCase().includes(qq) ||
          (t.specialization || "").toLowerCase().includes(qq)
      );
    }

    if (approach) {
      const a = approach.toLowerCase();
      arr = arr.filter((t) => (t.approaches || []).some((x) => x.toLowerCase().includes(a)));
    }

    if (price) {
      // MVP: priceRange e string ("low/medium/high" sau "100-150" etc.)
      arr = arr.filter((t) => (t.priceRange || "").toLowerCase().includes(price.toLowerCase()));
    }

    if (sort === "name") {
      arr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else {
      // newest: dacă backend trimite createdAt, ar trebui să fie deja sortat; păstrăm ordinea
    }

    return arr;
  }, [items, q, approach, price, sort]);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (city.trim()) params.set("city", city.trim());
      params.set("online", String(onlineOnly));
      if (issue) params.set("issue", issue);

      const res = await fetch(`/api/therapists?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Failed to load therapists");
      }
      const data = (await res.json()) as Therapist[];
      setItems(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyFilters() {
    load();
  }

  function resetFilters() {
    setCity("");
    setOnlineOnly(false);
    setIssue("");
    setApproach("");
    setPrice("");
    setQ("");
    setSort("newest");
    // reload after reset
    setTimeout(() => load(), 0);
  }

  function openBooking(t: Therapist) {
    setBookingTherapist(t);
    setSelectedSlot("");
    setBookingOpen(true);
  }

  async function confirmBooking() {
    // MVP: doar confirmare. În viitor: POST /api/bookings
    alert(
        bookingTherapist && selectedSlot
            ? `Booked with ${bookingTherapist.name}\nSlot: ${new Date(selectedSlot).toLocaleString()}`
            : "Select a slot first."
    );
    setBookingOpen(false);
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Top nav */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Explore therapists</h1>
              <p className="text-gray-600 mt-2">
                Filter by city, availability, and topic. Then view profiles or book a session.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                  className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                  onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </button>
              <button
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() => router.push("/onboarding")}
              >
                Find me a match
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 bg-white border rounded-2xl p-5">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Search</label>
                <input
                    className="mt-1 w-full border rounded-lg p-2"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Name, specialization, description..."
                />
              </div>

              <div>
                <label className="text-sm font-medium">Topic</label>
                <select
                    className="mt-1 w-full border rounded-lg p-2 bg-white"
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                >
                  {ISSUES.map((x) => (
                      <option key={x.value} value={x.value}>
                        {x.label}
                      </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Sort</label>
                <select
                    className="mt-1 w-full border rounded-lg p-2 bg-white"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as any)}
                >
                  <option value="newest">Newest</option>
                  <option value="name">Name (A–Z)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">City</label>
                <div className="mt-1">
                  <CityAutocomplete value={city} onChange={setCity} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Approach</label>
                <select
                    className="mt-1 w-full border rounded-lg p-2 bg-white"
                    value={approach}
                    onChange={(e) => setApproach(e.target.value)}
                >
                  {APPROACHES.map((x) => (
                      <option key={x.value} value={x.value}>
                        {x.label}
                      </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Price</label>
                <select
                    className="mt-1 w-full border rounded-lg p-2 bg-white"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                >
                  {PRICE.map((x) => (
                      <option key={x.value} value={x.value}>
                        {x.label}
                      </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-4 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
                  <input
                      type="checkbox"
                      checked={onlineOnly}
                      onChange={(e) => setOnlineOnly(e.target.checked)}
                  />
                  Online only
                </label>

                <div className="flex gap-2">
                  <button
                      className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                      onClick={resetFilters}
                  >
                    Reset
                  </button>
                  <button
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                      onClick={applyFilters}
                  >
                    Apply filters
                  </button>
                </div>
              </div>
            </div>

            {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
            )}
          </div>

          {/* List */}
          <div className="mt-6">
            {loading ? (
                <div className="p-10 min-h-[30vh] bg-gradient-to-br from-indigo-100 to-blue-200 rounded-2xl">
                  Loading...
                </div>
            ) : filteredLocal.length === 0 ? (
                <div className="bg-white border rounded-2xl p-6">
                  <h2 className="text-lg font-semibold">No results</h2>
                  <p className="text-gray-600 mt-2">Try changing filters or search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredLocal.map((t) => (
                      <div key={t._id} className="bg-white border rounded-2xl p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold">{t.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {t.city} • {t.online ? "Online" : "In-person"}
                              {t.priceRange ? ` • ${t.priceRange}` : ""}
                            </p>
                          </div>

                          <span
                              className={cn(
                                  "text-xs rounded-full border px-3 py-1",
                                  t.online
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-gray-50 text-gray-700 border-gray-200"
                              )}
                          >
                      {t.specialization || "Therapist"}
                    </span>
                        </div>

                        {t.description ? (
                            <p className="text-sm text-gray-700 mt-3 line-clamp-3">
                              {t.description}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500 mt-3">
                              No description provided.
                            </p>
                        )}

                        {t.approaches?.length ? (
                            <p className="text-sm text-gray-700 mt-3">
                              <span className="font-medium">Approaches:</span>{" "}
                              {t.approaches.slice(0, 3).join(", ")}
                              {t.approaches.length > 3 ? "…" : ""}
                            </p>
                        ) : null}

                        <div className="mt-5 flex gap-2">
                          <button
                              className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                              onClick={() => router.push(`/therapists/${t._id}`)}
                          >
                            View profile
                          </button>

                          <button
                              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                              onClick={() => openBooking(t)}
                          >
                            Book session
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </div>
        </div>

        {/* Booking modal */}
        <Modal
            open={bookingOpen}
            title={bookingTherapist ? `Book with ${bookingTherapist.name}` : "Book a session"}
            onClose={() => setBookingOpen(false)}
        >
          <p className="text-sm text-gray-600">
            Select an available time slot (mock for now).
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {slots.map((s) => {
              const active = selectedSlot === s.iso;
              return (
                  <button
                      key={s.iso}
                      type="button"
                      onClick={() => setSelectedSlot(s.iso)}
                      className={cn(
                          "px-3 py-2 rounded-xl border text-sm text-left",
                          active
                              ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                              : "border-gray-200 hover:bg-gray-50"
                      )}
                  >
                    {s.label}
                  </button>
              );
            })}
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                onClick={() => setBookingOpen(false)}
            >
              Cancel
            </button>
            <button
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                disabled={!selectedSlot}
                onClick={confirmBooking}
            >
              Confirm booking
            </button>
          </div>
        </Modal>
      </div>
  );
}
