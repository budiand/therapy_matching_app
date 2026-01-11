"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const SPECIALIZATIONS = [
    // Emotional health
    "Anxiety",
    "Depression",
    "Panic attacks",
    "Burnout",
    "Stress",
    "Sleep problems",
    "Emotional regulation",
    "Overthinking / rumination",
    "Perfectionism",
    "Trauma",
    "Grief",

    // Relationships
    "Relationships",
    "Family",
    "Couples",
    "Communication issues",
    "Attachment / fear of abandonment",
    "Conflict & boundaries",
    "Social difficulties",
    "Social anxiety",

    // Identity & personal life
    "Self-esteem",
    "LGBTQ+",
    "Gender identity",
    "Meaning & life direction",
    "Self-exploration",

    // Professional life
    "Career",
    "Performance",
    "Major decisions",
    "Work-life balance",

    // Behaviors
    "Procrastination",
    "Habits I want to change",
    "Addictions",
    "Anger management",

    // Clinical topics
    "ADHD",
    "Eating disorders",
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

type Gender = "female" | "male" | "non_binary" | "other" | "prefer_not_to_say";

type TherapistMe = {
    _id: string;
    email: string;
    name: string;
    phone?: string;
    city: string;
    online?: boolean;

    age?: number;
    gender?: Gender;
    languages?: string[];

    therapistType: TherapistType;
    yearsOfExperience?: number;
    acceptsOnlineOnly?: boolean;
    priceRange?: string;
    description?: string;

    specializations?: string[];
    approaches?: string[];

    sessionStructure: SessionStructure;
    therapistActivity: TherapistActivity;
    communicationStyle: CommunicationStyle;
    guidanceStyle: GuidanceStyle;
    focusStyle: FocusStyle;

    givesHomework?: boolean;
    offersStructuredPrograms?: boolean;
    worksWithHabits?: boolean;

    directness?: number; // 0-10
    warmth?: number; // 0-10
    pace?: Pace;
};

