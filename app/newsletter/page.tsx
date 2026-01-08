export default function NewsletterPage() {
    return (
        <main style={{ padding: "4rem", maxWidth: "600px", margin: "0 auto" }}>
            <h1>Acces timpuriu</h1>

            <p>
                Lucrăm la o aplicație care te ajută să găsești terapeutul potrivit.
                Lasă-ne emailul și te anunțăm la lansare.
            </p>

            <form
                action="https://formspree.io/f/mnjneolv"
                method="POST"
                style={{ marginTop: "2rem" }}
            >
                <input
                    type="email"
                    name="email"
                    placeholder="Email-ul tău"
                    required
                    style={{
                        width: "100%",
                        padding: "0.75rem",
                        marginBottom: "1rem",
                        fontSize: "1rem",
                    }}
                />

                {/* opțional – pentru tracking sursă */}
                <input type="hidden" name="source" value="newsletter_page" />

                <button
                    type="submit"
                    style={{
                        padding: "0.75rem 1.5rem",
                        fontSize: "1rem",
                        cursor: "pointer",
                    }}
                >
                    Vreau acces timpuriu
                </button>
            </form>
        </main>
    );
}
