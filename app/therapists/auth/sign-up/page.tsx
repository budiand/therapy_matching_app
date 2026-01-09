"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type TherapistType =
    | "clinical_psychologist"
    | "psychotherapist"
    | "counselor"
    | "psychiatrist"
    | "trainee_supervised"
    | "other";

type SessionStructure = "structured" | "semi" | "free";
type TherapistActivity = "active" | "balanced" | "listening";
type CommunicationStyle = "monologue" | "questions" | "mix";
type GuidanceStyle = "autonomous" | "need_push" | "mix";
type FocusStyle = "thoughts" | "emotions" | "mix";

export default function TherapistSignUpPage() {
  const router = useRouter();

  // Basic
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [online, setOnline] = useState(false);
  const [password, setPassword] = useState("");

  // REQUIRED by your schema
  const [therapistType, setTherapistType] = useState<TherapistType>("psychotherapist");
  const [sessionStructure, setSessionStructure] = useState<SessionStructure>("semi");
  const [therapistActivity, setTherapistActivity] = useState<TherapistActivity>("balanced");
  const [communicationStyle, setCommunicationStyle] = useState<CommunicationStyle>("mix");
  const [guidanceStyle, setGuidanceStyle] = useState<GuidanceStyle>("mix");
  const [focusStyle, setFocusStyle] = useState<FocusStyle>("mix");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // ✅ plural routes everywhere
      const res = await fetch("/api/therapists/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          city,
          online,
          password,

          // REQUIRED
          therapistType,
          sessionStructure,
          therapistActivity,
          communicationStyle,
          guidanceStyle,
          focusStyle,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
            data?.error || data?.message || `Sign up failed (${res.status}).`
        );
      }

      router.push("/therapists/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center">Therapist sign up</h1>
          <p className="text-gray-600 text-center mt-2">
            Create your therapist account.
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
              <label className="text-sm font-medium">City</label>
              <input
                  className="mt-1 w-full border rounded-lg p-2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bucharest"
                  required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                  id="online"
                  type="checkbox"
                  checked={online}
                  onChange={(e) => setOnline(e.target.checked)}
              />
              <label htmlFor="online" className="text-sm">
                Available for online sessions
              </label>
            </div>

            <div>
              <label className="text-sm font-medium">Therapist type</label>
              <select
                  className="mt-1 w-full border rounded-lg p-2 bg-white"
                  value={therapistType}
                  onChange={(e) => setTherapistType(e.target.value as TherapistType)}
                  required
              >
                <option value="clinical_psychologist">Clinical psychologist</option>
                <option value="psychotherapist">Psychotherapist</option>
                <option value="counselor">Counselor</option>
                <option value="psychiatrist">Psychiatrist</option>
                <option value="trainee_supervised">Trainee (supervised)</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="pt-2">
              <p className="text-sm font-semibold">Matching style (required)</p>
              <p className="text-xs text-gray-500 mt-1">
                These help clients find a better fit. You can refine them later.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Session structure</label>
              <select
                  className="mt-1 w-full border rounded-lg p-2 bg-white"
                  value={sessionStructure}
                  onChange={(e) => setSessionStructure(e.target.value as SessionStructure)}
                  required
              >
                <option value="structured">Structured</option>
                <option value="semi">Semi-structured</option>
                <option value="free">Free / open</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Therapist activity</label>
              <select
                  className="mt-1 w-full border rounded-lg p-2 bg-white"
                  value={therapistActivity}
                  onChange={(e) => setTherapistActivity(e.target.value as TherapistActivity)}
                  required
              >
                <option value="active">Active</option>
                <option value="balanced">Balanced</option>
                <option value="listening">Mostly listening</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Communication style</label>
              <select
                  className="mt-1 w-full border rounded-lg p-2 bg-white"
                  value={communicationStyle}
                  onChange={(e) => setCommunicationStyle(e.target.value as CommunicationStyle)}
                  required
              >
                <option value="questions">Mostly questions</option>
                <option value="monologue">Mostly therapist talks</option>
                <option value="mix">Mix</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Guidance style</label>
              <select
                  className="mt-1 w-full border rounded-lg p-2 bg-white"
                  value={guidanceStyle}
                  onChange={(e) => setGuidanceStyle(e.target.value as GuidanceStyle)}
                  required
              >
                <option value="autonomous">Client-led</option>
                <option value="need_push">Needs a push</option>
                <option value="mix">Mix</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Focus style</label>
              <select
                  className="mt-1 w-full border rounded-lg p-2 bg-white"
                  value={focusStyle}
                  onChange={(e) => setFocusStyle(e.target.value as FocusStyle)}
                  required
              >
                <option value="thoughts">Thoughts</option>
                <option value="emotions">Emotions</option>
                <option value="mix">Mix</option>
              </select>
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
                  minLength={6}
              />
            </div>

            <button
                disabled={submitting}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                type="submit"
            >
              {submitting ? "Creating..." : "Create therapist account"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-gray-600">
            Already a therapist?{" "}
            <button
                type="button"
                className="text-indigo-700 font-medium hover:underline"
                onClick={() => router.push("/therapists/auth/sign-in")}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
  );
}
