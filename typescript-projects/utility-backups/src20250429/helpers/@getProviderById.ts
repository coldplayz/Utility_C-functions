import { idToProviderMap } from "../constants";
import ErrorHandler from "../errors/errManager";
import { ProviderId } from "../interface/types";

/**
 * Get a provider instance based on their ID.
 * @param providerId - unique provider identifier set and recognized by the app.
 * @returns a provider class instance bundling provider-specific functionality.
 */
export function getProviderById(providerId: ProviderId) {
  const provider = idToProviderMap[providerId];

  if (!provider)
    throw new ErrorHandler(
      `No provider logic matching the ID: ${providerId}`,
      true
    );

  return provider;
}
