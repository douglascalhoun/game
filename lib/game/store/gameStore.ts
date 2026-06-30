import { create } from "zustand";

import { COMBAT } from "../engine/CombatConfig";
import {
  REFUEL_COST_PER_UNIT,
  STARTING_CREDITS,
  playerShip,
  solSystem,
} from "../data";

interface GameStore {
  credits: number;
  currentSystem: string;
  showStationMenu: boolean;
  playerShield: number;
  playerArmor: number;
  playerHull: number;
  enemyHull: number | null;
  enemyDestroyed: boolean;
  combatStatus: string;
  fuel: number;
  cargoUsed: number;
  cargoCapacity: number;
  canLand: boolean;
  stationName: string;
  landAtStation: () => void;
  departStation: () => void;
  setCanLand: (canLand: boolean) => void;
  consumeFuel: (amount: number) => void;
  setPlayerHull: (hull: number) => void;
  setEnemyHull: (hull: number | null) => void;
  setEnemyDestroyed: () => void;
  refuel: () => boolean;
  getRefuelCost: () => number;
}

export const useGameStore = create<GameStore>((set, get) => ({
  credits: STARTING_CREDITS,
  currentSystem: solSystem.name,
  showStationMenu: false,
  playerShield: playerShip.maxShield,
  playerArmor: playerShip.maxArmor,
  playerHull: COMBAT.hullPoints,
  enemyHull: COMBAT.hullPoints,
  enemyDestroyed: false,
  combatStatus: "Pirate harasser detected",
  fuel: 100,
  cargoUsed: 0,
  cargoCapacity: playerShip.cargoSpace,
  canLand: false,
  stationName: solSystem.stations[0]?.name ?? "Station",
  landAtStation: () => set({ showStationMenu: true }),
  departStation: () => set({ showStationMenu: false }),
  setCanLand: (canLand) => set({ canLand }),
  consumeFuel: (amount) =>
    set((state) => ({ fuel: Math.max(0, state.fuel - amount) })),
  setPlayerHull: (hull) =>
    set({
      playerHull: hull,
      combatStatus:
        hull <= 0
          ? "Ship disabled — return to station"
          : `Hull integrity: ${hull}/${COMBAT.hullPoints}`,
    }),
  setEnemyHull: (hull) =>
    set({
      enemyHull: hull,
      combatStatus:
        hull === null
          ? get().combatStatus
          : hull === 1
            ? "Enemy is fleeing on one hit point"
            : `Enemy hull: ${hull}/${COMBAT.hullPoints}`,
    }),
  setEnemyDestroyed: () =>
    set({
      enemyHull: null,
      enemyDestroyed: true,
      combatStatus: "Target destroyed",
    }),
  getRefuelCost: () => {
    const fuelNeeded = 100 - Math.floor(get().fuel);
    return fuelNeeded * REFUEL_COST_PER_UNIT;
  },
  refuel: () => {
    const state = get();
    const fuelNeeded = 100 - state.fuel;
    if (fuelNeeded <= 0) return true;

    const cost = Math.ceil(fuelNeeded) * REFUEL_COST_PER_UNIT;
    if (state.credits < cost) return false;

    set({
      credits: state.credits - cost,
      fuel: 100,
    });
    return true;
  },
}));
