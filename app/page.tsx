"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Login failed.");
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border">
          <h1 className="text-2xl font-bold text-center">TherapyMatching</h1>
          <p className="text-gray-600 text-center mt-2">Log in to continue.</p>

          {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
          )}

          <form onSubmit={onLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                  className="mt-1 w-full border rounded-lg p-2"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  required
              />
            </div>

            <button
                disabled={submitting}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                type="submit"
            >
              {submitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-gray-600">
            No account yet?{" "}
            <button
                type="button"
                className="text-indigo-700 font-medium hover:underline"
                onClick={() => router.push("/auth/sign-up")}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
  );
}
