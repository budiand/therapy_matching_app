"use client";

import { useMemo, useState } from "react";
import CityAutocomplete from "../components/CityAutocomplete";

type TherapyMode = "online" | "in_person" | "either";
type SessionStructure = "structured" | "semi" | "free";
type TherapistActivity = "active" | "balanced" | "listening";
type CommunicationStyle = "monologue" | "questions" | "mix";
type GuidanceNeed = "autonomous" | "need_push" | "mix";
type FocusStyle = "thoughts" | "emotions" | "mix";

type FormState = {
    ageRange: string;
    genderIdentity: string;
    city: string;
    language: string;
    mode: TherapyMode;

    reasons: string[];

    therapistGenderPreference: string;
    therapistAgePreference: string;
    hadTherapyBefore: "yes" | "no" | "prefer_not";
    dealbreakers: string[];

    sessionStructure: SessionStructure;
    therapistActivity: TherapistActivity;
    communicationStyle: CommunicationStyle;
    guidanceNeed: GuidanceNeed;
    focusStyle: FocusStyle;

    goalHorizon: "1_3" | "3_6" | "6_12" | "unsure";
    goalsText: string;

    wantsHabitChange: "yes" | "no";
    habitDetails: string;

    notes: string;
    consentData: boolean;
};

const AGE_RANGES = ["Under 18", "18–24", "25–34", "35–44", "45–54", "55–64", "65+"];

const REASONS_GROUPS: { title: string; items: string[] }[] = [
    {
        title: "Emotional health",
        items: [
            "Anxiety",
            "Depression / persistent low mood",
            "Panic attacks",
            "Burnout / chronic stress",
            "Sleep problems",
            "Emotional regulation",
            "Overthinking / rumination",
        ],
    },
    {
        title: "Relationships",
        items: [
            "Family",
            "Couples",
            "Communication issues",
            "Attachment / fear of abandonment",
            "Conflict & boundaries",
            "Social difficulties",
        ],
    },
    {
        title: "Identity & personal life",
        items: [
            "Self-esteem",
            "LGBTQ+",
            "Gender identity",
            "Meaning & life direction",
            "Self-exploration",
        ],
    },
    {
        title: "Professional life",
        items: ["Career", "Performance", "Major decisions", "Work-life balance"],
    },
    {
        title: "Behaviors",
        items: [
            "Procrastination",
            "Addictions (substance or behavioral)",
            "Habits I want to change",
            "Anger management",
        ],
    },
];

const DEALBREAKERS = [
    "Too rigid",
    "Too passive / mostly listening",
    "Too emotionally distant",
    "Too spiritual / esoteric",
    "Too theoretical, not practical",
];

function Section({
                     title,
                     subtitle,
                     children,
                 }: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="bg-white rounded-2xl shadow-sm border p-5 md:p-6">
            <div className="mb-4">
                <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
                {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {children}
        </section>
    );
}

