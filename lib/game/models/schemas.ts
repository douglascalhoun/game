import { z } from "zod";

export const stationSchema = z.object({
  name: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  landingRadius: z.number(),
});

export const starSystemSchema = z.object({
  name: z.string(),
  stations: z.array(stationSchema),
  backgroundColor: z.object({
    r: z.number(),
    g: z.number(),
    b: z.number(),
  }),
});

export const shipSchema = z.object({
  name: z.string(),
  mass: z.number(),
  maxSpeed: z.number(),
  acceleration: z.number(),
  turnRate: z.number(),
  maxShield: z.number(),
  maxArmor: z.number(),
  cargoSpace: z.number(),
});

export type Station = z.infer<typeof stationSchema>;
export type StarSystem = z.infer<typeof starSystemSchema>;
export type Ship = z.infer<typeof shipSchema>;
