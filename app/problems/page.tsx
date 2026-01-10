"use client";

import { useRouter } from "next/navigation";

type Topic = {
    id: string;
    title: string;
    short: string;

    whatItFeelsLike: string[];
    commonSymptoms: string[];
    howLongIsTooLong: string;
    whatHelpsInTherapy: string[];
    whenToGetUrgentHelp?: string[];

    subSections?: Array<{
        title: string;
        bullets: string[];
    }>;
};

const TOPICS: Topic[] = [
    {
        id: "anxiety",
        title: "Anxiety",
        short:
            "Persistent worry, tension, or fear that’s hard to control and starts affecting daily life.",
        whatItFeelsLike: [
            "Your mind jumps to worst-case scenarios",
            "You feel on edge or tense most of the time",
            "You avoid situations because they feel unsafe",
        ],
        commonSymptoms: [
            "Racing thoughts, excessive worrying",
            "Restlessness, irritability",
            "Trouble sleeping (hard to fall asleep or stay asleep)",
            "Physical symptoms: tight chest, nausea, fast heartbeat, sweating",
            "Difficulty concentrating",
            "Avoidance (social events, travel, work tasks, medical checks, etc.)",
        ],
        howLongIsTooLong:
            "If it lasts most days for 2+ weeks and impacts work, school, relationships, sleep, or health — it’s worth addressing.",
        whatHelpsInTherapy: [
            "Understanding triggers and anxiety cycles",
            "Tools for calming the body (breathing, grounding)",
            "Changing fear-based thinking patterns",
            "Gradual exposure to reduce avoidance",
            "Building tolerance for uncertainty",
        ],
        whenToGetUrgentHelp: [
            "Panic attacks with chest pain (rule out medical causes)",
            "You can’t function day-to-day",
            "Thoughts of self-harm or suicide",
        ],
    },
    {
        id: "depression",
        title: "Depression",
        short:
            "Low mood or loss of interest that lasts and makes everyday tasks feel heavy or pointless.",
        whatItFeelsLike: [
            "Nothing feels enjoyable",
            "You feel tired even after sleep",
            "You feel numb, hopeless, or stuck",
        ],
        commonSymptoms: [
            "Persistent sadness or emptiness",
            "Loss of interest or pleasure",
            "Low energy or fatigue",
            "Sleep or appetite changes",
            "Guilt or self-criticism",
            "Difficulty concentrating",
            "Withdrawing from people",
        ],
        howLongIsTooLong:
            "If symptoms are present most days for 2+ weeks or keep returning.",
        whatHelpsInTherapy: [
            "Behavioral activation",
            "Working with negative self-talk",
            "Processing loss, burnout, or trauma",
            "Rebuilding meaning and motivation",
        ],
        whenToGetUrgentHelp: [
            "Thoughts of suicide or self-harm",
            "You can’t care for basic needs",
        ],
    },
    {
        id: "panic",
        title: "Panic attacks",
        short:
            "Sudden intense fear with strong physical symptoms, often mistaken for a medical emergency.",
        whatItFeelsLike: [
            "Sudden wave of terror",
            "Fear of dying or losing control",
            "Avoiding places where attacks happened",
        ],
        commonSymptoms: [
            "Fast heartbeat, chest tightness",
            "Shortness of breath, dizziness",
            "Sweating, nausea, shaking",
            "Fear of dying or going crazy",
        ],
        howLongIsTooLong:
            "If panic attacks repeat or you avoid life because of them.",
        whatHelpsInTherapy: [
            "Understanding panic physiology",
            "Reducing fear of bodily sensations",
            "Exposure-based techniques",
            "Breaking avoidance patterns",
        ],
        whenToGetUrgentHelp: [
            "First-time chest pain",
            "Feeling unsafe or suicidal",
        ],
    },
    {
        id: "lgbtq",
        title: "LGBTQ+ support",
        short:
            "Support for identity, relationships, minority stress, and internalized shame.",
        whatItFeelsLike: [
            "Fear of rejection",
            "Pressure to hide yourself",
            "Chronic stress from invalidation",
        ],
        commonSymptoms: [
            "Anxiety around identity",
            "Shame or self-criticism",
            "Relationship difficulties",
            "Loneliness or distrust",
        ],
        howLongIsTooLong:
            "If identity-related stress affects wellbeing for weeks or months.",
        whatHelpsInTherapy: [
            "Affirming, non-judgmental space",
            "Working with shame and fear",
            "Boundary setting",
            "Building self-trust",
        ],
        subSections: [
            {
                title: "Common topics",
                bullets: [
                    "Coming out and safety",
                    "Family or cultural pressure",
                    "Self-acceptance",
                    "Dating and attachment",
                    "Trauma from rejection",
                ],
            },
        ],
        whenToGetUrgentHelp: [
            "Risk of violence or homelessness",
            "Suicidal thoughts",
        ],
    },
    {
        id: "eating-disorders",
        title: "Eating disorders & body image",
        short:
            "Struggles with food, weight, and control that affect health and self-worth.",
        whatItFeelsLike: [
            "Food dominates your thoughts",
            "Eating triggers guilt or fear",
            "Body image controls mood",
        ],
        commonSymptoms: [
            "Restriction, bingeing, purging",
            "Fear of weight gain",
            "Rigid food rules",
            "Avoiding eating with others",
        ],
        howLongIsTooLong:
            "If behaviors repeat weekly or daily, early support is strongly recommended.",
        whatHelpsInTherapy: [
            "Reducing shame",
            "Emotion regulation skills",
            "Body image work",
            "Coordinated medical care if needed",
        ],
        whenToGetUrgentHelp: [
            "Fainting or chest pain",
            "Severe restriction or vomiting",
            "Self-harm thoughts",
        ],
    },
    {
        id: "burnout",
        title: "Burnout & chronic stress",
        short:
            "Long-term stress leading to exhaustion, detachment, and reduced effectiveness.",
        whatItFeelsLike: [
            "Constant exhaustion",
            "Detachment or numbness",
            "Tasks feel overwhelming",
        ],
        commonSymptoms: [
            "Chronic fatigue",
            "Irritability or anxiety",
            "Poor concentration",
            "Sleep problems",
        ],
        howLongIsTooLong:
            "If stress lasts for weeks and impacts health or performance.",
        whatHelpsInTherapy: [
            "Stress regulation",
            "Boundary setting",
            "Working with perfectionism",
            "Values-based planning",
        ],
    },
];

