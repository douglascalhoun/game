import { Graphics } from "pixi.js";

export function createShipGraphic(fillColor: number, strokeColor = 0xffffff) {
  const graphic = new Graphics();
  graphic.moveTo(0, 20);
  graphic.lineTo(-10, -10);
  graphic.lineTo(0, -5);
  graphic.lineTo(10, -10);
  graphic.closePath();
  graphic.fill(fillColor);
  graphic.stroke({ width: 2, color: strokeColor });
  return graphic;
}

export function createProjectileGraphic(color: number) {
  const graphic = new Graphics();
  graphic.circle(0, 0, 3);
  graphic.fill(color);
  return graphic;
}

export function flashGraphic(graphic: Graphics, color: number) {
  graphic.tint = color;
  window.setTimeout(() => {
    graphic.tint = 0xffffff;
  }, 80);
}
