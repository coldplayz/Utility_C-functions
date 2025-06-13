// global constants

import { AppName, MicroServiceRoutePathVal } from "../interface/types";

export const AppNames: AppName[] = ["atechpadi", "gojigi"];

export const PubSubRoutePaths: MicroServiceRoutePathVal[] = [
  "/bills/bet/process",
  "/bills/cableTv/process",
  "/bills/electricity/process",
  "/bills/mobile/process",
] as const;
