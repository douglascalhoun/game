import systemsData from "./systems.json";
import shipsData from "./ships.json";
import {
  shipSchema,
  starSystemSchema,
  type Ship,
  type StarSystem,
} from "../models/schemas";

export const solSystem: StarSystem = starSystemSchema.parse(systemsData);
export const playerShip: Ship = shipSchema.parse(shipsData);

export const REFUEL_COST_PER_UNIT = 2;
export const STARTING_CREDITS = 10000;
