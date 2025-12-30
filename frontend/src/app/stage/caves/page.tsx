"use client";

import { useState, useEffect, useCallback } from "react";
import Battle from "@/components/Battle";
import { ENEMIES } from "@/data/enemiesData";
import { CAVES, CAVES_BEFORE_BATTLE, CAVES_RIDDLE } from "@/data/dialogueData";
import { useGameStore } from "@/stores/useGameStore";
import { HotDog } from "@/types/hotdog";

export default function CavesPage() {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [stagePhase, setStagePhase] = useState<'dialogue' | 'riddle' | 'pre-battle' | 'battle'>('dialogue');
  const [battleEnemy, setBattleEnemy] = useState(ENEMIES.GLOZIUM_ADMINISTRATUS);
  const [riddleFeedback, setRiddleFeedback] = useState<string | null>(null);

  const { hero, setHero } = useGameStore();

  const handleAdvanceDialogue = useCallback(() => {
    if (stagePhase === 'dialogue') {
      if (dialogueIndex >= CAVES.length - 1) {
        setStagePhase('riddle');
      } else {
        setDialogueIndex((prevIndex) => prevIndex + 1);
      }
    } else if (stagePhase === 'pre-battle') {
      if (dialogueIndex >= CAVES_BEFORE_BATTLE.length - 1) {
        setStagePhase('battle');
      } else {
        setDialogueIndex((prevIndex) => prevIndex + 1);
      }
    }
  }, [dialogueIndex, stagePhase]);

  useEffect(() => {
    if (stagePhase !== 'dialogue' && stagePhase !== 'pre-battle') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleAdvanceDialogue();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleAdvanceDialogue);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleAdvanceDialogue);
    };
  }, [handleAdvanceDialogue, stagePhase]);

  const handleRiddleAnswer = (option: typeof CAVES_RIDDLE.options[0]) => {
    setRiddleFeedback(option.message);

    if (option.consequence === 'damage') {
      setHero({ ...hero, currentLife: Math.max(0, hero.currentLife - 2) });
    } else if (option.consequence === 'buff') {
      setBattleEnemy(prev => ({
        ...prev,
        maxLife: prev.maxLife + 6,
        currentLife: prev.maxLife + 6,
      }));
    }

    setTimeout(() => {
      setStagePhase('pre-battle');
      setDialogueIndex(0);
    }, 6000);
  };

  const victoryText = "Ansião faturador - muito obrigado, mas tô ocupado demais para agradecimentos longos, tome o artefato sagrado e siga em frente.";
  const defeatText = "Ansião faturador - herói merda, nem para cumprir o trabalho dele, estamos perdidos. <br /> <br /> O mundo foi destruído por Glozium, uma fatalidade terrível... Fim de jogo!";

  const handleBattleVictory = (hero: HotDog) => {
    const currentItems = hero.items || [];
    if (!currentItems.includes('guia-atendimento')) {
      return {
        ...hero,
        items: [...currentItems, 'guia-atendimento']
      };
    }
    return hero;
  };

  if (stagePhase === 'battle') {
    return <Battle enemy={battleEnemy} victoryText={victoryText} defeatText={defeatText} onVictory={handleBattleVictory} />;
  }

  if (stagePhase === 'riddle') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 font-mono">
        <div className="w-full max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-yellow-300">Enigma da Caverna</h2>
          <p className="mb-8 text-2xl italic leading-relaxed" dangerouslySetInnerHTML={{ __html: `“${CAVES_RIDDLE.question}”` }} />

          {riddleFeedback ? (
            <div className="mt-8 animate-pulse text-xl text-yellow-400">
              <p>{riddleFeedback}</p>
            </div>
          ) : (
            <div className="mt-8 flex w-full max-w-2xl flex-col items-center gap-4">
              {CAVES_RIDDLE.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleRiddleAnswer(option)}
                  className="w-full rounded-lg border-2 border-gray-600 bg-gray-800/50 p-4 text-left text-lg transition-all hover:border-yellow-500 hover:bg-gray-700/50"
                >
                  {String.fromCharCode(65 + index)}) {option.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }

  const currentDialogue = stagePhase === 'pre-battle' ? CAVES_BEFORE_BATTLE : CAVES;
  const isLastDialogue = dialogueIndex === currentDialogue.length - 1;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 cursor-pointer font-mono">
      <div className="w-full max-w-4xl text-center text-2xl leading-relaxed">
        <p dangerouslySetInnerHTML={{ __html: currentDialogue[dialogueIndex] }} />
      </div>
      <div className="absolute bottom-10 text-lg text-gray-400 animate-pulse">
        {isLastDialogue
          ? (stagePhase === 'pre-battle'
            ? "Pressione Enter ou clique para iniciar a batalha..."
            : "Pressione Enter ou clique para revelar o enigma...")
          : "Pressione Enter ou clique para continuar..."}
      </div>
    </main>
  );
}