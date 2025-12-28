import Link from "next/link";
import { STAGES } from "@/data/dialogueData";

export default function Menu() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 font-mono">
      <h1 className="text-4xl font-bold mb-12 text-center">
        Selecione a Próxima Aventura
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {STAGES.map((stage) => (
          <Link
            key={stage.id}
            href={`/stage/${stage.id}`}
            className="border-2 border-gray-700 rounded-lg p-6 text-center hover:border-yellow-400 hover:bg-gray-900/50 transition-all duration-300 transform hover:-translate-y-1"
          >
            <h2 className="text-2xl font-semibold text-yellow-400">{stage.title}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}