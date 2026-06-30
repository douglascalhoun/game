import { Container, Graphics } from "pixi.js";

import { COMBAT, type Projectile } from "./CombatConfig";
import {
  createProjectileGraphic,
  createShipGraphic,
  flashGraphic,
} from "./ShipGraphics";
import {
  createPhysicsState,
  getForwardThrustAngle,
  updateShipPhysics,
  type ShipPhysicsState,
} from "./ShipPhysics";

type EnemyBehavior = "harass" | "flee";

export interface CombatCallbacks {
  onPlayerHullChange: (hull: number) => void;
  onEnemyHullChange: (hull: number | null) => void;
  onEnemyDestroyed: () => void;
}

interface EnemyState {
  physics: ShipPhysicsState;
  hull: number;
  behavior: EnemyBehavior;
  fireCooldown: number;
  passSide: 1 | -1;
  barrageTimer: number;
  container: Container;
  graphic: Graphics;
  alive: boolean;
}

export class CombatManager {
  private projectiles: Projectile[] = [];
  private projectileGraphics = new Map<number, Graphics>();
  private nextProjectileId = 1;
  private projectilesContainer: Container;
  private playerFireCooldown = 0;
  private playerHull = COMBAT.hullPoints;
  private enemy: EnemyState;
  private callbacks: CombatCallbacks;

  constructor(callbacks: CombatCallbacks) {
    this.callbacks = callbacks;
    this.projectilesContainer = new Container();

    const enemyContainer = new Container();
    const enemyGraphic = createShipGraphic(0xff4466, 0xffaaaa);
    enemyContainer.addChild(enemyGraphic);
    enemyContainer.position.set(
      COMBAT.enemy.spawnPosition.x,
      COMBAT.enemy.spawnPosition.y,
    );

    this.enemy = {
      physics: createPhysicsState(COMBAT.enemy.spawnPosition),
      hull: COMBAT.hullPoints,
      behavior: "harass",
      fireCooldown: 0.5,
      passSide: 1,
      barrageTimer: 0,
      container: enemyContainer,
      graphic: enemyGraphic,
      alive: true,
    };

    this.callbacks.onPlayerHullChange(this.playerHull);
    this.callbacks.onEnemyHullChange(this.enemy.hull);
  }

  mount(worldContainer: Container) {
    worldContainer.addChild(this.enemy.container);
    worldContainer.addChild(this.projectilesContainer);
  }

  destroy() {
    for (const graphic of this.projectileGraphics.values()) {
      graphic.destroy();
    }
    this.projectileGraphics.clear();
    this.projectilesContainer.destroy({ children: true });
    this.enemy.container.destroy({ children: true });
  }

  getPlayerHull() {
    return this.playerHull;
  }

  getEnemyHull() {
    return this.enemy.alive ? this.enemy.hull : null;
  }

  update(
    deltaTime: number,
    playerPhysics: ShipPhysicsState,
    playerGraphic: Graphics,
    wantsFire: boolean,
  ) {
    this.updatePlayerWeapon(deltaTime, playerPhysics, wantsFire);
    this.updateEnemy(deltaTime, playerPhysics);
    this.updateProjectiles(deltaTime);
    this.resolveCollisions(playerPhysics, playerGraphic);
    this.syncEnemyTransform();
  }

  private updatePlayerWeapon(
    deltaTime: number,
    playerPhysics: ShipPhysicsState,
    wantsFire: boolean,
  ) {
    this.playerFireCooldown = Math.max(0, this.playerFireCooldown - deltaTime);
    if (!wantsFire || this.playerFireCooldown > 0) return;

    this.playerFireCooldown = COMBAT.player.fireCooldown;
    this.addProjectile(
      "player",
      playerPhysics.position.x,
      playerPhysics.position.y,
      playerPhysics.rotation,
      COMBAT.player.projectileSpeed,
      COMBAT.player.damage,
      COMBAT.player.spread,
    );
  }

