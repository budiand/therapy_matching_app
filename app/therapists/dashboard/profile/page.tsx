"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const SPECIALIZATIONS = [
    "Anxiety",
    "Depression",
    "Panic attacks",
    "Burnout",
    "Stress",
    "Relationships",
    "Family",
    "Couples",
    "Trauma",
    "Grief",
    "LGBTQ+",
    "Self-esteem",
    "Career",
    "Addictions",
    "Anger management",
    "Sleep problems",
    "ADHD",
    "Eating disorders",
    "Perfectionism",
    "Social anxiety",
] as const;

const APPROACHES = [
    "CBT",
    "ACT",
    "Psychodynamic",
    "Humanistic",
    "Schema therapy",
    "Systemic",
    "Integrative",
    "Mindfulness-based",
    "Gestalt",
    "DBT",
    "EMDR",
] as const;

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
type Pace = "slow" | "medium" | "fast";

export default function TherapistProfilePage() {
    // Basic
    const [name, setName] = useState("Dr. Alex Popescu");
    const [age, setAge] = useState<number | "">(34);
    const [email, setEmail] = useState("alex@example.com");
    const [phone, setPhone] = useState("+40 7xx xxx xxx");
    const [city, setCity] = useState("Bucharest");
    const [languages, setLanguages] = useState("Romanian, English");
    const [gender, setGender] = useState<
        "female" | "male" | "non_binary" | "other" | "prefer_not_to_say"
    >("prefer_not_to_say");

    // Practice
    const [therapistType, setTherapistType] =
        useState<TherapistType>("psychotherapist");
    const [yearsOfExperience, setYearsOfExperience] = useState<number | "">(6);
    const [online, setOnline] = useState(true);
    const [acceptsOnlineOnly, setAcceptsOnlineOnly] = useState(false);
    const [priceRange, setPriceRange] = useState("40–60 EUR");
    const [description, setDescription] = useState(
        "I help people navigate anxiety, burnout, and relationship challenges using evidence-based tools and a warm, structured approach."
    );

    // Specializations / approaches
    const [specializations, setSpecializations] = useState<string[]>([
        "Anxiety",
        "Burnout",
        "Relationships",
    ]);
    const [approaches, setApproaches] = useState<string[]>(["CBT", "ACT"]);

    // Matching style
    const [sessionStructure, setSessionStructure] =
        useState<SessionStructure>("structured");
    const [therapistActivity, setTherapistActivity] =
        useState<TherapistActivity>("balanced");
    const [communicationStyle, setCommunicationStyle] =
        useState<CommunicationStyle>("mix");
    const [guidanceStyle, setGuidanceStyle] =
        useState<GuidanceStyle>("mix");
    const [focusStyle, setFocusStyle] = useState<FocusStyle>("mix");
    const [givesHomework, setGivesHomework] = useState(true);
    const [offersStructuredPrograms, setOffersStructuredPrograms] =
        useState(true);
    const [worksWithHabits, setWorksWithHabits] = useState(false);

    const [directness, setDirectness] = useState(6); // 0-10
    const [warmth, setWarmth] = useState(7); // 0-10
    const [pace, setPace] = useState<Pace>("medium");

    // Credentials uploads (UI only)
    const [primaryCredential, setPrimaryCredential] = useState<File | null>(null);
    const [certificates, setCertificates] = useState<File[]>([]);

    const canSave = useMemo(() => {
        return (
            name.trim().length > 1 &&
            city.trim().length > 0 &&
            typeof age !== "string" &&
            typeof yearsOfExperience !== "string"
        );
    }, [name, city, age, yearsOfExperience]);

    function toggleItem(list: string[], item: string) {
        return list.includes(item)
            ? list.filter((x) => x !== item)
            : [...list, item];
    }

    async function onSave() {
        // TODO: connect to your API later
        alert(
            "Saved (UI only). Next step: connect this form to your API and database."
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Profile</h1>
                        <p className="text-gray-600 mt-1">
                            Keep your profile accurate so clients can match with you faster.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/therapists/dashboard"
                            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                        >
                            Back
                        </Link>

                        <button
                            onClick={onSave}
                            disabled={!canSave}
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
                        >
                            Save changes
                        </button>
                    </div>
                </div>

                {/* Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Main form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic info */}
                        <Card title="Basic information" subtitle="Visible to clients">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Full name">
                                    <input
                                        className="input"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your full name"
                                    />
                                </Field>

                                <Field label="Age">
                                    <input
                                        className="input"
                                        type="number"
                                        min={18}
                                        max={100}
                                        value={age}
                                        onChange={(e) =>
                                            setAge(e.target.value === "" ? "" : Number(e.target.value))
                                        }
                                        placeholder="e.g. 34"
                                    />
                                </Field>

                                <Field label="Email">
                                    <input
                                        className="input"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                    />
                                </Field>

                                <Field label="Phone">
                                    <input
                                        className="input"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+40..."
                                    />
                                </Field>

                                <Field label="City">
                                    <input
                                        className="input"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="Bucharest"
                                    />
                                </Field>

                                <Field label="Languages (comma-separated)">
                                    <input
                                        className="input"
                                        value={languages}
                                        onChange={(e) => setLanguages(e.target.value)}
                                        placeholder="Romanian, English"
                                    />
                                </Field>

                                <Field label="Gender">
                                    <select
                                        className="input"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value as any)}
                                    >
                                        <option value="prefer_not_to_say">Prefer not to say</option>
                                        <option value="female">Female</option>
                                        <option value="male">Male</option>
                                        <option value="non_binary">Non-binary</option>
                                        <option value="other">Other</option>
                                    </select>
                                </Field>
                            </div>
                        </Card>

                        {/* Practice */}
                        <Card
                            title="Practice details"
                            subtitle="Where and how you work with clients"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Therapist type">
                                    <select
                                        className="input"
                                        value={therapistType}
                                        onChange={(e) => setTherapistType(e.target.value as any)}
                                    >
                                        <option value="clinical_psychologist">
                                            Clinical psychologist
                                        </option>
                                        <option value="psychotherapist">Psychotherapist</option>
                                        <option value="counselor">Counselor</option>
                                        <option value="psychiatrist">Psychiatrist</option>
                                        <option value="trainee_supervised">
                                            Trainee (supervised)
                                        </option>
                                        <option value="other">Other</option>
                                    </select>
                                </Field>

                                <Field label="Years of experience">
                                    <input
                                        className="input"
                                        type="number"
                                        min={0}
                                        max={60}
                                        value={yearsOfExperience}
                                        onChange={(e) =>
                                            setYearsOfExperience(
                                                e.target.value === "" ? "" : Number(e.target.value)
                                            )
                                        }
                                        placeholder="e.g. 6"
                                    />
                                </Field>

                                <Field label="Price range">
                                    <input
                                        className="input"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                        placeholder="e.g. 40–60 EUR"
                                    />
                                </Field>

                                <Field label="Session format">
                                    <div className="flex items-center gap-3">
                                        <Toggle
                                            checked={online}
                                            onChange={setOnline}
                                            label="Online sessions"
                                        />
                                        <Toggle
                                            checked={acceptsOnlineOnly}
                                            onChange={setAcceptsOnlineOnly}
                                            label="Online-only"
                                        />
                                    </div>
                                </Field>

                                <Field label="About you" className="md:col-span-2">
                  <textarea
                      className="input min-h-[120px]"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your approach and who you work best with."
                  />
                                </Field>
                            </div>
                        </Card>

                        {/* Specializations */}
                        <Card
                            title="Specializations"
                            subtitle="Topics you work with most often"
                        >
                            <div className="flex flex-wrap gap-2">
                                {SPECIALIZATIONS.map((s) => (
                                    <Chip
                                        key={s}
                                        active={specializations.includes(s)}
                                        onClick={() =>
                                            setSpecializations((prev) => toggleItem(prev, s))
                                        }
                                        label={s}
                                    />
                                ))}
                            </div>
                        </Card>

                        {/* Approaches */}
                        <Card
                            title="Therapy approaches"
                            subtitle="Methods you specialize in"
                        >
                            <div className="flex flex-wrap gap-2">
                                {APPROACHES.map((a) => (
                                    <Chip
                                        key={a}
                                        active={approaches.includes(a)}
                                        onClick={() => setApproaches((prev) => toggleItem(prev, a))}
                                        label={a}
                                    />
                                ))}
                            </div>
                        </Card>

                        {/* Matching style */}
                        <Card
                            title="Matching style"
                            subtitle="These details help clients find a better fit"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Session structure">
                                    <select
                                        className="input"
                                        value={sessionStructure}
                                        onChange={(e) => setSessionStructure(e.target.value as any)}
                                    >
                                        <option value="structured">Structured</option>
                                        <option value="semi">Semi-structured</option>
                                        <option value="free">Free / open</option>
                                    </select>
                                </Field>

                                <Field label="Therapist activity">
                                    <select
                                        className="input"
                                        value={therapistActivity}
                                        onChange={(e) => setTherapistActivity(e.target.value as any)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="balanced">Balanced</option>
                                        <option value="listening">Mostly listening</option>
                                    </select>
                                </Field>

                                <Field label="Communication style">
                                    <select
                                        className="input"
                                        value={communicationStyle}
                                        onChange={(e) => setCommunicationStyle(e.target.value as any)}
                                    >
                                        <option value="questions">Mostly questions</option>
                                        <option value="monologue">Mostly therapist talks</option>
                                        <option value="mix">Mix</option>
                                    </select>
                                </Field>

                                <Field label="Guidance style">
                                    <select
                                        className="input"
                                        value={guidanceStyle}
                                        onChange={(e) => setGuidanceStyle(e.target.value as any)}
                                    >
                                        <option value="autonomous">Client-led</option>
                                        <option value="need_push">Needs a push</option>
                                        <option value="mix">Mix</option>
                                    </select>
                                </Field>

                                <Field label="Focus style">
                                    <select
                                        className="input"
                                        value={focusStyle}
                                        onChange={(e) => setFocusStyle(e.target.value as any)}
                                    >
                                        <option value="thoughts">Thoughts</option>
                                        <option value="emotions">Emotions</option>
                                        <option value="mix">Mix</option>
                                    </select>
                                </Field>

                                <Field label="Pace">
                                    <select
                                        className="input"
                                        value={pace}
                                        onChange={(e) => setPace(e.target.value as any)}
                                    >
                                        <option value="slow">Slow</option>
                                        <option value="medium">Medium</option>
                                        <option value="fast">Fast</option>
                                    </select>
                                </Field>

                                <Field label={`Directness: ${directness}/10`}>
                                    <input
                                        type="range"
                                        min={0}
                                        max={10}
                                        value={directness}
                                        onChange={(e) => setDirectness(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </Field>

                                <Field label={`Warmth: ${warmth}/10`}>
                                    <input
                                        type="range"
                                        min={0}
                                        max={10}
                                        value={warmth}
                                        onChange={(e) => setWarmth(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </Field>

                                <Field label="Extra options" className="md:col-span-2">
                                    <div className="flex flex-wrap gap-3">
                                        <Toggle
                                            checked={givesHomework}
                                            onChange={setGivesHomework}
                                            label="Gives homework"
                                        />
                                        <Toggle
                                            checked={offersStructuredPrograms}
                                            onChange={setOffersStructuredPrograms}
                                            label="Structured programs"
                                        />
                                        <Toggle
                                            checked={worksWithHabits}
                                            onChange={setWorksWithHabits}
                                            label="Works with habits"
                                        />
                                    </div>
                                </Field>
                            </div>
                        </Card>
                    </div>

                    {/* Right: Credentials */}
                    <div className="space-y-6">
                        <Card
                            title="Credentials"
                            subtitle="Upload license and relevant certificates"
                        >
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium">Primary license / attestation</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Recommended: PDF or image (jpg/png). This helps verification.
                                    </p>
                                    <input
                                        className="mt-2 block w-full text-sm"
                                        type="file"
                                        accept=".pdf,.png,.jpg,.jpeg"
                                        onChange={(e) =>
                                            setPrimaryCredential(e.target.files?.[0] ?? null)
                                        }
                                    />
                                    {primaryCredential && (
                                        <p className="text-xs text-gray-600 mt-2">
                                            Selected: <span className="font-medium">{primaryCredential.name}</span>
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-sm font-medium">Approach certificates (optional)</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Upload certificates for CBT/ACT/etc. (multiple files allowed).
                                    </p>
                                    <input
                                        className="mt-2 block w-full text-sm"
                                        type="file"
                                        multiple
                                        accept=".pdf,.png,.jpg,.jpeg"
                                        onChange={(e) =>
                                            setCertificates(Array.from(e.target.files ?? []))
                                        }
                                    />
                                    {certificates.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {certificates.map((f) => (
                                                <p key={f.name} className="text-xs text-gray-600">
                                                    • {f.name}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-xl border bg-gray-50 p-3 text-sm text-gray-700">
                                    <p className="font-medium">Verification status</p>
                                    <p className="text-gray-600 mt-1">
                                        Your profile can be reviewed after you upload a primary credential.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card title="Preview" subtitle="How clients may see you">
                            <div className="rounded-2xl border bg-white p-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                        {name
                                            .split(" ")
                                            .slice(0, 2)
                                            .map((s) => s[0]?.toUpperCase())
                                            .join("") || "T"}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{name}</p>
                                        <p className="text-sm text-gray-600">
                                            {city} · {online ? "Online" : "In person"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <MiniTag label={therapistTypeLabel(therapistType)} />
                                    <MiniTag label={`${yearsOfExperience || 0}+ yrs`} />
                                    <MiniTag label={priceRange || "Price n/a"} />
                                </div>

                                <p className="text-sm text-gray-700 mt-4 line-clamp-4">
                                    {description || "Add a short description to help clients understand your style."}
                                </p>

                                <div className="mt-4">
                                    <p className="text-xs font-semibold text-gray-500">Top specializations</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {(specializations.slice(0, 4).length ? specializations.slice(0, 4) : ["—"]).map((s) => (
                                            <MiniTag key={s} label={s} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <p className="text-xs text-gray-500 mt-6">
                    Next step: connect “Save changes” to your API and persist data in MongoDB.
                </p>
            </div>

            {/* Small styling helper for inputs */}
            <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid rgb(229 231 235);
          border-radius: 0.75rem;
          padding: 0.6rem 0.8rem;
          background: white;
          outline: none;
        }
        .input:focus {
          border-color: rgb(99 102 241);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }
      `}</style>
        </div>
    );
}

/* ---------------- UI Components ---------------- */

function Card({
                  title,
                  subtitle,
                  children,
              }: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-2xl border shadow-sm p-5 md:p-6">
            <div className="mb-4">
                <h2 className="text-lg font-semibold">{title}</h2>
                {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}

function Field({
                   label,
                   children,
                   className,
               }: {
    label: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={className}>
            <label className="text-sm font-medium">{label}</label>
            <div className="mt-1">{children}</div>
        </div>
    );
}

function Chip({
                  label,
                  active,
                  onClick,
              }: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "px-3 py-1.5 rounded-full border text-sm transition",
                active
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white hover:bg-gray-50",
            ].join(" ")}
        >
            {label}
        </button>
    );
}

function Toggle({
                    checked,
                    onChange,
                    label,
                }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={[
                "px-3 py-2 rounded-xl border text-sm transition",
                checked ? "bg-indigo-50 border-indigo-200 text-indigo-900" : "bg-white hover:bg-gray-50",
            ].join(" ")}
            aria-pressed={checked}
        >
            {label}
        </button>
    );
}

function MiniTag({ label }: { label: string }) {
    return (
        <span className="text-xs px-2 py-1 rounded-full border bg-gray-50 text-gray-700">
      {label}
    </span>
    );
}

function therapistTypeLabel(t: TherapistType) {
    const map: Record<TherapistType, string> = {
        clinical_psychologist: "Clinical psychologist",
        psychotherapist: "Psychotherapist",
        counselor: "Counselor",
        psychiatrist: "Psychiatrist",
        trainee_supervised: "Trainee (supervised)",
        other: "Other",
    };
    return map[t];
}
