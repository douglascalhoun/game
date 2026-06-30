"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { REFUEL_COST_PER_UNIT } from "@/lib/game/data";
import { useGameStore } from "@/lib/game/store/gameStore";

export function StationPanel() {
  const stationName = useGameStore((state) => state.stationName);
  const departStation = useGameStore((state) => state.departStation);

  return (
    <div className="absolute inset-0 z-20 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <h2 className="text-xl font-bold text-white">{stationName}</h2>
          <button
            type="button"
            onClick={departStation}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close station menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <Tabs defaultValue="info" className="px-5 pb-5 pt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="refuel">Refuel</TabsTrigger>
            <TabsTrigger value="trade">Trade</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <InfoTab />
          </TabsContent>
          <TabsContent value="refuel">
            <RefuelTab />
          </TabsContent>
          <TabsContent value="trade">
            <TradeTab />
          </TabsContent>
        </Tabs>

        <div className="border-t border-slate-800 p-5">
          <Button className="w-full" size="lg" onClick={departStation}>
            Depart Station
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoTab() {
  const currentSystem = useGameStore((state) => state.currentSystem);
  const credits = useGameStore((state) => state.credits);
  const cargoUsed = useGameStore((state) => state.cargoUsed);
  const cargoCapacity = useGameStore((state) => state.cargoCapacity);

  return (
    <div className="space-y-4 text-slate-200">
      <div>
        <h3 className="font-semibold text-white">
          Welcome to Space Station Alpha!
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          This station offers basic services including refueling and commodity
          trading.
        </p>
      </div>
      <div className="space-y-2 rounded-lg bg-slate-900 p-4 text-sm">
        <InfoRow label="System" value={currentSystem} />
        <InfoRow label="Your Credits" value={credits.toLocaleString()} />
        <InfoRow
          label="Cargo"
          value={`${cargoUsed} / ${cargoCapacity} tons`}
        />
      </div>
    </div>
  );
}

function RefuelTab() {
  const fuel = useGameStore((state) => state.fuel);
  const credits = useGameStore((state) => state.credits);
  const refuel = useGameStore((state) => state.refuel);
  const getRefuelCost = useGameStore((state) => state.getRefuelCost);

  const fuelNeeded = Math.max(0, 100 - Math.floor(fuel));
  const cost = getRefuelCost();
  const canAfford = credits >= cost;

  return (
    <div className="space-y-4 text-slate-200">
      <h3 className="font-semibold text-white">Fuel Status</h3>
      <div className="flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-sm">
        <span>Current Fuel</span>
        <span className="font-semibold">{Math.floor(fuel)}%</span>
      </div>

      {fuel < 100 ? (
        <div className="space-y-3 rounded-lg bg-slate-900 p-4 text-center">
          <p className="text-sm text-slate-400">
            Refuel to 100% ({fuelNeeded} units)
          </p>
          <p className="text-2xl font-bold text-white">
            Cost: {cost} credits
          </p>
          <p className="text-xs text-slate-500">
            {REFUEL_COST_PER_UNIT} credits per fuel unit
          </p>
          <Button
            className="w-full"
            variant={canAfford ? "default" : "secondary"}
            disabled={!canAfford}
            onClick={() => refuel()}
          >
            {canAfford ? "Refuel" : "Not Enough Credits"}
          </Button>
        </div>
      ) : (
        <p className="rounded-lg bg-emerald-950/40 px-4 py-6 text-center font-medium text-emerald-300">
          Your tanks are full!
        </p>
      )}
    </div>
  );
}

function TradeTab() {
  return (
    <div className="space-y-3 py-8 text-center text-slate-200">
      <h3 className="font-semibold text-white">Commodity Trading</h3>
      <p className="text-sm text-slate-400">
        Trading system coming in Phase 4!
      </p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
