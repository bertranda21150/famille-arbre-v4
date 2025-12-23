"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AccesPage() {
  const router = useRouter();

  const question =
    process.env.NEXT_PUBLIC_SECRET_QUESTION ||
    "Question secrète (à configurer dans Vercel)";

  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/acces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Mauvaise réponse.");
      return;
    }

    router.push("/arbre");
  }

  return (
    <main style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>
        Accès à l’arbre
      </h1>

      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
        {question}
      </label>

      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Ta réponse"
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 10,
          border: "1px solid #ccc",
          marginBottom: 12,
        }}
      />

      <button
        onClick={submit}
        disabled={loading}
        style={{
          padding: "12px 18px",
          borderRadius: 10,
          border: "1px solid #ccc",
        }}
      >
        {loading ? "Vérification..." : "Valider"}
      </button>

      {error && (
        <p style={{ marginTop: 12, color: "crimson", fontWeight: 600 }}>
          {error}
        </p>
      )}
    </main>
  );
}
