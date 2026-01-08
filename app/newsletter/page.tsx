import Link from "next/link";

export default function NewsletterPage() {
    return (
        <main
            style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                padding: "2rem",
                background:
                    "radial-gradient(1200px 600px at 20% 10%, rgba(99,102,241,.25), transparent 60%), radial-gradient(900px 500px at 80% 30%, rgba(16,185,129,.18), transparent 55%), linear-gradient(180deg, #0b1220 0%, #070b13 100%)",
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
                    backdropFilter: "blur(10px)",
                }}
            >
                <div style={{ marginBottom: "1.25rem" }}>
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "0.35rem 0.65rem",
                            borderRadius: 999,
                            background: "rgba(99,102,241,0.16)",
                            border: "1px solid rgba(99,102,241,0.35)",
                            color: "#c7d2fe",
                            fontSize: 13,
                            marginBottom: 12,
                        }}
                    >
            <span
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: "#a5b4fc",
                    display: "inline-block",
                }}
            />
                        Early access waitlist
                    </div>

                    <h1 style={{ fontSize: 32, lineHeight: 1.2, margin: 0 }}>
                        Find the right therapist — faster.
                    </h1>

                    <p style={{ marginTop: 12, marginBottom: 0, color: "#cbd5e1" }}>
                        We’re building a therapy matching experience that helps you choose
                        with confidence. Leave your email and we’ll notify you when we open
                        beta access.
                    </p>
                </div>

                <form
                    action="https://formspree.io/f/mnjneolv"
                    method="POST"
                    style={{ marginTop: "1.5rem" }}
                >
                    <label
                        htmlFor="email"
                        style={{
                            display: "block",
                            fontSize: 14,
                            color: "#cbd5e1",
                            marginBottom: 8,
                        }}
                    >
                        Email address
                    </label>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        required
                        style={{
                            width: "100%",
                            padding: "0.85rem 0.95rem",
                            borderRadius: 12,
                            border: "1px solid rgba(255,255,255,0.14)",
                            background: "rgba(15,23,42,0.55)",
                            color: "#e5e7eb",
                            outline: "none",
                            fontSize: 16,
                        }}
                    />

                    {/* Optional: helps you identify signups from this page */}
                    <input type="hidden" name="source" value="newsletter_page" />

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            marginTop: 14,
                            padding: "0.9rem 1rem",
                            borderRadius: 12,
                            border: "1px solid rgba(255,255,255,0.16)",
                            background:
                                "linear-gradient(90deg, rgba(99,102,241,0.95), rgba(16,185,129,0.85))",
                            color: "#0b1220",
                            fontWeight: 700,
                            fontSize: 16,
                            cursor: "pointer",
                        }}
                    >
                        Join the waitlist
                    </button>

                    <p
                        style={{
                            marginTop: 12,
                            marginBottom: 0,
                            fontSize: 13,
                            color: "rgba(226,232,240,0.75)",
                            lineHeight: 1.4,
                        }}
                    >
                        No spam. Only product updates and beta access. You can unsubscribe
                        anytime.
                    </p>
                </form>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        marginTop: "1.75rem",
                        paddingTop: "1.25rem",
                        borderTop: "1px solid rgba(255,255,255,0.10)",
                        color: "rgba(226,232,240,0.8)",
                        fontSize: 14,
                    }}
                >
                    <span>Prefer exploring first?</span>
                    <Link
                        href="/"
                        style={{
                            color: "#a5b4fc",
                            textDecoration: "none",
                            fontWeight: 600,
                        }}
                    >
                        Back to homepage →
                    </Link>
                </div>
            </section>
        </main>
    );
}
