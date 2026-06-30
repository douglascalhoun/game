export const COMBAT = {
  hullPoints: 3,
  shipHitRadius: 14,
  projectileHitRadius: 5,
  player: {
    fireCooldown: 1.0,
    projectileSpeed: 160,
    damage: 1,
    spread: 0,
  },
  enemy: {
    maxSpeed: 390,
    acceleration: 190,
    turnRate: 3.8,
    fireCooldown: 0.32,
    projectileSpeed: 130,
    damage: 1,
    spread: 0.42,
    spawnPosition: { x: -320, y: -220 },
  },
} as const;

export type ProjectileOwner = "player" | "enemy";

export interface Projectile {
  id: number;
  owner: ProjectileOwner;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  ttl: number;
}

export function getForwardVector(rotation: number) {
  return {
    x: -Math.sin(rotation),
    y: Math.cos(rotation),
  };
}

export function distanceBetween(
  a: { x: number; y: number },
  b: { x: number; y: number },
) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
