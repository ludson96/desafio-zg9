"use client";

import { useState, useEffect, useCallback } from "react";
import { FLORESTA } from "@/data/dialogueData";
import { ENEMIES } from "@/data/enemies";
import Battle from "@/components/Battle";

export default function Floresta() {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isInBattle, setIsInBattle] = useState(false);

  const handleAdvance = useCallback(() => {
    // Se for o último diálogo, a próxima interação inicia a batalha
    if (dialogueIndex >= FLORESTA.length - 1) {
      setIsInBattle(true);
    } else {
      // Caso contrário, avança para o próximo diálogo
      setDialogueIndex((prevIndex) => prevIndex + 1);
    }
  }, [dialogueIndex]);

  useEffect(() => {
    // Não adiciona os listeners se já estiver em batalha
    if (isInBattle) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleAdvance();
      }
    };

    // Adiciona os listeners de eventos
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleAdvance);

    // Limpa os listeners quando o componente é desmontado ou a batalha começa
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleAdvance);
    };
  }, [handleAdvance, isInBattle]);

  // Se estiver em batalha, renderiza o componente de Batalha
  if (isInBattle) {
    return <Battle enemy={ENEMIES.ANTI_AUTHORIZATUS} />;
  }

  const isLastDialogue = dialogueIndex === FLORESTA.length - 1;

  // Renderiza a tela de diálogo
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 cursor-pointer font-mono">
      <div className="w-full max-w-4xl text-center text-2xl leading-relaxed">
        <p dangerouslySetInnerHTML={{ __html: FLORESTA[dialogueIndex] }} />
      </div>
      <div className="absolute bottom-10 text-lg text-gray-400 animate-pulse">
        {isLastDialogue
          ? "Pressione Enter ou clique para iniciar a batalha..."
          : "Pressione Enter ou clique para continuar..."}
      </div>
    </main>
  );
}