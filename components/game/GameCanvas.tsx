"use client";

import { useEffect, useRef } from "react";

import { GameWorld } from "@/lib/game/engine/GameWorld";
import { useGameStore } from "@/lib/game/store/gameStore";

export function GameCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<GameWorld | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const world = new GameWorld(host, {
      onCanLandChange: (canLand) => useGameStore.getState().setCanLand(canLand),
      onLandRequest: () => useGameStore.getState().landAtStation(),
      onFuelConsume: (amount) => useGameStore.getState().consumeFuel(amount),
      isPaused: () => useGameStore.getState().showStationMenu,
    });

    worldRef.current = world;
    void world.init();

    return () => {
      world.destroy();
      worldRef.current = null;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = useGameStore.subscribe((state, previous) => {
      if (state.showStationMenu !== previous.showStationMenu) {
        worldRef.current?.setPaused(state.showStationMenu);
      }
    });

    return unsubscribe;
  }, []);

  return <div ref={hostRef} className="h-full w-full touch-none" />;
}
