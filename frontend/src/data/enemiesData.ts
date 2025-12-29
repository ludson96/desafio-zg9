import { Enemy } from "@/types/enemies";

export const ENEMIES: { [key: string]: Enemy } = {
  ANTI_AUTHORIZATUS: {
    id: "ANTI_AUTHORIZATUS",
    name: "Anti-Authorizatus",
    maxLife: 3,
    currentLife: 3, 
    numberOfDraws: 1,
    isBoss: false,
  },
    GLOZIUM_ADMINISTRATUS: {
    id: "GLOZIUM_ADMINISTRATUS",
    name: "Glozium-Administratus",
    maxLife: 6,
    currentLife: 6,
    numberOfDraws: 2, 
    isBoss: false,
  },
};