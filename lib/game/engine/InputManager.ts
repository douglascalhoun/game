export class InputManager {
  private keys = new Set<string>();
  private pointerActive = false;
  private pointerPosition = { x: 0, y: 0 };
  private canvas: HTMLCanvasElement | null = null;
  private boundKeyDown: (event: KeyboardEvent) => void;
  private boundKeyUp: (event: KeyboardEvent) => void;
  private boundPointerDown: (event: PointerEvent) => void;
  private boundPointerMove: (event: PointerEvent) => void;
  private boundPointerUp: (event: PointerEvent) => void;
  private boundContextMenu: (event: Event) => void;

  constructor() {
    this.boundKeyDown = (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (!event.repeat) {
          this.keys.add(event.code);
        }
        return;
      }

      this.keys.add(event.code);
      if (
        event.code === "ArrowUp" ||
        event.code === "ArrowDown" ||
        event.code === "ArrowLeft" ||
        event.code === "ArrowRight"
      ) {
        event.preventDefault();
      }
    };
    this.boundKeyUp = (event) => {
      if (event.code === "Space") {
        event.preventDefault();
      }
      this.keys.delete(event.code);
    };
    this.boundPointerDown = (event) => {
      this.pointerActive = true;
      this.updatePointerPosition(event);
    };
    this.boundPointerMove = (event) => {
      if (!this.pointerActive) return;
      this.updatePointerPosition(event);
    };
    this.boundPointerUp = () => {
      this.pointerActive = false;
    };
    this.boundContextMenu = (event) => {
      event.preventDefault();
    };
  }

  attach(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const keyOptions = { capture: true };
    window.addEventListener("keydown", this.boundKeyDown, keyOptions);
    window.addEventListener("keyup", this.boundKeyUp, keyOptions);
    canvas.addEventListener("pointerdown", this.boundPointerDown);
    canvas.addEventListener("pointermove", this.boundPointerMove);
    canvas.addEventListener("pointerup", this.boundPointerUp);
    canvas.addEventListener("pointerleave", this.boundPointerUp);
    canvas.addEventListener("contextmenu", this.boundContextMenu);
  }

  detach() {
    const keyOptions = { capture: true };
    window.removeEventListener("keydown", this.boundKeyDown, keyOptions);
    window.removeEventListener("keyup", this.boundKeyUp, keyOptions);
    if (this.canvas) {
      this.canvas.removeEventListener("pointerdown", this.boundPointerDown);
      this.canvas.removeEventListener("pointermove", this.boundPointerMove);
      this.canvas.removeEventListener("pointerup", this.boundPointerUp);
      this.canvas.removeEventListener("pointerleave", this.boundPointerUp);
      this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
    }
    this.canvas = null;
    this.keys.clear();
    this.pointerActive = false;
  }

  private updatePointerPosition(event: PointerEvent) {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.pointerPosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  isKeyPressed(code: string) {
    return this.keys.has(code);
  }

  isPointerActive() {
    return this.pointerActive;
  }

  getPointerPosition() {
    return this.pointerPosition;
  }

  wantsToLand() {
    return this.keys.has("KeyL");
  }

  wantsToFire() {
    return this.keys.has("Space");
  }

  wantsKeyboardThrust() {
    return (
      this.keys.has("ArrowUp") ||
      this.keys.has("KeyW")
    );
  }

  wantsKeyboardTurnLeft() {
    return this.keys.has("ArrowLeft") || this.keys.has("KeyA");
  }

  wantsKeyboardTurnRight() {
    return this.keys.has("ArrowRight") || this.keys.has("KeyD");
  }
}
