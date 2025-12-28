export type Enemy = {
  id: string; // Identificador único para a API (ex: "ANTI_AUTHORIZATUS")
  name: string;
  maxLife: number;
  currentLife: number;
  numberOfDraws: number;
  isBoss: boolean;
};

export const ENEMIES: { [key: string]: Enemy } = {
  ANTI_AUTHORIZATUS: {
    id: "ANTI_AUTHORIZATUS",
    name: "Anti-Authorizatus",
    maxLife: 200,
    currentLife: 200, // A vida atual será gerenciada pelo backend, mas é bom ter um valor inicial
    numberOfDraws: 0, // Este valor parece não ser usado no seu componente Battle
    isBoss: true,
  },
  // Outros inimigos podem ser adicionados aqui no futuro
};