"use client";

import dynamic from "next/dynamic";

const GameShell = dynamic(() => import("@/components/game/GameShell"), {
  ssr: false,
  loading: () => (
    <div className="flex h-dvh items-center justify-center bg-[#0d0d26] text-cyan-300">
      Initializing ship systems...
    </div>
  ),
});

export default function PlayPage() {
  return <GameShell />;
}