function normalizeArrayStrings(input: unknown): string[] {
    if (Array.isArray(input)) return input.map(String);
    if (typeof input === "string") {
        // allow "Romanian, English"
        return input
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    return [];
}

function toggleItem(list: string[], item: string) {
    return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export default function TherapistProfilePage() {
    // page state
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Basic info
    const [name, setName] = useState("");
    const [age, setAge] = useState<number | "">("");
    const [email, setEmail] = useState(""); // readonly-ish
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [languages, setLanguages] = useState(""); // comma separated UI
    const [gender, setGender] = useState<Gender>("prefer_not_to_say");

    // Practice
    const [therapistType, setTherapistType] = useState<TherapistType>("psychotherapist");
    const [yearsOfExperience, setYearsOfExperience] = useState<number | "">("");
    const [online, setOnline] = useState(false);
    const [acceptsOnlineOnly, setAcceptsOnlineOnly] = useState(false);
    const [priceRange, setPriceRange] = useState("");
    const [description, setDescription] = useState("");

    // Specializations / approaches
    const [specializations, setSpecializations] = useState<string[]>([]);
    const [approaches, setApproaches] = useState<string[]>([]);

    // Matching style
    const [sessionStructure, setSessionStructure] = useState<SessionStructure>("semi");
    const [therapistActivity, setTherapistActivity] = useState<TherapistActivity>("balanced");
    const [communicationStyle, setCommunicationStyle] = useState<CommunicationStyle>("mix");
    const [guidanceStyle, setGuidanceStyle] = useState<GuidanceStyle>("mix");
    const [focusStyle, setFocusStyle] = useState<FocusStyle>("mix");

    const [givesHomework, setGivesHomework] = useState(false);
    const [offersStructuredPrograms, setOffersStructuredPrograms] = useState(false);
    const [worksWithHabits, setWorksWithHabits] = useState(false);

    const [directness, setDirectness] = useState(5);
    const [warmth, setWarmth] = useState(6);
    const [pace, setPace] = useState<Pace>("medium");

    // Credentials uploads (UI only for now)
    const [primaryCredential, setPrimaryCredential] = useState<File | null>(null);
    const [certificates, setCertificates] = useState<File[]>([]);

    // Load current therapist ("me")
    useEffect(() => {
        async function load() {
            setLoading(true);
            setError("");
            setSuccess("");

            try {
                const res = await fetch("/api/therapists/me", { method: "GET" });
                const data = await res.json().catch(() => null);

                if (!res.ok) {
                    throw new Error(data?.error || data?.message || `Failed to load profile (${res.status}).`);
                }

                const t: TherapistMe = data.therapist;

                // Populate state from DB
                setName(t.name || "");
                setEmail(t.email || "");
                setPhone(t.phone || "");
                setCity(t.city || "");
                setOnline(Boolean(t.online));

                setAge(typeof t.age === "number" ? t.age : "");
                setGender((t.gender as Gender) || "prefer_not_to_say");
                setLanguages((t.languages || []).join(", "));

                setTherapistType((t.therapistType as TherapistType) || "psychotherapist");
                setYearsOfExperience(typeof t.yearsOfExperience === "number" ? t.yearsOfExperience : "");
                setAcceptsOnlineOnly(Boolean(t.acceptsOnlineOnly));
                setPriceRange(t.priceRange || "");
                setDescription(t.description || "");

                setSpecializations(normalizeArrayStrings(t.specializations));
                setApproaches(normalizeArrayStrings(t.approaches));

                setSessionStructure((t.sessionStructure as SessionStructure) || "semi");
                setTherapistActivity((t.therapistActivity as TherapistActivity) || "balanced");
                setCommunicationStyle((t.communicationStyle as CommunicationStyle) || "mix");
                setGuidanceStyle((t.guidanceStyle as GuidanceStyle) || "mix");
                setFocusStyle((t.focusStyle as FocusStyle) || "mix");

                setGivesHomework(Boolean(t.givesHomework));
                setOffersStructuredPrograms(Boolean(t.offersStructuredPrograms));
                setWorksWithHabits(Boolean(t.worksWithHabits));

                setDirectness(typeof t.directness === "number" ? t.directness : 5);
                setWarmth(typeof t.warmth === "number" ? t.warmth : 6);
                setPace((t.pace as Pace) || "medium");
            } catch (e: any) {
                setError(e?.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    const canSave = useMemo(() => {
        const okName = name.trim().length > 1;
        const okCity = city.trim().length > 0;
        const okAge = age === "" || (typeof age === "number" && age >= 18 && age <= 100);
        const okYoE = yearsOfExperience === "" || (typeof yearsOfExperience === "number" && yearsOfExperience >= 0);
        return okName && okCity && okAge && okYoE;
    }, [name, city, age, yearsOfExperience]);

    async function onSave() {
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const payload = {
                name: name.trim(),
                phone: phone.trim(),
                city: city.trim(),
                online: Boolean(online),

                age: age === "" ? null : age,
                gender,
                languages: normalizeArrayStrings(languages),

                therapistType,
                yearsOfExperience: yearsOfExperience === "" ? null : yearsOfExperience,
                acceptsOnlineOnly: Boolean(acceptsOnlineOnly),
                priceRange: priceRange.trim(),
                description: description.trim(),

                specializations,
                approaches,

                sessionStructure,
                therapistActivity,
                communicationStyle,
                guidanceStyle,
                focusStyle,

                givesHomework: Boolean(givesHomework),
                offersStructuredPrograms: Boolean(offersStructuredPrograms),
                worksWithHabits: Boolean(worksWithHabits),

                directness,
                warmth,
                pace,
            };

            const res = await fetch("/api/therapists/me", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.error || data?.message || `Save failed (${res.status}).`);
            }

            setSuccess("Saved successfully.");
            // Optional: you can refresh state from returned therapist
            // const t: TherapistMe = data.therapist;
        } catch (e: any) {
            setError(e?.message || "Save failed.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="p-6 text-sm text-gray-600">Loading profile…</div>;
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="max-w-3xl bg-white border rounded-2xl p-6">
                    <h1 className="text-xl font-bold">Profile</h1>
                    <p className="text-red-700 mt-3">{error}</p>
                    <p className="text-sm text-gray-600 mt-2">
                        If you’re not logged in, go to{" "}
                        <Link className="text-indigo-700 underline" href="/therapists/auth/sign-in">
                            therapist sign in
                        </Link>.
                    </p>
                </div>
            </div>
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
                        {email && (
                            <p className="text-xs text-gray-500 mt-2">
                                Logged in as <span className="font-medium">{email}</span>
                            </p>
                        )}
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
                            disabled={!canSave || saving}
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {saving ? "Saving…" : "Save changes"}
                        </button>
                    </div>
                </div>

                {success && (
                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                        {success}
                    </div>
                )}

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
                                        onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                                        placeholder="e.g. 34"
                                    />
                                </Field>

                                <Field label="Email (account)">
                                    <input className="input bg-gray-50" type="email" value={email} readOnly />
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
                                        onChange={(e) => setGender(e.target.value as Gender)}
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
                        <Card title="Practice details" subtitle="Where and how you work with clients">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Therapist type">
                                    <select
                                        className="input"
                                        value={therapistType}
                                        onChange={(e) => setTherapistType(e.target.value as TherapistType)}
                                    >
                                        <option value="clinical_psychologist">Clinical psychologist</option>
                                        <option value="psychotherapist">Psychotherapist</option>
                                        <option value="counselor">Counselor</option>
                                        <option value="psychiatrist">Psychiatrist</option>
                                        <option value="trainee_supervised">Trainee (supervised)</option>
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
                                            setYearsOfExperience(e.target.value === "" ? "" : Number(e.target.value))
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
                                        <Toggle checked={online} onChange={setOnline} label="Online sessions" />
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
                        <Card title="Specializations" subtitle="Topics you work with most often">
                            <div className="flex flex-wrap gap-2">
                                {SPECIALIZATIONS.map((s) => (
                                    <Chip
                                        key={s}
                                        active={specializations.includes(s)}
                                        onClick={() => setSpecializations((prev) => toggleItem(prev, s))}
                                        label={s}
                                    />
                                ))}
                            </div>
                        </Card>

                        {/* Approaches */}
                        <Card title="Therapy approaches" subtitle="Methods you specialize in">
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
                        <Card title="Matching style" subtitle="These details help clients find a better fit">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Session structure">
                                    <select
                                        className="input"
                                        value={sessionStructure}
                                        onChange={(e) => setSessionStructure(e.target.value as SessionStructure)}
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
                                        onChange={(e) => setTherapistActivity(e.target.value as TherapistActivity)}
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
                                        onChange={(e) => setCommunicationStyle(e.target.value as CommunicationStyle)}
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
                                        onChange={(e) => setGuidanceStyle(e.target.value as GuidanceStyle)}
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
                                        onChange={(e) => setFocusStyle(e.target.value as FocusStyle)}
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
                                        onChange={(e) => setPace(e.target.value as Pace)}
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
                                        <Toggle checked={givesHomework} onChange={setGivesHomework} label="Gives homework" />
                                        <Toggle
                                            checked={offersStructuredPrograms}
                                            onChange={setOffersStructuredPrograms}
                                            label="Structured programs"
                                        />
                                        <Toggle checked={worksWithHabits} onChange={setWorksWithHabits} label="Works with habits" />
                                    </div>
                                </Field>
                            </div>
                        </Card>
                    </div>

                    {/* Right: Credentials */}
                    <div className="space-y-6">
                        <Card title="Credentials" subtitle="Upload license and relevant certificates">
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
                                        onChange={(e) => setPrimaryCredential(e.target.files?.[0] ?? null)}
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
                                        onChange={(e) => setCertificates(Array.from(e.target.files ?? []))}
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
                                    <p className="font-medium">Note</p>
                                    <p className="text-gray-600 mt-1">
                                        Uploads are UI-only for now. To store them, you’ll later add a file storage (S3/Cloudinary).
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
                                        <p className="font-semibold">{name || "Your name"}</p>
                                        <p className="text-sm text-gray-600">
                                            {city || "City"} · {online ? "Online" : "In person"}
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
            </div>

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
                active ? "bg-indigo-600 text-white border-indigo-600" : "bg-white hover:bg-gray-50",
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
    return <span className="text-xs px-2 py-1 rounded-full border bg-gray-50 text-gray-700">{label}</span>;
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
