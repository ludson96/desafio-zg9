import { Enemy } from "@/types/enemies";

export const ENEMIES: { [key: string]: Enemy } = {
  ANTI_AUTHORIZATUS: {
    id: "ANTI_AUTHORIZATUS",
    name: "Anti-Authorizatus",
    maxLife: 3,
    currentLife: 3, // A vida atual será gerenciada pelo backend, mas é bom ter um valor inicial
    numberOfDraws: 1, // Este valor parece não ser usado no seu componente Battle
    isBoss: true,
  },
  // Outros inimigos podem ser adicionados aqui no futuro
};