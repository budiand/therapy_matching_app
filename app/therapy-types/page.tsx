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
      "Terapie structurată, orientată pe obiective, care lucrează cu legătura dintre gânduri, emoții și comportamente.",
    for: [
      "anxietate (inclusiv socială)",
      "depresie ușoară–moderată",
      "atacuri de panică",
      "stres / burnout",
      "insomnie (CBT-I)",
      "gestionarea furiei",
      "perfecționism, ruminație",
    ],
    howItWorks: [
      "identifici tipare de gândire (distorsiuni cognitive) și le testezi",
      "exerciții între ședințe (jurnal, expunere graduală, activare comportamentală)",
      "învățare de abilități: coping, problem solving, restructurare",
    ],
    goodIf: [
      "vrei plan clar și progres măsurabil",
      "îți place să lucrezi practic între ședințe",
      "ai nevoie de instrumente concrete pentru anxietate/stres",
    ],
    whatToAsk: [
      "Cum setăm obiectivele și cum măsurăm progresul?",
      "Dați exerciții între ședințe? Cum arată concret?",
      "Cum abordăm expunerea dacă am anxietate/panică?",
    ],
    notes: [
      "De obicei e mai scurtă ca durată decât terapiile exploratorii, dar depinde de caz.",
    ],
  },
  {
    id: "ACT",
    name: "ACT (Acceptance and Commitment Therapy)",
    short:
      "Te ajută să faci loc emoțiilor dificile fără să te lupți cu ele și să te miști spre valori (ce contează pentru tine).",
    for: [
      "anxietate și îngrijorare cronică",
      "stres, burnout",
      "depresie",
      "durere cronică / afecțiuni medicale",
      "perfecționism",
      "probleme de motivație / sens",
    ],
    howItWorks: [
      "lucrezi cu valori (direcții de viață) și angajamente concrete",
      "defuziune: observi gândurile ca gânduri, nu ca adevăruri absolute",
      "acceptare + mindfulness (ancorare în prezent)",
    ],
    goodIf: [
      "te simți blocat(ă) de anxietate și evitări",
      "vrei să-ți recapeți direcția și sensul",
      "ai ruminație și autocritică puternică",
    ],
    whatToAsk: [
      "Cum lucrăm cu valorile și ce înseamnă un plan de acțiune?",
      "Ce exerciții de defuziune/mindfulness folosiți?",
      "Cum abordăm evitarea și procrastinarea?",
    ],
  },
  {
    id: "Psychodynamic",
    name: "Psychodynamic Therapy",
    short:
      "Terapie exploratorie: înțelegi tipare relaționale și emoționale profunde, adesea legate de experiențe timpurii.",
    for: [
      "dificultăți relaționale recurente",
      "auto-sabotaj, tipare repetitive",
      "anxietate/depresie cu rădăcini vechi",
      "probleme de identitate / stimă de sine",
      "traume relaționale (în funcție de formare)",
    ],
    howItWorks: [
      "explorare a emoțiilor și semnificațiilor din spatele reacțiilor",
      "observarea tiparelor care apar și în relația terapeutică (alianță/transfer)",
      "clarificare, insight, integrare",
    ],
    goodIf: [
      "vrei să înțelegi „de ce mi se tot întâmplă la fel?”",
      "ai obiective de profunzime (nu doar simptome)",
      "îți place reflecția și explorarea",
    ],
    whatToAsk: [
      "Care e stilul dvs. (mai structurat sau mai exploratoriu)?",
      "Cât de des recomandați ședințe și pe ce orizont de timp?",
      "Cum abordați trauma și siguranța emoțională în proces?",
    ],
  },
  {
    id: "Humanistic",
    name: "Humanistic Therapy (ex. Person-Centered)",
    short:
      "Accent pe relația terapeutică, acceptare, autenticitate și dezvoltare personală (vindecare prin conectare și înțelegere).",
    for: [
      "stima de sine",
      "autocritică, rușine",
      "dificultăți emoționale generale",
      "crize existențiale / sens",
      "relații și comunicare",
    ],
    howItWorks: [
      "spațiu sigur și empatic pentru explorare",
      "validare emoțională, clarificare, conștientizare",
      "creștere personală și autonomie",
    ],
    goodIf: [
      "vrei un terapeut cald, centrat pe relație",
      "ai nevoie să te simți înțeles/înțeleasă înainte de strategii",
      "vrei să lucrezi cu emoții și autenticitate",
    ],
    whatToAsk: [
      "Cum arată o ședință tipică în abordarea dvs.?",
      "Cum lucrăm cu obiectivele (dacă vreau și structură)?",
      "Cum gestionați momentele intense emoțional?",
    ],
  },
  {
    id: "Schema",
    name: "Schema Therapy",
    short:
      "Integrează CBT + atașament: lucrează cu „scheme” (tipare) formate devreme și cu modurile emoționale.",
    for: [
      "tipare relaționale dureroase",
      "dificultăți persistente de stimă de sine",
      "tulburări de personalitate (în special BPD) – când e cazul",
      "traume relaționale / nevoi emoționale neîmplinite",
      "anxietate/depresie recurente",
    ],
    howItWorks: [
      "identificare scheme (abandon, defect, standarde înalte etc.)",
      "lucru experiențial (imagery rescripting), dialoguri între „moduri”",
      "reparenting limitat: corectare relațională în limite terapeutice",
    ],
    goodIf: [
      "simți că problemele revin indiferent câte „tehnici” încerci",
      "ai reacții emoționale foarte intense și vechi",
      "vrei profunzime + tehnici concrete",
    ],
    whatToAsk: [
      "Lucrați cu moduri și exerciții experiențiale (imagery)?",
      "Cum definim schemele și ce plan avem între ședințe?",
      "Ce experiență aveți cu trauma relațională / atașament?",
    ],
  },
  {
    id: "Systemic",
    name: "Systemic Therapy (Family / Couples)",
    short:
      "Privește problemele în contextul relațiilor și al sistemelor (familie, cuplu, dinamici).",
    for: [
      "terapie de cuplu",
      "conflicte familiale",
      "parenting / relația părinte-copil",
      "comunicare și limite",
      "evenimente de viață (divorț, mutare, pierdere)",
    ],
    howItWorks: [
      "mapare relațională (genogramă, tipare de comunicare)",
      "intervenții pe reguli/dinamici ale sistemului",
      "exerciții de comunicare și negociere",
    ],
    goodIf: [
      "vrei să lucrezi cu partenerul/familia",
      "problema apare mai ales în relații",
      "vrei claritate pe roluri, limite, comunicare",
    ],
    whatToAsk: [
      "Lucrați cu amândoi în ședințe? Cum gestionați confidențialitatea?",
      "Ce model folosiți (EFT, structural, narativ etc.)?",
      "Cum definim obiective comune și pași între ședințe?",
    ],
  },
  {
    id: "Integrative",
    name: "Integrative Therapy",
    short:
      "Combină metode (CBT/ACT/Schema/Psychodynamic etc.) în funcție de nevoile tale, nu „one size fits all”.",
    for: [
      "cazuri mixte (anxietate + relații + stimă de sine)",
      "când ai încercat o singură metodă și nu a fost suficient",
      "nevoi variate de-a lungul timpului",
    ],
    howItWorks: [
      "evaluare inițială clară + plan flexibil",
      "folosește tehnici diferite pe etape (stabilizare → procesare → integrare)",
      "focus atât pe simptome, cât și pe cauze",
    ],
    goodIf: [
      "vrei flexibilitate și adaptare",
      "ai mai multe obiective simultan",
      "vrei și structură, și explorare",
    ],
    whatToAsk: [
      "Ce școli integrați concret și când alegeți fiecare?",
      "Cum rămâneți consecvent(ă) în plan dacă folosiți metode diferite?",
      "Ce înseamnă progres pentru dvs. în cazul meu?",
    ],
  },
  {
    id: "Mindfulness",
    name: "Mindfulness-based (ex. MBSR / MBCT)",
    short:
      "Folosirea atenției conștiente ca abilitate: observi gânduri/emoții fără să te agăți de ele; reduce stresul și ruminația.",
    for: [
      "stres și burnout",
      "anxietate",
      "ruminație / overthinking",
      "prevenirea recăderilor în depresie (MBCT)",
      "somatizări (în unele cazuri)",
    ],
    howItWorks: [
      "practică ghidată (respirație, body scan, meditație) + aplicare în viața reală",
      "observare non-judicativă",
      "rutine scurte zilnice (5–15 min)",
    ],
    goodIf: [
      "simți că mintea fuge constant",
      "vrei instrumente de autoreglare",
      "ai stres ridicat și nevoie de ancorare",
    ],
    whatToAsk: [
      "Ce practici folosiți și ce recomandări de rutină aveți?",
      "Cum integrați mindfulness în situații reale (panică, conflict)?",
      "E potrivit pentru mine dacă am traumă/flashback-uri? (important!)",
    ],
    notes: [
      "Pentru unele persoane cu traumă severă, mindfulness poate necesita adaptare și stabilizare înainte.",
    ],
  },
  {
    id: "Gestalt",
    name: "Gestalt Therapy",
    short:
      "Accent pe conștientizare, experiență în prezent și responsabilitate personală; lucrează mult cu emoțiile în „aici și acum”.",
    for: [
      "claritate emoțională",
      "blocaje, decizii",
      "relații și limite",
      "autenticitate și stimă de sine",
      "anxietate/stres (în funcție de terapeut)",
    ],
    howItWorks: [
      "exerciții experiențiale (dialog, scaunul gol) când e potrivit",
      "observi ce se întâmplă în corp, emoții, impulsuri",
      "identifici nevoi și înveți să le exprimi sănătos",
    ],
    goodIf: [
      "vrei să simți și să înțelegi emoțiile, nu doar să le analizezi",
      "îți place lucru experiențial, creativ",
      "ai dificultăți cu limite și exprimare",
    ],
    whatToAsk: [
      "Folosiți tehnici experiențiale? Cum decideți când?",
      "Cum lucrăm cu emoții intense în siguranță?",
      "Cum conectăm insight-ul cu schimbări concrete?",
    ],
  },
  {
    id: "DBT",
    name: "DBT (Dialectical Behavior Therapy)",
    short:
      "Terapie foarte structurată pentru reglare emoțională, toleranță la distres, relații și mindfulness; foarte practică.",
    for: [
      "reglare emoțională dificilă",
      "impulsivitate",
      "auto-vătămare / idei suicidare (în cadre clinice specializate)",
      "BPD (în multe ghiduri e standard)",
      "crize frecvente, conflict relațional",
    ],
    howItWorks: [
      "abilități în module: mindfulness, distres tolerance, emotion regulation, interpersonal effectiveness",
      "planuri concrete pentru crize",
      "uneori include grup de abilități (depinde de setare)",
    ],
    goodIf: [
      "ai nevoie de structură și instrumente rapide",
      "te confrunți cu emoții intense sau crize",
      "vrei să înveți abilități relaționale",
    ],
    whatToAsk: [
      "Oferiți DBT complet (terapie + skills) sau integrat parțial?",
      "Cum arată planul de siguranță în crize?",
      "Ce abilități exersăm între ședințe?",
    ],
    notes: [
      "Dacă există risc de auto-vătămare/suicid, e importantă direcționarea către servicii specializate.",
    ],
  },
  {
    id: "EMDR",
    name: "EMDR (Eye Movement Desensitization and Reprocessing)",
    short:
      "Abordare pentru procesarea amintirilor traumatice folosind stimulare bilaterală (ex. mișcări oculare), după stabilizare.",
    for: [
      "PTSD / traumă",
      "evenimente traumatice (accidente, agresiuni, pierderi)",
      "traumă complexă (cu adaptări, etapizat)",
      "anxietate legată de evenimente specifice",
    ],
    howItWorks: [
      "stabilizare și resurse (siguranță) înainte de procesare",
      "identificare ținte (amintiri, declanșatori, credințe negative)",
      "reprocesare cu stimulare bilaterală + integrare",
    ],
    goodIf: [
      "ai flashback-uri, triggeri sau amintiri intruzive",
      "simți că „știu logic, dar corpul nu se calmează”",
      "vrei procesare focalizată pe traumă",
    ],
    whatToAsk: [
      "Sunteți formați/atestați în EMDR? Ce nivel?",
      "Cum faceți stabilizarea înainte de procesare?",
      "Cum gestionați dissocierea sau copleșirea în ședințe?",
    ],
    notes: [
      "EMDR e recomandat să fie făcut de terapeuți formați specific; stabilizarea e esențială.",
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
              A quick, human explanation of the main therapy approaches. Use this to choose
              a therapist with more confidence.
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
  // client-like behavior without "use client": keep it static.
  // If you want filters/search interactive, move this component to a separate "use client" file.
  // For now, show all therapies expanded & readable.

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white border rounded-2xl p-5">
        <h2 className="text-lg font-semibold">Therapy approaches</h2>
        <p className="text-sm text-gray-600 mt-1">
          Methods therapists can specialize in (the same ones you see in profiles).
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
          If you’re unsure, that’s normal. Many people start with an integrative therapist,
          then refine preferences after 1–2 sessions.
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