function PillRadio<T extends string>({
                                         value,
                                         onChange,
                                         options,
                                     }: {
    value: T;
    onChange: (v: T) => void;
    options: { value: T; label: string; hint?: string }[];
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((opt) => {
                const active = opt.value === value;
                return (
                    <button
                        type="button"
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                            active
                                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                : "border-gray-200 hover:bg-gray-50"
                        }`}
                        title={opt.hint}
                        aria-pressed={active}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}

function CheckboxGrid({
                          selected,
                          onToggle,
                          items,
                      }: {
    selected: string[];
    onToggle: (item: string) => void;
    items: string[];
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {items.map((it) => {
                const checked = selected.includes(it);
                return (
                    <label
                        key={it}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer select-none ${
                            checked ? "border-indigo-600 bg-indigo-50" : "border-gray-200"
                        }`}
                    >
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => onToggle(it)}
                            className="h-4 w-4"
                        />
                        <span className="text-sm">{it}</span>
                    </label>
                );
            })}
        </div>
    );
}

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const totalSteps = 4;

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string>("");

    const [form, setForm] = useState<FormState>({
        ageRange: "18–24",
        genderIdentity: "",
        city: "",
        language: "English",
        mode: "either",

        reasons: [],

        therapistGenderPreference: "No preference",
        therapistAgePreference: "No preference",
        hadTherapyBefore: "prefer_not",
        dealbreakers: [],

        sessionStructure: "semi",
        therapistActivity: "balanced",
        communicationStyle: "mix",
        guidanceNeed: "mix",
        focusStyle: "mix",

        goalHorizon: "3_6",
        goalsText: "",

        wantsHabitChange: "no",
        habitDetails: "",

        notes: "",
        consentData: true,
    });

    function update<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function toggleInArray(key: "reasons" | "dealbreakers", item: string) {
        setForm((prev) => {
            const arr = prev[key];
            return {
                ...prev,
                [key]: arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item],
            };
        });
    }

    const progressPct = useMemo(() => Math.round((step / totalSteps) * 100), [step]);

    const canGoNext = useMemo(() => {
        if (step === 1) return form.city.trim().length > 0;
        if (step === 2) return form.reasons.length > 0;
        return true;
    }, [step, form.city, form.reasons.length]);

    function next() {
        setError("");
        if (!canGoNext) {
            if (step === 1) setError("Please select a city to continue.");
            if (step === 2) setError("Please select at least one topic to continue.");
            return;
        }
        setStep((s) => Math.min(totalSteps, s + 1));
    }

    function back() {
        setError("");
        setStep((s) => Math.max(1, s - 1));
    }

    async function handleSubmit() {
        setError("");

        if (!form.consentData) {
            setError("Please accept the consent checkbox to continue.");
            return;
        }

        setSubmitting(true);

        try {
            // ✅ 1) Save intake locally so /matching/results can read it
            sessionStorage.setItem("intake", JSON.stringify(form));

            // ✅ 2) Optional: also store in DB (do not block redirect if it fails)
            fetch("/api/intake", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            }).catch(() => {
                // ignore for MVP
            });

            // ✅ 3) Redirect to results (where matching happens)
            window.location.href = "/matching/results";
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Something went wrong.";
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 py-8">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold">Find your therapist match</h1>
                    <p className="text-gray-600 mt-2">
                        Answer a few questions so we can match you based on style, personality, and needs.
                    </p>

                    <div className="mt-4">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-2 bg-indigo-600" style={{ width: `${progressPct}%` }} />
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                            Step {step} of {totalSteps}
                        </div>
                    </div>
                </header>

                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="space-y-5">
                    {step === 1 && (
                        <Section
                            title="Basic information"
                            subtitle="This helps us filter options (location, language, and session format)."
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium">Age range</label>
                                    <select
                                        className="mt-1 w-full border rounded-lg p-2 bg-white"
                                        value={form.ageRange}
                                        onChange={(e) => update("ageRange", e.target.value)}
                                    >
                                        {AGE_RANGES.map((r) => (
                                            <option key={r} value={r}>
                                                {r}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Gender identity (optional)</label>
                                    <input
                                        className="mt-1 w-full border rounded-lg p-2"
                                        value={form.genderIdentity}
                                        onChange={(e) => update("genderIdentity", e.target.value)}
                                        placeholder="e.g. woman, man, non-binary"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium">City</label>
                                    <div className="mt-1">
                                        <CityAutocomplete value={form.city} onChange={(v: string) => update("city", v)} />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        If you choose online sessions, city matters less — but it can help with context/time zone.
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Session format</label>
                                    <div className="mt-2">
                                        <PillRadio<TherapyMode>
                                            value={form.mode}
                                            onChange={(v) => update("mode", v)}
                                            options={[
                                                { value: "online", label: "Online" },
                                                { value: "in_person", label: "In person" },
                                                { value: "either", label: "Either" },
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Language</label>
                                    <select
                                        className="mt-1 w-full border rounded-lg p-2 bg-white"
                                        value={form.language}
                                        onChange={(e) => update("language", e.target.value)}
                                    >
                                        <option value="English">English</option>
                                        <option value="Romanian">Romanian</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </Section>
                    )}

                    {step === 2 && (
                        <Section
                            title="What would you like to work on?"
                            subtitle="Select one or more topics. This is not a diagnosis — it just helps matching."
                        >
                            <div className="space-y-5">
                                {REASONS_GROUPS.map((g) => (
                                    <div key={g.title}>
                                        <h3 className="font-medium mb-2">{g.title}</h3>
                                        <CheckboxGrid
                                            items={g.items}
                                            selected={form.reasons}
                                            onToggle={(i) => toggleInArray("reasons", i)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {step === 3 && (
                        <Section
                            title="Therapy style & compatibility"
                            subtitle="We match you on fit: structure, activity level, and conversation style."
                        >
                            <div className="space-y-6">
                                <div>
                                    <p className="font-medium mb-2">How structured should sessions be?</p>
                                    <PillRadio<SessionStructure>
                                        value={form.sessionStructure}
                                        onChange={(v) => update("sessionStructure", v)}
                                        options={[
                                            { value: "structured", label: "Structured", hint: "Agenda + clear steps" },
                                            { value: "semi", label: "Semi-structured", hint: "Mix of structure and exploration" },
                                            { value: "free", label: "Free-flowing", hint: "More open exploration" },
                                        ]}
                                    />
                                </div>

                                <div>
                                    <p className="font-medium mb-2">How active should your therapist be?</p>
                                    <PillRadio<TherapistActivity>
                                        value={form.therapistActivity}
                                        onChange={(v) => update("therapistActivity", v)}
                                        options={[
                                            { value: "active", label: "Very active & directive", hint: "Questions + guidance + exercises" },
                                            { value: "balanced", label: "Balanced" },
                                            { value: "listening", label: "Mostly listening", hint: "More space to talk" },
                                        ]}
                                    />
                                </div>

                                <div>
                                    <p className="font-medium mb-2">How do you prefer to communicate?</p>
                                    <PillRadio<CommunicationStyle>
                                        value={form.communicationStyle}
                                        onChange={(v) => update("communicationStyle", v)}
                                        options={[
                                            { value: "monologue", label: "I talk more" },
                                            { value: "questions", label: "I need questions" },
                                            { value: "mix", label: "A mix of both" },
                                        ]}
                                    />
                                </div>

                                <div className="border-t pt-5">
                                    <p className="font-medium mb-2">What should we avoid? (optional)</p>
                                    <CheckboxGrid
                                        items={DEALBREAKERS}
                                        selected={form.dealbreakers}
                                        onToggle={(i) => toggleInArray("dealbreakers", i)}
                                    />
                                </div>
                            </div>
                        </Section>
                    )}

                    {step === 4 && (
                        <Section title="Goals & expectations" subtitle="Optional, but it helps us personalize your match.">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">
                                        What would you like to change or improve? (1–3 sentences)
                                    </label>
                                    <textarea
                                        className="mt-1 w-full border rounded-lg p-2 min-h-[110px]"
                                        placeholder="e.g. I want to manage anxiety at work and stop overthinking..."
                                        value={form.goalsText}
                                        onChange={(e) => update("goalsText", e.target.value)}
                                    />
                                </div>

                                <div className="flex items-start gap-2">
                                    <input
                                        type="checkbox"
                                        checked={form.consentData}
                                        onChange={(e) => update("consentData", e.target.checked)}
                                        className="mt-1 h-4 w-4"
                                    />
                                    <p className="text-sm text-gray-700">
                                        I agree that my answers can be used for matching and improving recommendations.
                                    </p>
                                </div>
                            </div>
                        </Section>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between pt-2">
                        <button
                            type="button"
                            onClick={back}
                            disabled={step === 1 || submitting}
                            className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Back
                        </button>

                        {step < totalSteps ? (
                            <button
                                type="button"
                                onClick={next}
                                disabled={!canGoNext || submitting}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting || !form.consentData}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {submitting ? "Submitting..." : "See matches"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
