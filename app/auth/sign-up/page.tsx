"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [age, setAge] = useState<number>(18);
    const [password, setPassword] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, age, password }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.error || "Sign up failed.");
            }

            router.push("/dashboard");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center">Create your account</h1>
                <p className="text-gray-600 text-center mt-2">
                    Sign up to get personalized therapist matches.
                </p>

                {error && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                    <div>
                        <label className="text-sm font-medium">Full name</label>
                        <input
                            className="mt-1 w-full border rounded-lg p-2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <input
                            className="mt-1 w-full border rounded-lg p-2"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Phone</label>
                        <input
                            className="mt-1 w-full border rounded-lg p-2"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+40..."
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Age</label>
                        <input
                            className="mt-1 w-full border rounded-lg p-2"
                            type="number"
                            min={13}
                            max={120}
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Password</label>
                        <input
                            className="mt-1 w-full border rounded-lg p-2"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <button
                        disabled={submitting}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        type="submit"
                    >
                        {submitting ? "Creating..." : "Create account"}
                    </button>
                </form>

                <div className="mt-5 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="text-indigo-700 font-medium hover:underline"
                        onClick={() => router.push("/auth/sign-in")}
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
}