  private updateEnemy(deltaTime: number, playerPhysics: ShipPhysicsState) {
    if (!this.enemy.alive) return;

    if (this.enemy.hull <= 1 && this.enemy.behavior !== "flee") {
      this.enemy.behavior = "flee";
    }

    const input =
      this.enemy.behavior === "flee"
        ? this.getFleeInput(playerPhysics)
        : this.getHarassInput(playerPhysics);

    this.enemy.physics = updateShipPhysics(
      this.enemy.physics,
      {
        maxSpeed: COMBAT.enemy.maxSpeed,
        acceleration: COMBAT.enemy.acceleration,
        turnRate: COMBAT.enemy.turnRate,
      },
      input,
      deltaTime,
    );

    this.enemy.fireCooldown = Math.max(0, this.enemy.fireCooldown - deltaTime);
    this.enemy.barrageTimer = Math.max(0, this.enemy.barrageTimer - deltaTime);

    const distance = Math.hypot(
      playerPhysics.position.x - this.enemy.physics.position.x,
      playerPhysics.position.y - this.enemy.physics.position.y,
    );

    if (
      this.enemy.behavior === "harass" &&
      distance < 520 &&
      this.enemy.fireCooldown <= 0
    ) {
      this.enemy.fireCooldown = COMBAT.enemy.fireCooldown;
      this.enemy.barrageTimer = 1.4;
      this.addProjectile(
        "enemy",
        this.enemy.physics.position.x,
        this.enemy.physics.position.y,
        this.enemy.physics.rotation,
        COMBAT.enemy.projectileSpeed,
        COMBAT.enemy.damage,
        COMBAT.enemy.spread,
      );
    }

    if (
      this.enemy.behavior === "harass" &&
      this.enemy.barrageTimer > 0 &&
      this.enemy.fireCooldown <= 0 &&
      distance < 560
    ) {
      this.enemy.fireCooldown = COMBAT.enemy.fireCooldown;
      this.addProjectile(
        "enemy",
        this.enemy.physics.position.x,
        this.enemy.physics.position.y,
        this.enemy.physics.rotation,
        COMBAT.enemy.projectileSpeed,
        COMBAT.enemy.damage,
        COMBAT.enemy.spread,
      );
    }
  }

  private getHarassInput(playerPhysics: ShipPhysicsState) {
    const dx = playerPhysics.position.x - this.enemy.physics.position.x;
    const dy = playerPhysics.position.y - this.enemy.physics.position.y;
    const distance = Math.hypot(dx, dy);

    const passOffset = this.enemy.passSide * 160;
    const passTarget = {
      x: playerPhysics.position.x + passOffset - dy * 0.35,
      y: playerPhysics.position.y - dx * 0.35,
    };

    let targetAngle = getForwardThrustAngle(
      this.enemy.physics.position,
      passTarget,
    );

    if (distance < 140) {
      this.enemy.passSide = this.enemy.passSide === 1 ? -1 : 1;
    }

    const angleToPlayer = Math.atan2(dy, dx) - Math.PI / 2;
    const angleDiff = Math.abs(
      Math.atan2(
        Math.sin(angleToPlayer - this.enemy.physics.rotation),
        Math.cos(angleToPlayer - this.enemy.physics.rotation),
      ),
    );

    const thrusting = distance > 90 && (angleDiff < 1.1 || distance < 320);

    if (distance < 260 && angleDiff < 0.9) {
      targetAngle = angleToPlayer + this.enemy.passSide * 0.55;
    }

    return { targetAngle, thrusting };
  }

  private getFleeInput(playerPhysics: ShipPhysicsState) {
    const dx = this.enemy.physics.position.x - playerPhysics.position.x;
    const dy = this.enemy.physics.position.y - playerPhysics.position.y;
    const fleeTarget = {
      x: this.enemy.physics.position.x + dx,
      y: this.enemy.physics.position.y + dy,
    };

    return {
      targetAngle: getForwardThrustAngle(this.enemy.physics.position, fleeTarget),
      thrusting: true,
    };
  }

