"use client";

import { useEffect, useState } from "react";

export default function CityAutocomplete({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    const [query, setQuery] = useState(value);
    const [items, setItems] = useState<string[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    useEffect(() => {
        if (!query.trim()) {
            setItems([]);
            return;
        }

        const ctrl = new AbortController();

        fetch(`/api/cities?q=${encodeURIComponent(query)}`, {
            signal: ctrl.signal,
            cache: "no-store",
        })
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) setItems(data);
            })
            .catch(() => {});

        return () => ctrl.abort();
    }, [query]);

    return (
        <div className="relative">
            <input
                className="w-full border rounded-lg p-2"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    onChange(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="Type a city..."
            />

            {open && items.length > 0 && (
                <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow">
                    {items.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => {
                                onChange(c);
                                setQuery(c);
                                setOpen(false);
                            }}
                            className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                        >
                            {c}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
