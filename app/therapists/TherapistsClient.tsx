"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CityAutocomplete from "../components/CityAutocomplete";

type Therapist = {
  _id: string;
  name: string;
  city?: string;
  online?: boolean;

  priceRange?: string;
  description?: string;

  specializations?: string[];
  approaches?: string[];

  // legacy fields
  specialization?: string;
  approach?: string;

  createdAt?: string; // helpful for "newest" sort if returned by API
};

const TOPICS = [
  { value: "", label: "All topics" },

  // Emotional health
  { value: "Anxiety", label: "Anxiety" },
  { value: "Depression", label: "Depression" },
  { value: "Panic attacks", label: "Panic attacks" },
  { value: "Burnout", label: "Burnout" },
  { value: "Stress", label: "Stress" },
  { value: "Sleep problems", label: "Sleep problems" },
  { value: "Emotional regulation", label: "Emotional regulation" },
  { value: "Overthinking / rumination", label: "Overthinking / rumination" },
  { value: "Perfectionism", label: "Perfectionism" },
  { value: "Trauma", label: "Trauma" },
  { value: "Grief", label: "Grief" },

  // Relationships
  { value: "Relationships", label: "Relationships" },
  { value: "Family", label: "Family" },
  { value: "Couples", label: "Couples" },
  { value: "Communication issues", label: "Communication issues" },
  { value: "Attachment / fear of abandonment", label: "Attachment / fear of abandonment" },
  { value: "Conflict & boundaries", label: "Conflict & boundaries" },
  { value: "Social difficulties", label: "Social difficulties" },
  { value: "Social anxiety", label: "Social anxiety" },

  // Identity & personal life
  { value: "Self-esteem", label: "Self-esteem" },
  { value: "LGBTQ+", label: "LGBTQ+" },
  { value: "Gender identity", label: "Gender identity" },
  { value: "Meaning & life direction", label: "Meaning & life direction" },
  { value: "Self-exploration", label: "Self-exploration" },

  // Professional life
  { value: "Career", label: "Career" },
  { value: "Performance", label: "Performance" },
  { value: "Major decisions", label: "Major decisions" },
  { value: "Work-life balance", label: "Work-life balance" },

  // Behaviors
  { value: "Procrastination", label: "Procrastination" },
  { value: "Habits I want to change", label: "Habits I want to change" },
  { value: "Addictions", label: "Addictions" },
  { value: "Anger management", label: "Anger management" },

  // Clinical topics
  { value: "ADHD", label: "ADHD" },
  { value: "Eating disorders", label: "Eating disorders" },
];


const APPROACHES = [
  { value: "", label: "Any approach" },
  { value: "CBT", label: "CBT" },
  { value: "ACT", label: "ACT" },
  { value: "Psychodynamic", label: "Psychodynamic" },
  { value: "Humanistic", label: "Humanistic" },
  { value: "Schema therapy", label: "Schema therapy" },
  { value: "Systemic", label: "Systemic" },
  { value: "Integrative", label: "Integrative" },
  { value: "Mindfulness-based", label: "Mindfulness-based" },
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

function getTherapyLabel(t: Therapist) {
  // show something meaningful on the pill
  return (
      t.specialization ||
      t.specializations?.[0] ||
      (t.approaches?.[0] ? `Approach: ${t.approaches[0]}` : "") ||
      "Therapist"
  );
}

export default function TherapistsClient() {
  const router = useRouter();

  // server filters
  const [city, setCity] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [topic, setTopic] = useState("");

  // local filters
  const [approach, setApproach] = useState("");
  const [price, setPrice] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"newest" | "name">("newest");

  // data
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Therapist[]>([]);
  const [error, setError] = useState("");

  async function loadFromApi() {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (city.trim()) params.set("city", city.trim());
      if (onlineOnly) params.set("online", "true");
      if (topic) params.set("issue", topic);

      const res = await fetch(`/api/therapists?${params.toString()}`, {
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || `Failed to load therapists (${res.status})`);
      }

      setItems(Array.isArray(data) ? (data as Therapist[]) : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredLocal = useMemo(() => {
    let arr = [...items];

    // Search
    if (q.trim()) {
      const qq = norm(q);
      arr = arr.filter((t) => {
        const allApproaches = [...(t.approaches || []), t.approach].filter(Boolean) as string[];
        const allSpecs = [...(t.specializations || []), t.specialization].filter(Boolean) as string[];

        const hay = [
          t.name,
          t.city,
          t.description,
          t.priceRange,
          ...allSpecs,
          ...allApproaches,
        ]
            .filter(Boolean)
            .map(String)
            .map(norm)
            .join(" | ");

        return hay.includes(qq);
      });
    }

    // Approach (local)
    if (approach) {
      const a = norm(approach);
      arr = arr.filter((t) => {
        const allApproaches = [...(t.approaches || []), t.approach].filter(Boolean) as string[];
        return allApproaches.some((x) => norm(x).includes(a));
      });
    }

    // Price (local)
    if (price) {
      const p = norm(price);
      arr = arr.filter((t) => norm(t.priceRange).includes(p));
    }

    // Sort
    if (sort === "name") {
      arr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else {
      // newest
      arr.sort((a, b) => {
        const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bt - at;
      });
    }

    return arr;
  }, [items, q, approach, price, sort]);

  function resetFilters() {
    setCity("");
    setOnlineOnly(false);
    setTopic("");
    setApproach("");
    setPrice("");
    setQ("");
    setSort("newest");
    void loadFromApi();
  }

  function viewProfile(t: Therapist) {
    router.push(`/therapists/${t._id}`);
  }

  function bookSession(t: Therapist) {
    router.push(`/book/${t._id}`);
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Explore therapists</h1>
              <p className="text-gray-600 mt-2">
                Filter by city, format, and topic. Then view profiles or book a session.
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
              {/* Search */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Search</label>
                <input
                    className="mt-1 w-full border rounded-lg p-2"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Name, topic, approach, description..."
                />
              </div>

              {/* Topic (server) */}
              <div>
                <label className="text-sm font-medium">Topic</label>
                <select
                    className="mt-1 w-full border rounded-lg p-2 bg-white"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                >
                  {TOPICS.map((x) => (
                      <option key={x.value} value={x.value}>
                        {x.label}
                      </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
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

              {/* City (server) */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium">City</label>
                <div className="mt-1">
                  <CityAutocomplete value={city} onChange={setCity} />
                </div>
              </div>

              {/* Approach (local) */}
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

              {/* Price (local) */}
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

              {/* Online + actions */}
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
                      onClick={loadFromApi}
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

          {/* Results */}
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
                              {(t.city || "—")} • {t.online ? "Online available" : "In-person only"}
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
                      {getTherapyLabel(t)}
                    </span>
                        </div>

                        {t.description ? (
                            <p className="text-sm text-gray-700 mt-3 line-clamp-3">{t.description}</p>
                        ) : (
                            <p className="text-sm text-gray-500 mt-3">No description provided.</p>
                        )}

                        {(t.approaches?.length || t.approach) ? (
                            <p className="text-sm text-gray-700 mt-3">
                              <span className="font-medium">Approaches:</span>{" "}
                              {[...(t.approaches || []), t.approach]
                                  .filter(Boolean)
                                  .slice(0, 3)
                                  .join(", ")}
                              {((t.approaches?.length || 0) + (t.approach ? 1 : 0)) > 3 ? "…" : ""}
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
        </div>
      </div>
  );
}
