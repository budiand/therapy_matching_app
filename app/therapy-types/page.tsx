import Link from "next/link";

type Therapy = {
  id:
    | "CBT"
    | "ACT"
    | "Psychodynamic"
    | "Humanistic"
    | "Schema"
    | "Systemic"
    | "Integrative"
    | "Mindfulness"
    | "Gestalt"
    | "DBT"
    | "EMDR";
  name: string;
  short: string;
  for: string[];
  howItWorks: string[];
  goodIf: string[];
  whatToAsk: string[];
  notes?: string[];
};

const THERAPIES: Therapy[] = [
  {
    id: "CBT",
    name: "CBT (Cognitive Behavioral Therapy)",
    short:
      "A structured, goal-oriented therapy that works on the link between thoughts, emotions, and behaviors.",
    for: [
      "anxiety (including social anxiety)",
      "mild–moderate depression",
      "panic attacks",
      "stress / burnout",
      "insomnia (CBT-I)",
      "anger management",
      "perfectionism and rumination",
    ],
    howItWorks: [
      "identify thinking patterns (cognitive distortions) and test them",
      "between-session practice (journaling, graded exposure, behavioral activation)",
      "skills training: coping, problem solving, cognitive restructuring",
    ],
    goodIf: [
      "you want a clear plan and measurable progress",
      "you like practical work between sessions",
      "you want concrete tools for anxiety and stress",
    ],
    whatToAsk: [
      "How do we set goals and track progress?",
      "Do you give homework between sessions? What does it look like?",
      "How do you approach exposure work for anxiety/panic?",
    ],
    notes: [
      "Often shorter-term than exploratory therapies, but duration depends on the case.",
    ],
  },
  {
    id: "ACT",
    name: "ACT (Acceptance and Commitment Therapy)",
    short:
      "Helps you make room for difficult feelings without fighting them, while moving toward values (what matters to you).",
    for: [
      "anxiety and chronic worry",
      "stress and burnout",
      "depression",
      "chronic pain / medical conditions",
      "perfectionism",
      "motivation and meaning-related struggles",
    ],
    howItWorks: [
      "clarify your values and build concrete commitments",
      "defusion: learn to notice thoughts as thoughts, not absolute truths",
      "acceptance + mindfulness (grounding in the present moment)",
    ],
    goodIf: [
      "you feel stuck in anxiety and avoidance",
      "you want direction and meaning again",
      "you struggle with rumination and harsh self-criticism",
    ],
    whatToAsk: [
      "How do we work with values and turn them into action plans?",
      "What defusion or mindfulness exercises do you use?",
      "How do you address avoidance and procrastination?",
    ],
  },
  {
    id: "Psychodynamic",
    name: "Psychodynamic Therapy",
    short:
      "An exploratory approach focused on deeper emotional and relational patterns, often connected to early experiences.",
    for: [
      "repeating relationship difficulties",
      "self-sabotage and recurring patterns",
      "anxiety/depression with deeper roots",
      "identity and self-esteem concerns",
      "relational trauma (depending on training)",
    ],
    howItWorks: [
      "explore emotions and meanings beneath reactions",
      "notice patterns that show up in relationships (including the therapeutic relationship)",
      "insight, integration, and long-term change",
    ],
    goodIf: [
      "you want to understand: “why does this keep happening?”",
      "you want depth work (not only symptom relief)",
      "you like reflection and exploration",
    ],
    whatToAsk: [
      "What’s your style (more structured or more exploratory)?",
      "How often do you recommend sessions and for what time horizon?",
      "How do you approach trauma and emotional safety in therapy?",
    ],
  },
  {
    id: "Humanistic",
    name: "Humanistic Therapy (e.g., Person-Centered)",
    short:
      "Focused on the therapeutic relationship, acceptance, authenticity, and growth—healing through understanding and connection.",
    for: [
      "self-esteem and self-worth",
      "shame and harsh self-criticism",
      "general emotional difficulties",
      "existential crises / meaning",
      "relationships and communication",
    ],
    howItWorks: [
      "a safe, empathic space for exploration",
      "emotional validation, clarity, self-awareness",
      "personal growth and autonomy",
    ],
    goodIf: [
      "you want a warm, relationship-centered therapist",
      "you need understanding before strategies",
      "you want to work deeply with emotions and authenticity",
    ],
    whatToAsk: [
      "What does a typical session look like in your approach?",
      "How do we work with goals if I also want structure?",
      "How do you support clients during intense emotional moments?",
    ],
  },
  {
    id: "Schema",
    name: "Schema Therapy",
    short:
      "Combines CBT and attachment work. It targets early-formed ‘schemas’ and emotional ‘modes’ that keep repeating in adulthood.",
    for: [
      "painful relationship patterns",
      "persistent self-esteem struggles",
      "personality difficulties (e.g., BPD) when relevant",
      "relational trauma / unmet emotional needs",
      "recurrent anxiety or depression",
    ],
    howItWorks: [
      "identify schemas (abandonment, defectiveness, unrelenting standards, etc.)",
      "experiential work (imagery rescripting), dialogues between ‘modes’",
      "limited reparenting: corrective emotional experience within clear boundaries",
    ],
    goodIf: [
      "you feel problems return no matter how many ‘techniques’ you try",
      "your emotional reactions feel intense and long-standing",
      "you want depth + practical tools",
    ],
    whatToAsk: [
      "Do you work with modes and experiential techniques (imagery)?",
      "How do we define schemas and what’s the between-session plan?",
      "What experience do you have with attachment and relational trauma?",
    ],
  },
  {
    id: "Systemic",
    name: "Systemic Therapy (Family / Couples)",
    short:
      "Looks at difficulties in the context of relationships and systems (couple, family, relational dynamics).",
    for: [
      "couples therapy",
      "family conflict",
      "parenting and parent–child dynamics",
      "communication and boundaries",
      "life transitions (divorce, relocation, grief)",
    ],
    howItWorks: [
      "map relational patterns (communication loops, family roles)",
      "interventions targeting system rules and dynamics",
      "communication and negotiation exercises",
    ],
    goodIf: [
      "you want to work with your partner/family",
      "the problem shows up mostly in relationships",
      "you want clarity on roles, boundaries, and communication",
    ],
    whatToAsk: [
      "Do you see partners/family members together? How do you handle confidentiality?",
      "What model do you use (EFT, structural, narrative, etc.)?",
      "How do we define shared goals and steps between sessions?",
    ],
  },
  {
    id: "Integrative",
    name: "Integrative Therapy",
    short:
      "Combines methods (CBT/ACT/Schema/Psychodynamic, etc.) depending on your needs—rather than one single approach for everyone.",
    for: [
      "mixed concerns (anxiety + relationships + self-esteem)",
      "when a single method wasn’t enough",
      "different needs across different life phases",
    ],
    howItWorks: [
      "clear initial assessment + flexible plan",
      "uses different tools across stages (stabilize → process → integrate)",
      "focuses on both symptoms and underlying patterns",
    ],
    goodIf: [
      "you want flexibility and personalization",
      "you have multiple goals at once",
      "you want both structure and exploration",
    ],
    whatToAsk: [
      "Which approaches do you integrate and when do you choose each one?",
      "How do you keep the plan consistent while using different methods?",
      "What does progress look like for my case?",
    ],
  },
  {
    id: "Mindfulness",
    name: "Mindfulness-based (e.g., MBSR / MBCT)",
    short:
      "Uses mindfulness as a skill: noticing thoughts and emotions without getting pulled in—reducing stress and rumination.",
    for: [
      "stress and burnout",
      "anxiety",
      "rumination / overthinking",
      "relapse prevention in depression (MBCT)",
      "some mind–body symptoms (depending on context)",
    ],
    howItWorks: [
      "guided practices (breath, body scan, meditation) + real-life application",
      "non-judgmental awareness",
      "short daily routines (5–15 minutes) when possible",
    ],
    goodIf: [
      "your mind never slows down",
      "you want self-regulation tools",
      "you’re highly stressed and need grounding",
    ],
    whatToAsk: [
      "What practices do you use and what daily routine do you recommend?",
      "How do we use mindfulness in real situations (panic, conflict)?",
      "Is it appropriate for me if I have trauma/flashbacks? (important)",
    ],
    notes: [
      "For some people with severe trauma, mindfulness needs careful adaptation and stabilization first.",
    ],
  },
  {
    id: "Gestalt",
    name: "Gestalt Therapy",
    short:
      "Focuses on awareness, present-moment experience, and personal responsibility—often working deeply with emotions in the ‘here and now’.",
    for: [
      "emotional clarity",
      "life decisions and feeling stuck",
      "relationships and boundaries",
      "authenticity and self-esteem",
      "stress/anxiety (depending on therapist training)",
    ],
    howItWorks: [
      "experiential techniques (dialogue, empty chair) when appropriate",
      "notice what’s happening in the body, emotions, impulses",
      "identify needs and practice expressing them in healthier ways",
    ],
    goodIf: [
      "you want to feel and understand emotions—not only analyze them",
      "you like experiential and creative work",
      "you struggle with boundaries and expression",
    ],
    whatToAsk: [
      "Do you use experiential techniques? How do you decide when?",
      "How do we work safely with intense emotions?",
      "How do we translate insight into real-life change?",
    ],
  },
  {
    id: "DBT",
    name: "DBT (Dialectical Behavior Therapy)",
    short:
      "A highly structured, skills-based therapy for emotion regulation, distress tolerance, relationships, and mindfulness—very practical.",
    for: [
      "emotion dysregulation",
      "impulsivity",
      "self-harm / suicidal ideation (in specialized settings)",
      "BPD (commonly recommended in guidelines)",
      "frequent crises and intense relationship conflict",
    ],
    howItWorks: [
      "skills modules: mindfulness, distress tolerance, emotion regulation, interpersonal effectiveness",
      "concrete crisis plans",
      "sometimes includes skills group (depends on provider)",
    ],
    goodIf: [
      "you need structure and fast-acting tools",
      "you deal with intense emotions or frequent crises",
      "you want stronger relationship skills",
    ],
    whatToAsk: [
      "Do you offer full DBT (therapy + skills) or only DBT-informed work?",
      "How do you plan for safety during crises?",
      "What skills do we practice between sessions?",
    ],
    notes: [
      "If there is risk of self-harm or suicide, specialized clinical support is essential.",
    ],
  },
  {
    id: "EMDR",
    name: "EMDR (Eye Movement Desensitization and Reprocessing)",
    short:
      "A trauma-focused method that processes painful memories using bilateral stimulation (e.g., eye movements), after careful stabilization.",
    for: [
      "PTSD / trauma",
      "single-event trauma (accidents, assaults, losses)",
      "complex trauma (with adaptations, step-by-step)",
      "anxiety linked to specific memories/triggers",
    ],
    howItWorks: [
      "stabilization and resourcing (safety) before processing",
      "identify targets (memories, triggers, negative beliefs)",
      "reprocessing + integration",
    ],
    goodIf: [
      "you have intrusive memories, flashbacks, or strong triggers",
      "you feel: “I understand logically, but my body won’t calm down”",
      "you want focused trauma processing",
    ],
    whatToAsk: [
      "Are you formally trained/certified in EMDR? What level?",
      "How do you do stabilization before processing?",
      "How do you manage dissociation or overwhelm in sessions?",
    ],
    notes: [
      "EMDR should be provided by specifically trained therapists; stabilization is key.",
    ],
  },
];

