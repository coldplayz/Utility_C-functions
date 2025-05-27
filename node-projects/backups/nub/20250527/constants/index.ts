// global constants

import { ProviderId } from "../interface/enums";
import { AppName, MicroServiceRoutePathVal } from "../interface/types";
import ebills from "../lib/external/apiEbills";
import giftbills from "../lib/external/apiGiftbills";
import BaseProvider from "../lib/external/providerBaseApi";

export const AppNames: AppName[] = ["atechpadi", "gojigi"];

export const PubSubRoutePaths: MicroServiceRoutePathVal[] = [
  "/bills/bet/process",
  "/bills/cableTv/process",
  "/bills/electricity/processPostpaid",
  "/bills/electricity/processPrepaid",
  "/bills/mobile/processAirtime",
  "/bills/mobile/processInternet",
] as const;

/** Maps an Atechcoins-recognized provider ID to the provider's class instance bundling provider-specific logic. */
export const idToProviderMap: { [K in ProviderId]: BaseProvider } = {
  [ProviderId.Ebills]: ebills,
  [ProviderId.Giftbills]: giftbills,
};
