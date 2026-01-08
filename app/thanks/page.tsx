import Link from "next/link";

export default function ThanksPage() {
    return (
        <main
            style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                padding: "2rem",
                background:
                    "radial-gradient(1200px 600px at 20% 10%, rgba(99,102,241,.25), transparent 60%), linear-gradient(180deg, #0b1220 0%, #070b13 100%)",
                color: "#e5e7eb",
            }}
        >
            <section
                style={{
                    width: "100%",
                    maxWidth: 560,
                    borderRadius: 20,
                    padding: "2rem",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
                    textAlign: "center",
                }}
            >
                <h1 style={{ fontSize: 34, margin: 0 }}>You’re on the list ✅</h1>
                <p style={{ marginTop: 12, color: "#cbd5e1" }}>
                    Thanks for signing up. We’ll email you when beta access is ready.
                </p>

                <Link
                    href="/"
                    style={{
                        display: "inline-block",
                        marginTop: 18,
                        padding: "0.8rem 1rem",
                        borderRadius: 12,
                        background: "rgba(99,102,241,0.18)",
                        border: "1px solid rgba(99,102,241,0.35)",
                        color: "#c7d2fe",
                        textDecoration: "none",
                        fontWeight: 700,
                    }}
                >
                    Back to homepage
                </Link>
            </section>
        </main>
    );
}
