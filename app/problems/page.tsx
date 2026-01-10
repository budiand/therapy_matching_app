import Link from "next/link";

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
            "You feel “on edge” or tense most of the time",
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
            "If it lasts most days for 2+ weeks and impacts work, school, relationships, sleep, or health — it’s worth addressing. If it’s ongoing for months, therapy can help a lot.",
        whatHelpsInTherapy: [
            "Understanding triggers + your anxiety cycle",
            "Tools for calming the body (breathing, grounding, nervous system regulation)",
            "Changing fear-based thinking patterns",
            "Gradual exposure (reducing avoidance safely)",
            "Building confidence and tolerance for uncertainty",
        ],
        whenToGetUrgentHelp: [
            "Panic attacks that feel unmanageable or include chest pain (rule out medical causes)",
            "You can’t function (can’t leave home, eat, sleep, work)",
            "You have thoughts of self-harm or suicide",
        ],
    },
    {
        id: "depression",
        title: "Depression",
        short:
            "Low mood or loss of interest that lasts and makes everyday tasks feel heavy or pointless.",
        whatItFeelsLike: [
            "Nothing feels enjoyable (even things you used to like)",
            "You feel tired even after sleep",
            "You feel numb, hopeless, or “stuck”",
        ],
        commonSymptoms: [
            "Persistent sadness or emptiness",
            "Loss of interest/pleasure",
            "Low energy, fatigue, moving/speaking slower (or agitation)",
            "Sleep changes (too little or too much)",
            "Appetite/weight changes",
            "Guilt, self-criticism, feeling “not good enough”",
            "Difficulty concentrating, indecisiveness",
            "Withdrawing from people",
        ],
        howLongIsTooLong:
            "If symptoms are present most days for 2+ weeks, or come back repeatedly, therapy is recommended. If it’s worsening over time — don’t wait.",
        whatHelpsInTherapy: [
            "Breaking the “shut down” cycle (small steps, routine, behavioral activation)",
            "Working with negative self-talk and shame",
            "Processing loss, stress, burnout, trauma or relational pain underneath",
            "Rebuilding meaning, motivation, and support",
            "Sometimes: referral for psychiatric evaluation if needed",
        ],
        whenToGetUrgentHelp: [
            "Thoughts of suicide or self-harm (even if you wouldn’t act on them)",
            "You can’t take care of basic needs (eat, hydrate, hygiene, safety)",
            "Severe insomnia for many nights in a row",
        ],
    },
    {
        id: "panic",
        title: "Panic attacks",
        short:
            "Sudden intense fear with strong physical symptoms. Often feels like something catastrophic is happening.",
        whatItFeelsLike: [
            "A wave of terror comes out of nowhere (or after a trigger)",
            "You fear losing control, fainting, or dying",
            "You start avoiding places where it happened before",
        ],
        commonSymptoms: [
            "Fast heartbeat, chest tightness",
            "Shortness of breath, dizziness, shaking",
            "Sweating, nausea, tingling",
            "Fear of dying / going crazy / losing control",
            "Avoidance and “safety behaviors” (always needing exits, carrying meds, etc.)",
        ],
        howLongIsTooLong:
            "If you’ve had 2+ attacks, or you started avoiding life because of fear of the next one, therapy helps quickly.",
        whatHelpsInTherapy: [
            "Understanding panic physiology (it’s intense but not dangerous)",
            "Reducing fear of bodily sensations",
            "Exposure-based skills (interoceptive exposure)",
            "Breaking avoidance and safety behavior loops",
        ],
        whenToGetUrgentHelp: [
            "First-time chest pain / breathing issues (rule out medical causes)",
            "You feel unsafe or you’re having suicidal thoughts",
        ],
    },
    {
        id: "lgbtq",
        title: "LGBTQ+ support",
        short:
            "Therapy can help with identity, coming out, relationships, family pressure, minority stress, and internalized shame.",
        whatItFeelsLike: [
            "Fear of rejection or not being accepted",
            "Pressure to hide parts of yourself",
            "Chronic stress from discrimination or invalidation",
        ],
        commonSymptoms: [
            "Anxiety around identity or visibility",
            "Shame, self-criticism, internalized stigma",
            "Relationship stress, attachment wounds",
            "Loneliness, difficulty trusting",
            "Stress, burnout, depression from minority stress",
        ],
        howLongIsTooLong:
            "If identity-related stress affects your mood, relationships, safety, or self-worth for weeks/months — support helps. You don’t have to “wait until it’s bad.”",
        whatHelpsInTherapy: [
            "Affirming space to explore identity without judgment",
            "Working with shame, fear, and internalized messages",
            "Boundary setting with family/partners",
            "Building self-trust and secure relationships",
            "Coping with discrimination and minority stress",
        ],
        subSections: [
            {
                title: "Common topics in LGBTQ+ therapy",
                bullets: [
                    "Coming out: timing, safety, emotional preparation",
                    "Family pressure and religious/cultural conflict",
                    "Self-acceptance and reducing internalized stigma",
                    "Dating, intimacy, attachment patterns",
                    "Gender identity exploration and transition support (if relevant)",
                    "Trauma from bullying, rejection, harassment",
                ],
            },
            {
                title: "What affirming therapy looks like",
                bullets: [
                    "The therapist uses respectful language and doesn’t try to “change” you",
                    "They validate your lived experience and stressors",
                    "They focus on wellbeing, relationships, identity integration, and safety",
                ],
            },
        ],
        whenToGetUrgentHelp: [
            "If you’re in danger (violence, threats, being kicked out)",
            "If you have suicidal thoughts or self-harm urges",
        ],
    },
    {
        id: "eating-disorders",
        title: "Eating disorders & body image",
        short:
            "Struggles with food, weight, shape, and control that affect physical health, emotions, and daily life.",
        whatItFeelsLike: [
            "Food thoughts take a lot of mental space",
            "Eating feels tied to guilt, fear, or control",
            "Body image strongly impacts mood and self-worth",
        ],
        commonSymptoms: [
            "Restriction, binge eating, purging, or compulsive exercise",
            "Fear of weight gain, intense body checking",
            "Guilt/shame after eating",
            "Rigid rules about food",
            "Avoiding eating with others",
            "Mood changes connected to food/body",
        ],
        howLongIsTooLong:
            "If behaviors repeat weekly or daily, or your health is affected, don’t wait. Early support is strongly recommended.",
        whatHelpsInTherapy: [
            "Understanding the function (control, safety, emotion regulation)",
            "Reducing shame and rigid rules",
            "Skills for emotional regulation and stress tolerance",
            "Working with self-worth and body image",
            "When needed: coordinated care (nutritionist/doctor/psychiatrist)",
        ],
        subSections: [
            {
                title: "Common types (overview)",
                bullets: [
                    "**Anorexia nervosa**: restriction, fear of weight gain, distorted body perception",
                    "**Bulimia nervosa**: binge eating + compensatory behaviors (purging, laxatives, excessive exercise)",
                    "**Binge eating disorder**: recurring binge episodes without purging, often followed by shame",
                    "**ARFID**: restricted intake due to sensory issues, fear of choking/vomiting, low interest in food",
                    "**Orthorexia (not official in all manuals)**: obsession with “clean/healthy” eating causing distress/impairment",
                ],
            },
            {
                title: "When medical support is urgent",
                bullets: [
                    "Fainting, chest pain, severe weakness, dehydration",
                    "Very low intake for days, rapid weight loss, vomiting blood",
                    "Electrolyte imbalance symptoms (irregular heartbeat, severe cramps)",
                ],
            },
        ],
        whenToGetUrgentHelp: [
            "If you faint, have chest pain, severe dehydration, or vomiting/blood",
            "If you feel out of control and unsafe",
            "If self-harm or suicidal thoughts appear",
        ],
    },
    {
        id: "burnout",
        title: "Burnout & chronic stress",
        short:
            "Long-term stress that leads to exhaustion, detachment, and reduced effectiveness.",
        whatItFeelsLike: [
            "You’re exhausted and can’t “recover”",
            "Small tasks feel too big",
            "You feel detached, cynical, or numb",
        ],
        commonSymptoms: [
            "Chronic fatigue, sleep problems",
            "Irritability, anxiety, low mood",
            "Difficulty concentrating",
            "Headaches, stomach issues",
            "Feeling ineffective or “never enough”",
        ],
        howLongIsTooLong:
            "If it lasts for weeks and impacts performance, health, or relationships — therapy can help you reset patterns and boundaries.",
        whatHelpsInTherapy: [
            "Stress regulation and recovery strategies",
            "Boundary setting and workload redesign",
            "Working with perfectionism and self-criticism",
            "Values-based planning (what matters vs. what drains you)",
        ],
    },
];

