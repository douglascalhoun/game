import { Application, Container, Graphics } from "pixi.js";

import { playerShip, solSystem } from "../data";
import { InputManager } from "./InputManager";
import { isWithinLandingRange } from "./LandingSystem";
import {
  createPhysicsState,
  getForwardThrustAngle,
  updateShipPhysics,
  type ShipPhysicsState,
} from "./ShipPhysics";

export interface GameWorldCallbacks {
  onCanLandChange: (canLand: boolean) => void;
  onLandRequest: () => void;
  onFuelConsume: (amount: number) => void;
  isPaused: () => boolean;
}

export class GameWorld {
  private app: Application;
  private worldContainer: Container;
  private backgroundContainer: Container;
  private playerContainer: Container;
  private stationContainer: Container;
  private playerGraphics: Graphics;
  private engineGlow: Graphics;
  private stationGraphics: Graphics;
  private dockingRing: Graphics;
  private input: InputManager;
  private physics: ShipPhysicsState;
  private callbacks: GameWorldCallbacks;
  private canLand = false;
  private stationPulsing = false;
  private pointerWorldPosition = { x: 0, y: 0 };
  private resizeObserver: ResizeObserver | null = null;
  private host: HTMLElement;

  constructor(host: HTMLElement, callbacks: GameWorldCallbacks) {
    this.host = host;
    this.callbacks = callbacks;
    this.input = new InputManager();
    this.physics = createPhysicsState({ x: 300, y: 0 });
    this.app = new Application();
    this.worldContainer = new Container();
    this.backgroundContainer = new Container();
    this.playerContainer = new Container();
    this.stationContainer = new Container();
    this.playerGraphics = new Graphics();
    this.engineGlow = new Graphics();
    this.stationGraphics = new Graphics();
    this.dockingRing = new Graphics();
  }