export default function TherapyTypesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Type of Therapy</h1>
            <p className="text-gray-600 mt-2">
              A simple, human explanation of the main therapy approaches. Use this to choose a therapist
              with more confidence.
            </p>
          </div>

          <Link
            href="/therapists"
            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 text-sm"
          >
            Browse therapists
          </Link>
        </div>

        <TherapyGuide />
      </div>
    </div>
  );
}

function TherapyGuide() {
  // Static page (server component). If you want interactive search/filters, move to a separate "use client" file.
  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white border rounded-2xl p-5">
        <h2 className="text-lg font-semibold">Therapy approaches</h2>
        <p className="text-sm text-gray-600 mt-1">
          Methods therapists can specialize in (the same ones you’ll see in their profiles).
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {THERAPIES.map((t) => (
            <span
              key={t.id}
              className="px-3 py-1.5 rounded-full border bg-white text-sm text-gray-700"
            >
              {t.id === "Mindfulness" ? "Mindfulness-based" : t.id}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {THERAPIES.map((t) => (
          <div key={t.id} className="bg-white border rounded-2xl p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold">{t.name}</h3>
                <p className="text-gray-600 mt-2">{t.short}</p>
              </div>

              <span className="shrink-0 text-xs rounded-full border px-3 py-1 bg-indigo-50 text-indigo-700 border-indigo-200">
                {t.id === "Mindfulness" ? "Mindfulness-based" : t.id}
              </span>
            </div>

            <Section title="Helpful for">
              <Pills items={t.for} />
            </Section>

            <Section title="How it usually works">
              <Bullets items={t.howItWorks} />
            </Section>

            <Section title="Good fit if">
              <Bullets items={t.goodIf} />
            </Section>

            <Section title="What to ask your therapist">
              <Bullets items={t.whatToAsk} />
            </Section>

            {t.notes?.length ? (
              <div className="mt-5 rounded-xl border bg-amber-50 border-amber-200 p-4">
                <div className="text-sm font-semibold text-amber-900">Notes</div>
                <ul className="mt-2 space-y-1 text-sm text-amber-900 list-disc pl-5">
                  {t.notes.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-2xl p-6">
        <h2 className="text-lg font-semibold">Not sure what to pick?</h2>
        <p className="text-gray-600 mt-2">
          If you’re unsure, that’s normal. Many people start with an integrative therapist and refine
          preferences after 1–2 sessions.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/onboarding"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
          >
            Find me a match
          </Link>
          <Link
            href="/therapists"
            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 text-sm"
          >
            Explore therapists
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1 text-sm text-gray-700 list-disc pl-5">
      {items.map((x, i) => (
        <li key={i}>{x}</li>
      ))}
    </ul>
  );
}

function Pills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((x, i) => (
        <span
          key={i}
          className="text-xs px-3 py-1 rounded-full border bg-gray-50 text-gray-700"
        >
          {x}
        </span>
      ))}
    </div>
  );
}