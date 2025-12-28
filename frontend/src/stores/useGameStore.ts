import { create } from 'zustand';
import { HotDog } from '@/types/hotdog';

interface GameState {
  hero: HotDog;
  setHero: (hero: HotDog) => void;
}

export const useGameStore = create<GameState>((set) => ({
  hero: {
    name: "Hot Dog",
    maxLife: 5,
    currentLife: 5,
    live: true
  },
  setHero: (hero) => set({ hero }),
}));