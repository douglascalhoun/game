"use client";

import Link from "next/link";

import { playerShip } from "@/lib/game/data";
import { useGameStore } from "@/lib/game/store/gameStore";

export function GameHUD() {
  const credits = useGameStore((state) => state.credits);
  const fuel = useGameStore((state) => state.fuel);
  const playerShield = useGameStore((state) => state.playerShield);
  const playerArmor = useGameStore((state) => state.playerArmor);
  const canLand = useGameStore((state) => state.canLand);
  const currentSystem = useGameStore((state) => state.currentSystem);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-lg border border-cyan-500/30 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 backdrop-blur">
          <p className="font-semibold text-cyan-300">{currentSystem} System</p>
          <div className="mt-2 grid gap-1">
            <StatRow label="Credits" value={credits.toLocaleString()} />
            <StatRow label="Fuel" value={`${Math.floor(fuel)}%`} />
            <StatRow label="Shields" value={`${Math.floor(playerShield)}%`} />
            <StatRow label="Armor" value={`${Math.floor(playerArmor)}%`} />
          </div>
        </div>

        <Link
          href="/"
          className="pointer-events-auto rounded-md border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-200 backdrop-blur hover:bg-slate-800"
        >
          Exit
        </Link>
      </div>

      <div className="mx-auto max-w-xl rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 text-center text-sm text-slate-200 backdrop-blur">
        {canLand ? (
          <p className="font-medium text-cyan-300">
            In docking range — press <kbd className="rounded bg-slate-800 px-1">L</kbd>{" "}
            or click the station to land
          </p>
        ) : (
          <p>
            Fly toward the station. Thrust with{" "}
            <kbd className="rounded bg-slate-800 px-1">W</kbd> / click, turn with{" "}
            <kbd className="rounded bg-slate-800 px-1">A</kbd>
            <kbd className="rounded bg-slate-800 px-1">D</kbd>
          </p>
        )}
        <p className="mt-1 text-xs text-slate-400">
          {playerShip.name} — max speed {playerShip.maxSpeed}
        </p>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