export default function ProblemsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50">
            <div id="top" />

            <div className="max-w-6xl mx-auto px-4 py-10">
                <header className="flex flex-col lg:flex-row justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold">
                            What problems do we help with?
                        </h1>
                        <p className="text-gray-600 mt-2 max-w-3xl">
                            Educational content — not a diagnosis.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => router.push("/therapy-types")}
                            className="bg-white border rounded-2xl p-5 text-left hover:shadow-sm"
                        >
                            <div className="text-lg font-semibold">
                                Type of Therapy
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                                Learn about CBT, ACT, Psychodynamic and more.
                            </div>
                        </button>

                        <button
                            onClick={() => router.push("/onboarding")}
                            className="bg-indigo-600 text-white rounded-2xl p-5 text-left hover:bg-indigo-700"
                        >
                            <div className="text-lg font-semibold">
                                Find a match
                            </div>
                            <div className="text-sm text-indigo-100 mt-1">
                                Get matched with a therapist.
                            </div>
                        </button>
                    </div>
                </header>

                {/* QUICK NAV */}
                <div className="mt-8 bg-white border rounded-2xl p-5">
                    <div className="text-sm font-semibold">Browse topics</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {TOPICS.map((t) => (
                            <a
                                key={t.id}
                                href={`#${t.id}`}
                                className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm"
                            >
                                {t.title}
                            </a>
                        ))}
                    </div>
                </div>

                {/* TOPICS */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {TOPICS.map((t) => (
                        <section
                            key={t.id}
                            id={t.id}
                            className="bg-white border rounded-2xl p-6 scroll-mt-24"
                        >
                            <div className="flex justify-between">
                                <h2 className="text-xl font-semibold">
                                    {t.title}
                                </h2>
                                <a
                                    href="#top"
                                    className="text-sm text-indigo-700 hover:underline"
                                >
                                    Back to top
                                </a>
                            </div>

                            <p className="text-gray-600 mt-1">{t.short}</p>

                            <ul className="list-disc pl-5 mt-4 text-sm text-gray-700 space-y-1">
                                {t.whatItFeelsLike.map((x, i) => (
                                    <li key={i}>{x}</li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