  async init() {
    const { clientWidth, clientHeight } = this.host;

    await this.app.init({
      width: clientWidth,
      height: clientHeight,
      background: this.getBackgroundColor(),
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    this.host.appendChild(this.app.canvas);
    this.input.attach(this.app.canvas);

    this.setupBackground();
    this.setupStation();
    this.setupPlayer();

    this.worldContainer.addChild(this.backgroundContainer);
    this.worldContainer.addChild(this.stationContainer);
    this.worldContainer.addChild(this.playerContainer);
    this.app.stage.addChild(this.worldContainer);

    this.app.canvas.addEventListener("pointerdown", this.handlePointerDown);
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.host);
    this.handleResize();

    this.app.ticker.add(this.update);
    document.addEventListener("visibilitychange", this.handleVisibility);
  }

  destroy() {
    document.removeEventListener("visibilitychange", this.handleVisibility);
    this.app.canvas.removeEventListener("pointerdown", this.handlePointerDown);
    this.resizeObserver?.disconnect();
    this.input.detach();
    this.app.ticker.remove(this.update);
    this.app.destroy(true, { children: true });
    this.host.replaceChildren();
  }

  private getBackgroundColor() {
    const { r, g, b } = solSystem.backgroundColor;
    return (
      (Math.floor(r * 255) << 16) |
      (Math.floor(g * 255) << 8) |
      Math.floor(b * 255)
    );
  }

  private setupBackground() {
    for (let i = 0; i < 200; i += 1) {
      const star = new Graphics();
      const radius = 0.5 + Math.random() * 1.5;
      star.circle(0, 0, radius);
      star.fill({ color: 0xffffff, alpha: 0.3 + Math.random() * 0.7 });
      star.position.set(
        -2000 + Math.random() * 4000,
        -2000 + Math.random() * 4000,
      );
      this.backgroundContainer.addChild(star);
    }
  }

  private setupStation() {
    const station = solSystem.stations[0];

    this.stationGraphics.circle(0, 0, 40);
    this.stationGraphics.fill(0x808080);
    this.stationGraphics.stroke({ width: 3, color: 0xffffff });

    const innerCircle = new Graphics();
    innerCircle.circle(0, 0, 20);
    innerCircle.fill(0x404040);
    innerCircle.stroke({ width: 2, color: 0xb0b0b0 });

    this.dockingRing.circle(0, 0, 60);
    this.dockingRing.stroke({ width: 1, color: 0x00ffff, alpha: 0.3 });

    this.stationContainer.addChild(this.dockingRing);
    this.stationContainer.addChild(this.stationGraphics);
    this.stationContainer.addChild(innerCircle);
    this.stationContainer.position.set(station.position.x, station.position.y);
    this.stationContainer.eventMode = "static";
    this.stationContainer.cursor = "pointer";
    this.stationContainer.hitArea = { contains: () => true };
  }

  private setupPlayer() {
    this.playerGraphics.moveTo(0, 20);
    this.playerGraphics.lineTo(-10, -10);
    this.playerGraphics.lineTo(0, -5);
    this.playerGraphics.lineTo(10, -10);
    this.playerGraphics.closePath();
    this.playerGraphics.fill(0x00ffff);
    this.playerGraphics.stroke({ width: 2, color: 0xffffff });

    this.engineGlow.circle(0, 0, 5);
    this.engineGlow.fill({ color: 0xff8800, alpha: 0.7 });
    this.engineGlow.position.set(0, -8);

    this.playerContainer.addChild(this.engineGlow);
    this.playerContainer.addChild(this.playerGraphics);
    this.updatePlayerTransform();
  }

  private handleResize = () => {
    const { clientWidth, clientHeight } = this.host;
    if (clientWidth === 0 || clientHeight === 0) return;
    this.app.renderer.resize(clientWidth, clientHeight);
  };

  private handleVisibility = () => {
    if (document.hidden) {
      this.app.ticker.stop();
    } else if (!this.callbacks.isPaused()) {
      this.app.ticker.start();
    }
  };

  private handlePointerDown = (event: PointerEvent) => {
    if (!this.canLand || this.callbacks.isPaused()) return;

    const worldPosition = this.screenToWorld(event.clientX, event.clientY);

    const station = solSystem.stations[0];
    const distance = Math.hypot(
      worldPosition.x - station.position.x,
      worldPosition.y - station.position.y,
    );

    if (distance < 70) {
      this.callbacks.onLandRequest();
    }
  };

  private screenToWorld(screenX: number, screenY: number) {
    const rect = this.app.canvas.getBoundingClientRect();
    const localX = screenX - rect.left;
    const localY = screenY - rect.top;
    return {
      x: localX - this.worldContainer.x,
      y: localY - this.worldContainer.y,
    };
  }

  private update = () => {
    if (this.callbacks.isPaused()) {
      this.app.ticker.stop();
      return;
    }

    const deltaTime = this.app.ticker.deltaMS / 1000;
    const pointer = this.input.getPointerPosition();
    this.pointerWorldPosition = this.screenToWorld(
      pointer.x + this.app.canvas.getBoundingClientRect().left,
      pointer.y + this.app.canvas.getBoundingClientRect().top,
    );

    const input = this.getMovementInput();
    this.physics = updateShipPhysics(
      this.physics,
      {
        maxSpeed: playerShip.maxSpeed,
        acceleration: playerShip.acceleration,
        turnRate: playerShip.turnRate,
      },
      input,
      deltaTime,
    );

    if (input.thrusting) {
      this.callbacks.onFuelConsume(0.02);
      this.updateEngineEffects(true);
    } else {
      this.updateEngineEffects(false);
    }

    this.updatePlayerTransform();
    this.updateCamera();
    this.updateLandingState();

    if (this.canLand && this.input.wantsToLand()) {
      this.callbacks.onLandRequest();
    }
  };

  private getMovementInput() {
    const keyboardTurnLeft = this.input.wantsKeyboardTurnLeft();
    const keyboardTurnRight = this.input.wantsKeyboardTurnRight();
    const keyboardThrust = this.input.wantsKeyboardThrust();
    const pointerThrust = this.input.isPointerActive();

    let targetAngle: number | null = null;
    let thrusting = keyboardThrust || pointerThrust;

    if (pointerThrust) {
      targetAngle = getForwardThrustAngle(
        this.physics.position,
        this.pointerWorldPosition,
      );
    } else if (keyboardTurnLeft || keyboardTurnRight) {
      const turnDelta =
        (keyboardTurnRight ? 1 : 0) - (keyboardTurnLeft ? 1 : 0);
      targetAngle = this.physics.rotation + turnDelta * 0.08;
      thrusting = keyboardThrust;
    } else if (keyboardThrust) {
      targetAngle = this.physics.rotation;
    }

    return {
      targetAngle,
      thrusting,
    };
  }

  private updatePlayerTransform() {
    this.playerContainer.position.set(
      this.physics.position.x,
      this.physics.position.y,
    );
    this.playerContainer.rotation = this.physics.rotation;
  }

  private updateCamera() {
    this.worldContainer.position.set(
      this.app.screen.width / 2 - this.physics.position.x,
      this.app.screen.height / 2 - this.physics.position.y,
    );
  }

  private updateLandingState() {
    const station = solSystem.stations[0];
    const nextCanLand = isWithinLandingRange(
      this.physics.position,
      station.position,
      station.landingRadius,
    );

    if (nextCanLand !== this.canLand) {
      this.canLand = nextCanLand;
      this.callbacks.onCanLandChange(nextCanLand);
      this.setStationPulse(nextCanLand);
    }
  }

  private setStationPulse(active: boolean) {
    if (active === this.stationPulsing) return;
    this.stationPulsing = active;
    this.stationContainer.scale.set(1);
    if (!active) return;
  }

  private updateEngineEffects(thrusting: boolean) {
    if (thrusting) {
      this.engineGlow.alpha = 0.7 + (Math.random() * 0.5 - 0.2);
      if (Math.random() < 0.33) {
        const particle = new Graphics();
        particle.circle(0, 0, 2);
        particle.fill({ color: 0xff8800, alpha: 0.8 });
        particle.position.set(0, -8);
        this.playerContainer.addChild(particle);

        let life = 0.3;
        const fade = () => {
          life -= this.app.ticker.deltaMS / 1000;
          particle.alpha = Math.max(0, life / 0.3);
          if (life <= 0) {
            this.app.ticker.remove(fade);
            particle.destroy();
            return;
          }
        };
        this.app.ticker.add(fade);
      }
    } else {
      this.engineGlow.alpha = 0.2;
    }

    if (this.stationPulsing) {
      const pulse = 1 + Math.sin(performance.now() / 150) * 0.05;
      this.stationContainer.scale.set(pulse);
    }
  }

  setPaused(paused: boolean) {
    if (paused) {
      this.app.ticker.stop();
    } else {
      this.app.ticker.start();
    }
  }
}
