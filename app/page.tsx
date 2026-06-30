import Link from "next/link";

import { ControlsHelp } from "@/components/game/ControlsHelp";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col bg-gradient-to-b from-[#050514] via-[#0a0a20] to-[#111133] text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-10 px-6 py-16">
        <section className="space-y-6 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-400/80">
            Fan Remake
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Nova Web
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            A browser-based tribute to Escape Velocity Nova. Fly through the Sol
            system, dock at Space Station Alpha, and refuel before your next
            jump into the void.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/play">Play Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href="https://en.wikipedia.org/wiki/Escape_Velocity_Nova"
                target="_blank"
                rel="noreferrer"
              >
                About EV Nova
              </a>
            </Button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            title="Top-down flight"
            description="Newtonian thrust and turn physics inspired by the original EV feel."
          />
          <FeatureCard
            title="Station services"
            description="Land at the station, review your ship status, and refuel with credits."
          />
          <FeatureCard
            title="Runs in browser"
            description="No install required. Built with Next.js and PixiJS, deployed on Vercel."
          />
        </section>

        <ControlsHelp />

        <p className="text-center text-xs text-slate-500">
          Educational fan project. Escape Velocity Nova is a trademark of its
          respective owners. Not affiliated with Ambrosia Software.
        </p>
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
      <h2 className="font-semibold text-cyan-300">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}
