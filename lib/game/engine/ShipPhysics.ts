export interface Vector2 {
  x: number;
  y: number;
}

export interface ShipPhysicsState {
  position: Vector2;
  velocity: Vector2;
  rotation: number;
  rotationVelocity: number;
}

export interface ShipConfig {
  maxSpeed: number;
  acceleration: number;
  turnRate: number;
}

export function createPhysicsState(
  position: Vector2 = { x: 300, y: 0 },
): ShipPhysicsState {
  return {
    position: { ...position },
    velocity: { x: 0, y: 0 },
    rotation: 0,
    rotationVelocity: 0,
  };
}

export function normalizeAngle(angle: number): number {
  let normalized = angle;
  while (normalized > Math.PI) normalized -= 2 * Math.PI;
  while (normalized < -Math.PI) normalized += 2 * Math.PI;
  return normalized;
}

export function updateShipPhysics(
  state: ShipPhysicsState,
  config: ShipConfig,
  input: {
    targetAngle: number | null;
    thrusting: boolean;
  },
  deltaTime: number,
): ShipPhysicsState {
  const next = {
    position: { ...state.position },
    velocity: { ...state.velocity },
    rotation: state.rotation,
    rotationVelocity: state.rotationVelocity,
  };

  if (input.targetAngle !== null) {
    const angleDiff = normalizeAngle(input.targetAngle - next.rotation);
    const turnSpeed = config.turnRate * deltaTime;

    if (Math.abs(angleDiff) < turnSpeed) {
      next.rotation = input.targetAngle;
      next.rotationVelocity = 0;
    } else {
      next.rotationVelocity = angleDiff > 0 ? turnSpeed : -turnSpeed;
    }
  } else {
    next.rotationVelocity *= 0.9;
  }

  if (input.thrusting) {
    const thrustDirection = {
      x: -Math.sin(next.rotation),
      y: Math.cos(next.rotation),
    };
    const thrust = config.acceleration * deltaTime;
    next.velocity.x += thrustDirection.x * thrust;
    next.velocity.y += thrustDirection.y * thrust;
  }

  next.velocity.x *= 0.98;
  next.velocity.y *= 0.98;

  const speed = Math.hypot(next.velocity.x, next.velocity.y);
  if (speed > config.maxSpeed) {
    const scale = config.maxSpeed / speed;
    next.velocity.x *= scale;
    next.velocity.y *= scale;
  }

  next.position.x += next.velocity.x * deltaTime;
  next.position.y += next.velocity.y * deltaTime;
  next.rotation += next.rotationVelocity;

  return next;
}

export function getForwardThrustAngle(position: Vector2, target: Vector2): number {
  return Math.atan2(target.y - position.y, target.x - position.x) - Math.PI / 2;
}