  private addProjectile(
    owner: Projectile["owner"],
    x: number,
    y: number,
    rotation: number,
    speed: number,
    damage: number,
    spread: number,
  ) {
    const angle = rotation + (Math.random() * 2 - 1) * spread;
    const direction = {
      x: -Math.sin(angle),
      y: Math.cos(angle),
    };

    const projectile: Projectile = {
      id: this.nextProjectileId++,
      owner,
      x: x + direction.x * 18,
      y: y + direction.y * 18,
      vx: direction.x * speed,
      vy: direction.y * speed,
      damage,
      ttl: 4,
    };

    this.projectiles.push(projectile);

    const color = owner === "player" ? 0x66ccff : 0xff8844;
    const graphic = createProjectileGraphic(color);
    graphic.position.set(projectile.x, projectile.y);
    this.projectilesContainer.addChild(graphic);
    this.projectileGraphics.set(projectile.id, graphic);
  }

  private updateProjectiles(deltaTime: number) {
    this.projectiles = this.projectiles.filter((projectile) => {
      projectile.x += projectile.vx * deltaTime;
      projectile.y += projectile.vy * deltaTime;
      projectile.ttl -= deltaTime;

      const graphic = this.projectileGraphics.get(projectile.id);
      if (graphic) {
        graphic.position.set(projectile.x, projectile.y);
      }

      if (projectile.ttl <= 0) {
        graphic?.destroy();
        this.projectileGraphics.delete(projectile.id);
        return false;
      }

      return true;
    });
  }

  private resolveCollisions(
    playerPhysics: ShipPhysicsState,
    playerGraphic: Graphics,
  ) {
    this.projectiles = this.projectiles.filter((projectile) => {
      const graphic = this.projectileGraphics.get(projectile.id);

      if (projectile.owner === "player" && this.enemy.alive) {
        const hitEnemy =
          Math.hypot(
            projectile.x - this.enemy.physics.position.x,
            projectile.y - this.enemy.physics.position.y,
          ) < COMBAT.shipHitRadius + COMBAT.projectileHitRadius;

        if (hitEnemy) {
          this.damageEnemy();
          graphic?.destroy();
          this.projectileGraphics.delete(projectile.id);
          return false;
        }
      }

      if (projectile.owner === "enemy" && this.playerHull > 0) {
        const hitPlayer =
          Math.hypot(
            projectile.x - playerPhysics.position.x,
            projectile.y - playerPhysics.position.y,
          ) < COMBAT.shipHitRadius + COMBAT.projectileHitRadius;

        if (hitPlayer) {
          this.damagePlayer(playerGraphic);
          graphic?.destroy();
          this.projectileGraphics.delete(projectile.id);
          return false;
        }
      }

      return true;
    });
  }

  private damageEnemy() {
    if (!this.enemy.alive) return;
    this.enemy.hull -= 1;
    flashGraphic(this.enemy.graphic, 0xffffff);

    if (this.enemy.hull <= 0) {
      this.enemy.alive = false;
      this.enemy.container.visible = false;
      this.callbacks.onEnemyHullChange(null);
      this.callbacks.onEnemyDestroyed();
      return;
    }

    this.callbacks.onEnemyHullChange(this.enemy.hull);
  }

  private damagePlayer(playerGraphic: Graphics) {
    if (this.playerHull <= 0) return;
    this.playerHull -= 1;
    flashGraphic(playerGraphic, 0xff6666);
    this.callbacks.onPlayerHullChange(this.playerHull);
  }

  private syncEnemyTransform() {
    if (!this.enemy.alive) return;
    this.enemy.container.position.set(
      this.enemy.physics.position.x,
      this.enemy.physics.position.y,
    );
    this.enemy.container.rotation = this.enemy.physics.rotation;
  }
}