function cn(...x: Array<string | false | undefined>) {
    return x.filter(Boolean).join(" ");
}

export default function ProblemsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-10">
                <header className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">What problems do we help with?</h1>
                        <p className="text-gray-600 mt-2 max-w-3xl">
                            This page is informational — not a diagnosis. If symptoms are intense,
                            last for weeks, or affect daily life, talking to a therapist can help.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href="/therapy-types"
                            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 text-sm"
                        >
                            Type of Therapy
                        </Link>
                        <Link
                            href="/onboarding"
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
                        >
                            Find a match
                        </Link>
                    </div>
                </header>

                {/* Quick navigation */}
                <div className="mt-6 bg-white border rounded-2xl p-5">
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

                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <div className="text-sm font-semibold text-amber-900">When to seek urgent help</div>
                        <p className="text-sm text-amber-900 mt-1">
                            If you have thoughts of self-harm/suicide, feel unsafe, or have severe medical symptoms,
                            seek immediate help (local emergency services, crisis line, trusted person).
                        </p>
                    </div>
                </div>

                {/* Topic cards */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {TOPICS.map((t) => (
                        <section key={t.id} id={t.id} className="bg-white border rounded-2xl p-6 scroll-mt-24">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-xl font-semibold">{t.title}</h2>
                                    <p className="text-gray-600 mt-1">{t.short}</p>
                                </div>

                                <a
                                    href="#top"
                                    className="text-sm text-indigo-700 hover:underline whitespace-nowrap"
                                >
                                    Back to top
                                </a>
                            </div>

                            <div className="mt-4">
                                <div className="text-sm font-semibold">What it can feel like</div>
                                <ul className="mt-2 space-y-1 text-sm text-gray-700 list-disc pl-5">
                                    {t.whatItFeelsLike.map((x, i) => (
                                        <li key={i}>{x}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-4">
                                <div className="text-sm font-semibold">Common symptoms</div>
                                <ul className="mt-2 space-y-1 text-sm text-gray-700 list-disc pl-5">
                                    {t.commonSymptoms.map((x, i) => (
                                        <li key={i}>{x}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-4 rounded-xl border bg-indigo-50 border-indigo-200 p-4">
                                <div className="text-sm font-semibold text-indigo-900">How long is “too long”?</div>
                                <p className="text-sm text-indigo-900 mt-1">{t.howLongIsTooLong}</p>
                            </div>

                            <div className="mt-4">
                                <div className="text-sm font-semibold">What therapy can help with</div>
                                <ul className="mt-2 space-y-1 text-sm text-gray-700 list-disc pl-5">
                                    {t.whatHelpsInTherapy.map((x, i) => (
                                        <li key={i}>{x}</li>
                                    ))}
                                </ul>
                            </div>

                            {t.subSections?.length ? (
                                <div className="mt-4 space-y-3">
                                    {t.subSections.map((s, idx) => (
                                        <div key={idx} className="rounded-xl border bg-gray-50 p-4">
                                            <div className="text-sm font-semibold">{s.title}</div>
                                            <ul className="mt-2 space-y-1 text-sm text-gray-700 list-disc pl-5">
                                                {s.bullets.map((b, i) => (
                                                    <li key={i}>{b}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            {t.whenToGetUrgentHelp?.length ? (
                                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                                    <div className="text-sm font-semibold text-red-900">When to get urgent help</div>
                                    <ul className="mt-2 space-y-1 text-sm text-red-900 list-disc pl-5">
                                        {t.whenToGetUrgentHelp.map((x, i) => (
                                            <li key={i}>{x}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}

                            <div className="mt-5 flex flex-wrap gap-2">
                                <Link
                                    href="/onboarding"
                                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
                                >
                                    Find a therapist match
                                </Link>
                                <Link
                                    href="/therapists"
                                    className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 text-sm"
                                >
                                    Explore therapists
                                </Link>
                            </div>
                        </section>
                    ))}
                </div>

                <footer className="mt-10 text-xs text-gray-500">
                    Note: This content is educational and cannot replace professional diagnosis or emergency care.
                </footer>
            </div>
        </div>
    );
}