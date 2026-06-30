"use client";

import { GameCanvas } from "@/components/game/GameCanvas";
import { GameHUD } from "@/components/game/GameHUD";
import { StationPanel } from "@/components/game/StationPanel";
import { useGameStore } from "@/lib/game/store/gameStore";

export default function GameShell() {
  const showStationMenu = useGameStore((state) => state.showStationMenu);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#0d0d26]">
      <GameCanvas />
      {!showStationMenu && <GameHUD />}
      {showStationMenu && <StationPanel />}
    </div>
  );
}
