import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-4xl md:text-5xl font-extrabold">
        Arbre généalogique de la famille Bertrand
      </h1>

      <p className="text-base opacity-80">
        Accès protégé par une question secrète.
      </p>

      <div className="flex gap-3">
        <Link
          href="/acces"
          className="bg-black text-white px-5 py-3 rounded-lg"
        >
          Accéder
        </Link>
        <Link
          href="/arbre"
          className="px-5 py-3 rounded-lg border"
        >
          Aller à l’arbre
        </Link>
      </div>

      <p className="text-sm opacity-70">
        Astuce : si tu n’as pas encore validé la question secrète, la page
        “Arbre” te renverra automatiquement sur l’accès.
      </p>
    </main>
  );
}
