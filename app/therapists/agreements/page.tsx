"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TherapistAgreementsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState("");
    const [version, setVersion] = useState("");
    const [error, setError] = useState("");
    const [checked, setChecked] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError("");
            try {
                const res = await fetch("/api/therapists/agreements", { method: "GET" });
                const data = await res.json().catch(() => null);
                if (!res.ok) throw new Error(data?.error || `Failed to load agreement (${res.status})`);

                if (!cancelled) {
                    setText(String(data?.text ?? ""));
                    setVersion(String(data?.version ?? ""));
                }
            } catch (e: any) {
                if (!cancelled) setError(e?.message || "Failed to load agreement.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    async function accept() {
        setError("");
        if (!checked) {
            setError("Trebuie să bifezi că ești de acord.");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/therapists/agreements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    agreed: true,
                    version,
                    commissionPct: 15,
                }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.error || `Failed (${res.status})`);

            router.push("/therapists/dashboard");
        } catch (e: any) {
            setError(e?.message || "Failed to accept.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto bg-white border rounded-2xl p-6 shadow-sm">
                <h1 className="text-2xl font-bold">Agreement</h1>
                <p className="text-sm text-gray-600 mt-1">Version: {version || "—"}</p>

                {error && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="mt-6 text-gray-600">Loading...</div>
                ) : (
                    <>
            <pre className="mt-6 whitespace-pre-wrap text-sm text-gray-800 border rounded-xl p-4 bg-gray-50">
              {text}
            </pre>

                        <label className="mt-6 flex items-start gap-3 text-sm text-gray-800">
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => setChecked(e.target.checked)}
                                className="mt-1"
                            />
                            <span>
                Sunt de acord cu termenii, inclusiv comisionul de <b>15%</b> din prețul fiecărei ședințe.
              </span>
                        </label>

                        <button
                            onClick={accept}
                            disabled={saving}
                            className="mt-6 w-full px-4 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Accept & continue"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
