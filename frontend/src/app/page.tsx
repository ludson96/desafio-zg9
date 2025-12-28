"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PROLOGO } from "../data/dialogueData";

export default function Home() {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const router = useRouter();

  const handleAdvanceDialogue = useCallback(() => {
    // Se for o último diálogo, navega para o menu na próxima interação
    if (dialogueIndex >= PROLOGO.length - 1) {
      router.push("/menu");
    } else {
      // Caso contrário, avança para o próximo diálogo
      setDialogueIndex((prevIndex) => prevIndex + 1);
    }
  }, [dialogueIndex, router]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleAdvanceDialogue();
      }
    };

    // Adiciona os listeners de eventos
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleAdvanceDialogue);

    // Limpa os listeners quando o componente é desmontado
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleAdvanceDialogue);
    };
  }, [handleAdvanceDialogue]);

  const isLastDialogue = dialogueIndex === PROLOGO.length - 1;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 cursor-pointer font-mono">
      <div className="w-full max-w-4xl text-center text-2xl leading-relaxed">
        <p dangerouslySetInnerHTML={{ __html: PROLOGO[dialogueIndex] }} />
      </div>
      {!isLastDialogue && (
        <div className="absolute bottom-10 text-lg text-gray-400 animate-pulse">
          Pressione Enter ou clique para continuar...
        </div>
      )}
    </main>
  );
}
