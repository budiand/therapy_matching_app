"use client";

import { useEffect, useState } from "react";

type CityAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function CityAutocomplete({
                                           value,
                                           onChange,
                                         }: CityAutocompleteProps) {
  const [cities, setCities] = useState<string[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCities() {
      try {
        setLoading(true);
        const res = await fetch("/api/therapists/cities");
        const data = (await res.json()) as string[];
        setCities(data);
      } catch (err) {
        console.error("Failed to load cities", err);
      } finally {
        setLoading(false);
      }
    }

    loadCities();
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (!inputValue.trim()) {
      setFilteredCities([]);
      setIsOpen(false);
      return;
    }

    const matches = cities.filter((city) =>
        city.toLowerCase().includes(inputValue.toLowerCase())
    );

    setFilteredCities(matches.slice(0, 20)); // limit results
    setIsOpen(true);
  }

  function handleSelect(city: string) {
    onChange(city);
    setIsOpen(false);
  }

  function handleBlur() {
    // Delay to allow click on dropdown item
    setTimeout(() => setIsOpen(false), 150);
  }

  return (
      <div className="relative">
        <input
            type="text"
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={loading ? "Loading cities..." : "Start typing your city"}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoComplete="off"
        />

        {isOpen && filteredCities.length > 0 && (
            <ul className="absolute z-20 mt-1 w-full max-h-48 overflow-auto rounded-lg border bg-white shadow-lg">
              {filteredCities.map((city) => (
                  <li
                      key={city}
                      onMouseDown={() => handleSelect(city)}
                      className="cursor-pointer px-3 py-2 text-sm hover:bg-indigo-100"
                  >
                    {city}
                  </li>
              ))}
            </ul>
        )}

        {isOpen && !loading && filteredCities.length === 0 && (
            <div className="absolute z-20 mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-500 shadow">
              No cities found
            </div>
        )}
      </div>
  );
}
