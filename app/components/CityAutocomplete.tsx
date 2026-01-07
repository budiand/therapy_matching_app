"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

export default function CityAutocomplete({ value, onChange }: any) {
  const [cities, setCities] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function loadCities() {
      const res = await fetch("/api/therapists/cities");
      setCities(await res.json());
    }
    loadCities();
  }, []);

  function handleInput(e: any) {
    const val = e.target.value;
    onChange(val);

    if (!val) {
      setFiltered([]);
      setShow(false);
      return;
    }

    const matches = cities.filter((c) =>
      c.toLowerCase().includes(val.toLowerCase())
    );

    setFiltered(matches);
    setShow(true);
  }

  function selectCity(city: string) {
    onChange(city);
    setShow(false);
  }

  return (
    <div className="relative">
      <input
        value={value}
        onChange={handleInput}
        placeholder="Începe să scrii orașul"
        className="w-full border rounded-lg p-2"
        autoComplete="off"
      />

      {show && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded-lg mt-1 w-full max-h-40 overflow-auto shadow">
          {filtered.map((city) => (
            <li
              key={city}
              onClick={() => selectCity(city)}
              className="px-3 py-2 cursor-pointer hover:bg-indigo-100"
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
