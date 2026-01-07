"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TherapistCard from "./components/TherapistCard";

export default function TherapistsClient() {
  const searchParams = useSearchParams();

  const issue = searchParams.get("issue");
  const city = searchParams.get("city");
  const online = searchParams.get("online");

  const [therapists, setTherapists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTherapists() {
      const params = new URLSearchParams();

      if (issue) params.append("issue", issue);
      if (city) params.append("city", city);
      if (online) params.append("online", online);

      const res = await fetch(`/api/therapists?${params.toString()}`);
      const data = await res.json();

      setTherapists(data);
      setLoading(false);
    }

    loadTherapists();
  }, [issue, city, online]);

  if (loading) {
    return (
      <div className="p-10 min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 text-indigo-700">
        Se încarcă terapeuții...
      </div>
    );
  }

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200">
      <h1 className="text-4xl mb-6 font-bold text-indigo-700 drop-shadow-md">
        Terapeuți disponibili
      </h1>

      <div className="mb-6 text-sm text-indigo-700">
        {issue && <span className="mr-4">🧠 Problemă: <b>{issue}</b></span>}
        {city && <span className="mr-4">📍 Oraș: <b>{city}</b></span>}
        {online === "true" && <span>💻 Online</span>}
      </div>

      {therapists.length === 0 ? (
        <p className="text-gray-700">
          Nu am găsit terapeuți care să corespundă criteriilor tale.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {therapists.map((therapist) => (
            <TherapistCard key={therapist._id} therapist={therapist} />
          ))}
        </div>
      )}
    </div>
  );
}
