import Link from "next/link";
import { STAGES } from "@/data/dialogueData";

export default function Menu() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 font-mono">
      <h1 className="text-4xl font-bold mb-12 text-center">
        Selecione a Próxima Aventura
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {STAGES.map((stage) =>
          stage.isActive ? (
            <Link
              key={stage.id}
              href={`/stage/${stage.id}`}
              className="border-2 border-gray-700 rounded-lg p-6 text-center hover:border-yellow-400 hover:bg-gray-900/50 transition-all duration-300 transform hover:-translate-y-1"
            >
              <h2 className="text-2xl font-semibold text-yellow-400">{stage.title}</h2>
            </Link>
          ) : (
            <div
              key={stage.id}
              className="relative border-2 border-gray-800 rounded-lg p-6 text-center cursor-not-allowed bg-gray-900/20 overflow-hidden"
            >
              <h2 className="text-2xl font-semibold text-gray-600 blur-[2px] select-none">{stage.title}</h2>
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <span className="text-sm font-bold text-red-500 uppercase tracking-widest border-2 border-red-900/60 px-4 py-1 rounded bg-black/80 shadow-lg transform -rotate-6">
                  Bloqueado
                </span>
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
}