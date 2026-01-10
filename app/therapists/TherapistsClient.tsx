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

  // în schema ta mare ai:
  specializations?: string[];
  approaches?: string[];

  // în unele coduri vechi ai:
  specialization?: string;
};

const ISSUES = [
  { value: "", label: "All topics" },
  { value: "Anxiety", label: "Anxiety" },
  { value: "Depression", label: "Depression" },
  { value: "Burnout", label: "Burnout" },
  { value: "Relationships", label: "Relationships" },
  { value: "Family", label: "Family" },
  { value: "LGBTQ+", label: "LGBTQ+" },
];

const APPROACHES = [
  { value: "", label: "Any approach" },
  { value: "CBT", label: "CBT" },
  { value: "Psychodynamic", label: "Psychodynamic" },
  { value: "ACT", label: "ACT" },
  { value: "Schema therapy", label: "Schema therapy" },
  { value: "Gestalt", label: "Gestalt" },
  { value: "DBT", label: "DBT" },
  { value: "EMDR", label: "EMDR" },
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

function norm(s?: string) {
  return (s || "").toLowerCase().trim();
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

  async function load() {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (city.trim()) params.set("city", city.trim());
      params.set("online", String(onlineOnly)); // backend-ul tău suportă online
      if (issue) params.set("issue", issue); // backend: issue -> specialization (regex)

      const res = await fetch(`/api/therapists?${params.toString()}`, { cache: "no-store" });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || `Failed to load therapists (${res.status})`);
      }

      // backend-ul tău returnează array direct
      setItems(Array.isArray(data) ? (data as Therapist[]) : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredLocal = useMemo(() => {
    let arr = [...items];

    // q search
    if (q.trim()) {
      const qq = norm(q);
      arr = arr.filter((t) => {
        const hay = [
          t.name,
          t.city,
          t.description,
          t.priceRange,
          t.specialization,
          ...(t.specializations || []),
          ...(t.approaches || []),
        ]
            .filter(Boolean)
            .map(String)
            .map(norm)
            .join(" | ");

        return hay.includes(qq);
      });
    }

    // approach filter
    if (approach) {
      const a = norm(approach);
      arr = arr.filter((t) => (t.approaches || []).some((x) => norm(x).includes(a)));
    }

    // price filter (MVP: string contains)
    if (price) {
      const p = norm(price);
      arr = arr.filter((t) => norm(t.priceRange).includes(p));
    }

    // sort
    if (sort === "name") {
      arr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return arr;
  }, [items, q, approach, price, sort]);

  function resetFilters() {
    setCity("");
    setOnlineOnly(false);
    setIssue("");
    setApproach("");
    setPrice("");
    setQ("");
    setSort("newest");
    setTimeout(() => load(), 0);
  }

  function viewProfile(t: Therapist) {
    router.push(`/therapists/${t._id}`);
  }

  function bookSession(t: Therapist) {
    // booking-ul REAL îl faci în /book/[id]
    router.push(`/book/${t._id}`);
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Top header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Explore therapists</h1>
              <p className="text-gray-600 mt-2">
                Filter by city, availability format and topic. Then view profiles or book a session.
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
                    placeholder="Name, topic, approach, description..."
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
                      onClick={load}
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
                              {t.city} • {t.online ? "Online available" : "In-person only"}
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
                      {t.specialization || (t.specializations?.[0] ?? "Therapist")}
                    </span>
                        </div>

                        {t.description ? (
                            <p className="text-sm text-gray-700 mt-3 line-clamp-3">{t.description}</p>
                        ) : (
                            <p className="text-sm text-gray-500 mt-3">No description provided.</p>
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
                              onClick={() => viewProfile(t)}
                          >
                            View profile
                          </button>

                          <button
                              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                              onClick={() => bookSession(t)}
                          >
                            Book session
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Booking opens the therapist-specific booking page: <span className="font-mono">/book/[id]</span>
          </p>
        </div>
      </div>
  );
}
