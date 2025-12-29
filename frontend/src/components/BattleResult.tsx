interface BattleResultProps {
  isVictory: boolean;
  onContinue: () => void;
  victoryText?: string;
  defeatText?: string;
}

export default function BattleResult({
  isVictory,
  onContinue,
  victoryText,
  defeatText,
}: BattleResultProps) {

  if (!isVictory) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 text-red-600">
        <h1 className="text-8xl md:text-9xl font-extrabold tracking-widest mb-8 animate-pulse drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] text-center">
          GAME OVER
        </h1>
        <div className="max-w-2xl text-center mb-12 px-6">
          <p className="text-2xl md:text-3xl text-gray-400 font-serif italic leading-relaxed">
            "{defeatText || "Você caiu em combate..."}"
          </p>
        </div>
        <button
          onClick={onContinue}
          className="px-10 py-4 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg text-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-red-500"
        >
          Jogar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 text-green-500">
      <h1 className="text-8xl md:text-9xl font-extrabold tracking-widest mb-8 animate-pulse drop-shadow-[0_0_15px_rgba(34,197,94,0.8)] text-center">
        VITÓRIA!
      </h1>
      <div className="max-w-2xl text-center mb-12 px-6">
        <p className="text-2xl md:text-3xl text-gray-400 font-serif italic leading-relaxed">
          "{victoryText}"
        </p>
      </div>
      <button
        onClick={onContinue}
        className="px-10 py-4 bg-green-700 hover:bg-green-600 text-white font-bold rounded-lg text-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.5)] border border-green-500"
      >
        Continuar Jornada
      </button>
    </div>
  );
}