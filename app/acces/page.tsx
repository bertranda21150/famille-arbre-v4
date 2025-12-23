"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AccesPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/arbre";

  const question = useMemo(
    () =>
      process.env.NEXT_PUBLIC_SECRET_QUESTION ||
      "Question secrète (à configurer dans NEXT_PUBLIC_SECRET_QUESTION)",
    []
  );

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

    router.push(next);
  }

  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-3xl font-extrabold">Accès à l’arbre</h1>

      <div className="border rounded-xl p-4 space-y-3">
        <div className="font-semibold">{question}</div>

        <input
          className="border p-2 w-full rounded-lg"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Ta réponse"
        />

        <button
          className="bg-black text-white px-4 py-2 rounded-lg w-full disabled:opacity-60"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Vérification..." : "Valider"}
        </button>

        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>
    </main>
  );
}
