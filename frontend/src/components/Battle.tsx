"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Enemy } from "@/data/enemies";
import { HotDog } from "@/types/hotdog";

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function Battle({ enemy: actualEnemy }: { enemy: Enemy }) {
  // Inicializa o herói com valores padrão
  const [hero, setHero] = useState<HotDog>({
    name: "Hot Dog",
    maxLife: 5,
    currentLife: 5,
    live: true
  });

  const [enemy, setEnemy] = useState<Enemy>(actualEnemy);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [battleResult, setBattleResult] = useState<string | null>(null);

  // Novos estados para a lógica de batalha frontend
  const [heroSecret, setHeroSecret] = useState<number>(0);
  const [enemySecret, setEnemySecret] = useState<number>(0);
  const [isItemEquipped, setIsItemEquipped] = useState(false);

  const router = useRouter();

  // Efeito para buscar o estado inicial do herói e preparar a batalha
  useEffect(() => {
    // Reseta o inimigo e herói para o início da batalha
    const initialEnemy = { ...actualEnemy, currentLife: actualEnemy.maxLife };
    const initialHero = { name: "Hot Dog", maxLife: 5, currentLife: 5 } as HotDog;

    setEnemy(initialEnemy);
    setHero(initialHero);

    // Sorteia números secretos (1 até Vida Total)
    const hSecret = getRandomInt(1, initialHero.maxLife);
    const eSecret = getRandomInt(1, initialEnemy.maxLife);
    setHeroSecret(hSecret);
    setEnemySecret(eSecret);

    setIsBattleOver(false);
    setBattleResult(null);
    setBattleLog(["A batalha começou!", `Segredo do Herói: ${hSecret}`, `Segredo do Inimigo: ${eSecret}`]);
  }, [actualEnemy.id]); // A dependência agora é o ID do inimigo, que é seu identificador único.

  const handleRound = () => {
    if (!hero || !enemy || isBattleOver) return;

    const currentHero = { ...hero };
    const currentEnemy = { ...enemy };
    const roundLog: string[] = [];

    // --- Turno do Herói ---
    // Item equipado aumenta o número de sorteios (Ex: +1 sorteio)
    const heroDrawsCount = isItemEquipped ? 2 : 1;
    const heroDraws = Array.from({ length: heroDrawsCount }, () => getRandomInt(1, currentEnemy.maxLife));

    const heroHits = heroDraws.filter((n) => n === enemySecret).length;

    roundLog.push(`Herói sorteou [${heroDraws.join(", ")}].`);

    if (heroHits > 0) {
      const damage = enemySecret * heroHits;
      currentEnemy.currentLife -= damage;
      roundLog.push(`-> ACERTOU! Dano no inimigo: ${damage}`);
    } else {
      roundLog.push(`-> Errou (Segredo Inimigo: ${enemySecret}).`);
    }

    // Verifica Vitória
    if (currentEnemy.currentLife <= 0) {
      currentEnemy.currentLife = 0;
      setEnemy(currentEnemy);
      setHero(currentHero);
      setBattleLog((prev) => [...prev, ...roundLog, "VITÓRIA! O inimigo foi derrotado."]);
      setBattleResult("VITÓRIA");
      setIsBattleOver(true);
      // Bônus de vida (visual)
      // currentHero.maxLife += 5; 
      return;
    }

    // --- Turno do Inimigo ---
    const enemyDrawsCount = currentEnemy.numberOfDraws || 1;
    const enemyDraws = Array.from({ length: enemyDrawsCount }, () => getRandomInt(1, currentHero.maxLife));

    const enemyHits = enemyDraws.filter((n) => n === heroSecret).length;

    roundLog.push(`${currentEnemy.name} sorteou [${enemyDraws.join(", ")}].`);

    if (enemyHits > 0) {
      const damage = heroSecret * enemyHits;
      currentHero.currentLife -= damage;
      roundLog.push(`-> VOCÊ SOFREU DANO! Perdeu ${damage} de vida.`);
    } else {
      roundLog.push(`-> Inimigo errou (Seu Segredo: ${heroSecret}).`);
    }

    // Verifica Derrota
    if (currentHero.currentLife <= 0) {
      currentHero.currentLife = 0;
      setBattleLog((prev) => [...prev, ...roundLog, "DERROTA! Você caiu em combate."]);
      setBattleResult("DERROTA");
      setIsBattleOver(true);
    }

    // Atualiza estados
    setHero(currentHero);
    setEnemy(currentEnemy);
    setBattleLog((prev) => [...prev, ...roundLog]);
  };

  if (!hero) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 font-mono">
        <p className="text-2xl text-red-500">
          Não foi possível carregar a batalha.
        </p>
      </main>
    );
  }

  const isVictory = battleResult?.startsWith("VITÓRIA");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 font-mono">
      <h1 className="text-4xl font-bold mb-8">Batalha!</h1>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Card do Herói */}
        <div className="border-2 border-blue-500 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold text-blue-400">{hero.name}</h2>
          <p>HP: {hero.currentLife} / {hero.maxLife}</p>
          <p className="text-sm text-gray-400">Segredo: {heroSecret}</p>
          <div className="w-full bg-gray-700 rounded-full h-4 mt-2">
            <div className="bg-blue-500 h-4 rounded-full transition-all duration-500" style={{ width: `${(hero.currentLife / hero.maxLife) * 100}%` }}></div>
          </div>
        </div>
        {/* Card do Inimigo */}
        <div className="border-2 border-red-500 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold text-red-400">{enemy?.name}</h2>
          <p>HP: {enemy?.currentLife} / {enemy?.maxLife}</p>
          <p className="text-sm text-gray-400">Segredo: {enemySecret}</p>
          <div className="w-full bg-gray-700 rounded-full h-4 mt-2">
            <div className="bg-red-500 h-4 rounded-full" style={{ width: `100%` }}></div>
          </div>
        </div>
      </div>

      {/* Log da Batalha */}
      <div className="w-full max-w-4xl h-48 bg-gray-900/50 border border-gray-700 rounded-lg p-4 overflow-y-auto mb-8 flex flex-col-reverse">
        <div>
          {battleLog.slice().reverse().map((line, index) => (
            <p key={battleLog.length - index} className="text-gray-300">{`> ${line}`}</p>
          ))}
        </div>
      </div>

      {/* Controles da Batalha */}
      <div className="w-full max-w-4xl">
        {!isBattleOver ? (
          <div className="flex flex-col gap-4">
            <label className="flex items-center space-x-2 cursor-pointer bg-gray-800 p-3 rounded-lg border border-gray-600">
              <input
                type="checkbox"
                checked={isItemEquipped}
                onChange={(e) => setIsItemEquipped(e.target.checked)}
                className="w-6 h-6 text-blue-600"
              />
              <span className="text-lg">Equipar Item (Aumenta sorteios do Herói)</span>
            </label>
            <button onClick={handleRound} className="w-full bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg text-xl hover:bg-yellow-400 transition-colors">
              Atacar / Próxima Rodada
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className={`text-3xl font-bold mb-4 ${isVictory ? 'text-green-500' : 'text-red-500'}`}>
              {isVictory ? 'VITÓRIA!' : 'DERROTA!'}
            </p>
            <button onClick={() => router.push("/menu")} className="bg-blue-500 text-white font-bold py-3 px-8 rounded-lg text-xl hover:bg-blue-400 transition-colors">
              Continuar Jornada
            </button>
          </div>
        )}
      </div>
    </main>
  );
}