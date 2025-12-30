"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { HotDog } from "@/types/hotdog";
import { Enemy } from "@/types/enemies";
import BattleResult from "./BattleResult";
import { useGameStore } from "@/stores/useGameStore";

// Definição dos itens do jogo
interface GameItem {
  id: string;
  name: string;
  imageSrc: string;
  description: string;
  activeText: string;
}

const allGameItems: Record<string, GameItem> = {
  sword: {
    id: 'sword',
    name: 'Espada Simples',
    imageSrc: '/sword.png',
    description: 'Eficaz contra lacaios',
    activeText: '+1 de ataque',
  },
  salsichinha: {
    id: 'salsichinha',
    name: 'Salsichinha',
    imageSrc: '/sal2.png',
    description: 'Ataque Combinado',
    activeText: '+1 de ataque',
  },
  'guia-atendimento': {
    id: 'guia-atendimento',
    name: 'Guia de Atendimento',
    imageSrc: '/scroll.png',
    description: 'Sorteia 2 números por ataque',
    activeText: '+2 de ataque',
  },
};

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

interface BattleProps {
  enemy: Enemy;
  victoryText?: string;
  defeatText?: string;
}

export default function Battle({ enemy: actualEnemy, victoryText, defeatText }: BattleProps) {
  // Inicializa o HotDog com valores padrão
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
  const [activeItems, setActiveItems] = useState<Set<string>>(new Set());
  const [isEnemyHit, setIsEnemyHit] = useState(false);
  const [isHeroHit, setIsHeroHit] = useState(false);

  const globalHero = useGameStore((state) => state.hero);
  // Para adicionar ou remover itens do jogador, modifique o estado global.
  // Ex: const heroOwnedItemIds = useGameStore((state) => state.hero.items) || ['salsichinha'];
  // Para esta demonstração, vamos assumir que o herói possui ambos os itens.
  // No jogo real, você controlaria os itens do herói através do `useGameStore`.
  const heroOwnedItemIds = ['sword', 'salsichinha'];
  const heroOwnedItems = heroOwnedItemIds.map(id => allGameItems[id]).filter((item): item is GameItem => !!item);

  const setGlobalHero = useGameStore((state) => state.setHero);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Efeito para buscar o estado inicial do HotDog e preparar a batalha
  useEffect(() => {
    // Reseta o inimigo e HotDog para o início da batalha
    const initialEnemy = { ...actualEnemy, currentLife: actualEnemy.maxLife };

    setEnemy(initialEnemy);
    setHero(globalHero);

    // Sorteia números secretos (1 até Vida Total)
    const hSecret = getRandomInt(1, globalHero.maxLife);
    const eSecret = getRandomInt(1, initialEnemy.maxLife);
    setHeroSecret(hSecret);
    setEnemySecret(eSecret);

    setIsBattleOver(false);
    setBattleResult(null);
    setBattleLog(["A batalha começou!", `Seu número secreto: ${hSecret}`, `Número secreto do ${actualEnemy.name}: ${eSecret}`]);

    const initialActiveItems = new Set<string>();
    // A Espada Simples deve começar ativada se o herói a possuir
    if (heroOwnedItemIds.includes('sword')) initialActiveItems.add('sword');
    setActiveItems(initialActiveItems);
  }, [actualEnemy.id, globalHero]); // A dependência agora é o ID do inimigo, que é seu identificador único.

  // Auto-scroll para o final do log sempre que houver atualização
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [battleLog]);

  const toggleItem = (itemId: string) => {
    // A Espada Simples não pode ser desativada
    if (itemId === 'sword') return;

    setActiveItems(prev => {
      const newActiveItems = new Set(prev);
      if (newActiveItems.has(itemId)) {
        newActiveItems.delete(itemId);
      } else {
        newActiveItems.add(itemId);
      }
      return newActiveItems;
    });
  };
  const handleGiveUp = () => {
    setGlobalHero(hero);
    router.push("/menu");
  };

  const onContinue = () => {
    if (isVictory) {
      setGlobalHero({ ...hero, maxLife: hero.maxLife + 5, currentLife: hero.currentLife + 5 });
      router.push("/menu");
    } else {
      // Reseta o herói para o estado inicial e volta para o início do jogo
      setGlobalHero({
        name: "Hot Dog",
        maxLife: 5,
        currentLife: 5,
        live: true,
      });
      router.push("/");
    }
  }

  const handleRound = () => {
    if (!hero || !enemy || isBattleOver) return;

    const currentHero = { ...hero };
    const currentEnemy = { ...enemy };
    const roundLog: string[] = [];

    const isCombinedAttack = activeItems.has('salsichinha');
    const isGuideActive = activeItems.has('guia-atendimento');
    const isSwordActive = activeItems.has('sword');

    // --- Turno do HotDog ---
    let heroDrawsCount = 1; // O HotDog sempre sorteia 1 número por padrão
    if (isGuideActive) {
      heroDrawsCount = 2;
      roundLog.push(`📜 Guia de Atendimento ativado! Você sorteia 2 números.`);
    }
    const heroDraws = Array.from({ length: heroDrawsCount }, () => getRandomInt(1, currentEnemy.maxLife));

    const heroHits = heroDraws.filter((n) => n === enemySecret).length;

    roundLog.push(`HotDog sorteou [${heroDraws.join(", ")}].`);

    if (heroHits > 0) {
      let damage = enemySecret * heroHits;
      if (isSwordActive) {
        damage += 1;
      }
      if (isCombinedAttack) {
        damage += 1;
        roundLog.push(`Salsichinha ajuda no ataque! Dano bônus: +1`);
      }
      currentEnemy.currentLife -= damage;
      roundLog.push(`-> ACERTOU! Dano no inimigo: ${damage}`);
      setIsEnemyHit(true);
      setTimeout(() => setIsEnemyHit(false), 500);
    } else {
      roundLog.push(`-> Errou (Número secreto Inimigo: ${enemySecret}).`);
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
      setIsHeroHit(true);
      setTimeout(() => setIsHeroHit(false), 500);
    } else {
      roundLog.push(`-> Inimigo errou (Meu número secreto: ${heroSecret}).`);
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
    <main className="flex min-h-screen w-full items-center justify-center p-4 font-mono md:p-8">
      <div className="flex w-full max-w-7xl items-start justify-center gap-8">
        {/* Coluna de Itens (Esquerda) - Visível em telas grandes */}
        {!isBattleOver && (
          <div className="hidden w-48 flex-col items-center gap-4 pt-24 lg:flex">
            <h3 className="mb-2 text-xl font-bold text-gray-400">Itens</h3>
            {heroOwnedItems.map(item => {
              const isActive = activeItems.has(item.id);
              return (
                <div key={item.id} className="flex flex-col items-center justify-center gap-1">
                  <button
                    onClick={() => toggleItem(item.id)}
                    aria-pressed={isActive}
                    className={`group flex h-40 w-40 transform flex-col cursor-pointer items-center justify-center rounded-xl border-4 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 ${isActive
                      ? "border-yellow-400 bg-yellow-900/30 shadow-[0_0_20px_rgba(250,204,21,0.5)]"
                      : "border-gray-700 bg-gray-900/50 hover:border-gray-500"
                      }`}
                  >
                    <Image
                      src={item.imageSrc}
                      alt={item.name}
                      width={60}
                      height={60}
                      className={`transition-all duration-300 ${!isActive ? "grayscale opacity-60" : ""}`}
                    />
                    <span className="text-sm font-semibold">{item.name}</span>
                  </button>
                  <p className={`h-10 w-40 mb-1 text-center text-sm font-semibold transition-colors duration-300 ${isActive ? "text-yellow-400" : "text-gray-400"}`}>
                    {isActive ? item.activeText : item.description}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {/* Área Principal da Batalha (Centralizada) */}
        <div className="flex w-full max-w-4xl shrink-0 flex-col items-center">
          <h1 className="mb-8 text-4xl font-bold">Batalha!</h1>
          <div className="mb-8 grid w-full grid-cols-1 gap-8 md:grid-cols-2">
            {/* Card do HotDog */}
            <div className={`rounded-lg border-2 border-blue-500 p-4 transition-all duration-300 ${isHeroHit ? "scale-95 bg-red-900/50" : ""}`}>
              <h2 className="text-2xl font-semibold text-blue-400">{hero.name}</h2>
              <p>HP: {hero.currentLife} / {hero.maxLife}</p>
              <p className="text-sm text-gray-400">Número secreto: {heroSecret}</p>
              <div className="mt-2 h-4 w-full rounded-full bg-gray-700">
                <div className="h-4 rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${(hero.currentLife / hero.maxLife) * 100}%` }}></div>
              </div>
            </div>
            {/* Card do Inimigo */}
            <div className={`rounded-lg border-2 border-red-500 p-4 transition-all duration-300 ${isEnemyHit ? "scale-95 bg-red-900/50" : ""}`}>
              <h2 className="text-2xl font-semibold text-red-400">{enemy?.name}</h2>
              <p>HP: {enemy?.currentLife} / {enemy?.maxLife}</p>
              <p className="text-sm text-gray-400">Número secreto: {enemySecret}</p>
              <div className="mt-2 h-4 w-full rounded-full bg-gray-700">
                <div className="h-4 rounded-full bg-red-500 transition-all duration-500" style={{ width: `${enemy ? (enemy.currentLife / enemy.maxLife) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>

          {/* Log da Batalha */}
          <div
            ref={logContainerRef}
            className="mb-8 h-48 w-full max-w-4xl overflow-y-auto rounded-lg border border-gray-700 bg-gray-900/50 p-4"
          >
            {battleLog.map((line, index) => (
              <p key={index} className="text-gray-300">{`> ${line}`}</p>
            ))}
          </div>

          {/* Controles da Batalha */}
          <div className="w-full max-w-4xl">
            {!isBattleOver ? (
              <div className="flex w-full flex-col gap-4">
                {/* Itens ativáveis em telas pequenas */}
                <div className="flex flex-col items-center justify-center gap-4 lg:hidden">
                  <h3 className="mb-2 text-xl font-bold text-gray-400">Itens</h3>
                  <div className="flex flex-row flex-wrap justify-center gap-4">
                    {heroOwnedItems.map(item => {
                      const isActive = activeItems.has(item.id);
                      return (
                        <div key={item.id} className="flex flex-col items-center justify-center gap-1">
                          <button
                            onClick={() => toggleItem(item.id)}
                            aria-pressed={isActive}
                            className={`group flex h-24 w-24 transform flex-col items-center justify-center gap-1 rounded-xl border-2 p-2 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 ${isActive
                              ? "border-yellow-400 bg-yellow-900/30"
                              : "border-gray-700 bg-gray-900/50"
                              }`}
                          >
                            <Image src={item.imageSrc} alt={item.name} width={40} height={40} className={`transition-all duration-300 ${!isActive ? "grayscale opacity-60" : ""}`} />
                            <span className="text-xs font-semibold">{item.name}</span>
                          </button>
                          <p className={`h-5 text-center text-xs font-semibold transition-colors duration-300 ${isActive ? "text-yellow-400" : "text-gray-400"}`}>
                            {isActive ? "Ativado" : "Desativado"}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <button onClick={handleRound} className="w-full rounded-lg bg-yellow-500 py-3 px-6 text-xl font-bold text-black transition-colors hover:bg-yellow-400">
                  Atacar / Próxima Rodada
                </button>
                <button onClick={handleGiveUp} className="w-full rounded-lg border border-red-500 bg-red-600/80 py-3 px-6 text-xl font-bold text-white transition-colors hover:bg-red-600">
                  Desistir da Missão
                </button>
              </div>
            ) : (
              <BattleResult
                isVictory={isVictory || false}
                onContinue={onContinue}
                victoryText={victoryText}
                defeatText={defeatText}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}