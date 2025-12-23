"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Person = {
  id: string;
  first_name: string;
  last_name: string;
  birth_year: number;
  family_code: string;
  email?: string | null;
  phone?: string | null;
};

export default function ArbrePage() {
  const [familyCode, setFamilyCode] = useState("");
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // formulaire
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("familyCode");
    if (saved) setFamilyCode(saved);
  }, []);
  useEffect(() => {
    if (familyCode) localStorage.setItem("familyCode", familyCode);
  }, [familyCode]);

  const canLoad = useMemo(() => !!familyCode.trim(), [familyCode]);

  async function loadPeople() {
    setError(null);
    if (!familyCode.trim()) return;

    setLoading(true);
    const res = await fetch(`/api/persons?familyCode=${encodeURIComponent(familyCode.trim())}`);
    const json = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(json?.error || "Impossible de charger.");
      setPeople([]);
      return;
    }

    setPeople((json.data ?? []) as Person[]);
  }

  async function addPerson() {
    setError(null);

    if (!familyCode.trim()) return setError("Entre un code famille (ex: BERTRAND2025).");
    if (!firstName.trim() || !lastName.trim() || !birthYear.trim()) {
      return setError("Nom, prénom et année de naissance sont obligatoires.");
    }

    setLoading(true);
    const res = await fetch("/api/persons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        family_code: familyCode.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        birth_year: Number(birthYear),
        email: email.trim() || undefined, // facultatif
        phone: phone.trim() || undefined, // facultatif
      }),
    });
    const json = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) return setError(json?.error || "Impossible d'ajouter.");

    setFirstName("");
    setLastName("");
    setBirthYear("");
    setEmail("");
    setPhone("");

    await loadPeople();
  }

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          Arbre généalogique de la famille Bertrand
        </h1>
        <p className="text-sm opacity-80">
          Accès validé ✅ — si tu veux revenir à la question secrète :{" "}
          <Link className="underline" href="/acces">
            accès
          </Link>
        </p>
      </header>

      <section className="border rounded-xl p-4 space-y-3">
        <div className="font-semibold">Code famille</div>
        <input
          className="border p-2 w-full rounded-lg"
          placeholder="Ex: BERTRAND2025"
          value={familyCode}
          onChange={(e) => setFamilyCode(e.target.value)}
        />
        <button
          className="bg-black text-white px-4 py-2 rounded-lg w-full disabled:opacity-60"
          disabled={loading || !canLoad}
          onClick={loadPeople}
        >
          {loading ? "Chargement..." : "Charger les membres"}
        </button>
      </section>

      <section className="border rounded-xl p-4 space-y-3">
        <div className="font-semibold">Ajouter une personne</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border p-2 w-full rounded-lg" placeholder="Prénom *" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input className="border p-2 w-full rounded-lg" placeholder="Nom *" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <input className="border p-2 w-full rounded-lg" placeholder="Année de naissance * (ex: 1988)" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} />
          <div />
          <input className="border p-2 w-full rounded-lg" placeholder="Adresse mail (facultatif)" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="border p-2 w-full rounded-lg" placeholder="Téléphone (facultatif)" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full disabled:opacity-60"
          disabled={loading}
          onClick={addPerson}
        >
          {loading ? "Ajout..." : "Ajouter"}
        </button>
      </section>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Membres</h2>
        {people.length === 0 ? (
          <div className="text-sm opacity-70">Aucun membre chargé.</div>
        ) : (
          <ul className="space-y-2">
            {people.map((p) => (
              <li key={p.id} className="border p-3 rounded-lg">
                <div className="font-semibold">
                  {p.first_name} {p.last_name} ({p.birth_year})
                </div>
                <div className="text-sm opacity-80">
                  {p.email ? <span>Email: {p.email}</span> : <span>Email: —</span>}
                  {" · "}
                  {p.phone ? <span>Tél: {p.phone}</span> : <span>Tél: —</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
