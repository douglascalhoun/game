# Nova Web — Escape Velocity Nova Fan Remake

A browser-based tribute to **Escape Velocity Nova**, built with Next.js, PixiJS, and React. Fly through the Sol system, dock at Space Station Alpha, and manage fuel and credits.

## Play Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **Play Now**.

## Controls

| Input | Action |
| --- | --- |
| `W` / click + hold | Thrust |
| `A` / `D` | Turn |
| `Space` | Fire blaster (1/sec) |
| `L` | Land (when in docking range) |

## Tech Stack

- **Next.js 16** — App Router, Vercel deployment
- **PixiJS 8** — Real-time space rendering
- **React + Tailwind** — Station menus and HUD
- **Zustand** — Game/UI state bridge

## Project Structure

```
app/                 # Routes (/ landing, /play game)
components/game/     # Canvas, HUD, station UI
lib/game/engine/     # Physics, input, Pixi game world
lib/game/data/       # JSON game content (systems, ships)
```

## Deploy on Vercel

1. Push this repository to GitHub.
2. Import the project in the [Vercel dashboard](https://vercel.com/new).
3. Use the default Next.js build settings (`next build`).

No environment variables are required for Phase 1.

## Roadmap

- **Phase 1** — Flight, docking, refuel (current)
- **Phase 2** — Combat and NPCs
- **Phase 3** — Multi-system hyperjump
- **Phase 4** — Commodity trading
- **Phase 5** — Missions and save export

## License

Educational fan project. Escape Velocity Nova is originally by Ambrosia Software.
