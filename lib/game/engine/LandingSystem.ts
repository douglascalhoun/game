import type { Vector2 } from "./ShipPhysics";

export function getLandingDistance(
  playerPosition: Vector2,
  stationPosition: Vector2,
): number {
  return Math.hypot(
    playerPosition.x - stationPosition.x,
    playerPosition.y - stationPosition.y,
  );
}

export function isWithinLandingRange(
  playerPosition: Vector2,
  stationPosition: Vector2,
  landingRadius: number,
): boolean {
  return getLandingDistance(playerPosition, stationPosition) < landingRadius;
}
