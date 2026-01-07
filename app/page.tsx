"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CityAutocomplete from "./components/CityAutocomplete";

export default function Home() {
  const router = useRouter();

  const [issue, setIssue] = useState("");
  const [city, setCity] = useState("");
  const [online, setOnline] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();

    if (issue) params.append("issue", issue);
    if (city) params.append("city", city);
    params.append("online", String(online));

    router.push(`/therapists?${params.toString()}`);
  }

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2 text-center">
          Găsește un psihoterapeut potrivit
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Completează câteva informații și vezi recomandările disponibile
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* PROBLEMĂ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cu ce te confrunți?
            </label>
            <select
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Selectează</option>
              <option value="anxietate">Anxietate</option>
              <option value="depresie">Depresie</option>
              <option value="stres">Stres</option>
              <option value="relatii">Probleme de relație</option>
              <option value="burnout">Burnout</option>
            </select>
          </div>

          {/* ORAȘ – AUTOCOMPLETE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Oraș
            </label>

            <CityAutocomplete
              value={city}
              onChange={setCity}
            />
          </div>

          {/* ONLINE */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={online}
              onChange={(e) => setOnline(e.target.checked)}
            />
            <span className="text-sm text-gray-700">
              Prefer ședințe online
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Vezi terapeuți
          </button>
        </form>
      </div>
    </div>
  );
}
