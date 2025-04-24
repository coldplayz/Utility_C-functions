// global constants

import {
  AppName,
  IUtilityProvider,
  MicroServiceRoutePathVal,
  ProviderId,
} from "../interface/types";
import providerX from "../lib/external/providerX";

export const AppNames: AppName[] = ["atechpadi", "gojigi"];

export const PubSubRoutePaths: MicroServiceRoutePathVal[] = [
  "/bills/bet/process",
  "/bills/cableTv/process",
  "/bills/electricity/process",
  "/bills/mobile/process",
] as const;

/** Maps an Atechcoins-recognized provider ID to the provider's class instance bundling provider-specific logic. */
export const idToProviderMap: { [K in ProviderId]: IUtilityProvider } = {
  [ProviderId.ProviderX]: providerX,
};
