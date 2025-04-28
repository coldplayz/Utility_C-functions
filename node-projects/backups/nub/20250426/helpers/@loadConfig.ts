/**
 * Loads, parses, and exposes app configuration/constants, of which there are two types:
 *
 * - dynamic config, as from environment variables
 * - static config, as defined statically in [this] file
 *
 * This file should be loaded as early as possible in app entry point.
 */

import "dotenv/config";

import ObjectValidator from "./@objectValidator";
// import { AppNames } from "../constants";
import ErrorHandler from "../errors/errManager";
import { ParsedEnv, RawEnv } from "../interface/types";

/**
 * Parses environment variables required in the app.
 * @returns validated environment variables.
 */
export function validateEnv() {
  const rawEnv = process.env as RawEnv;
  const envRules: { [k in keyof RawEnv]: string } = {
    // CORS_URL: "required|string|max:1000",
    // JWT_SECRET: "required|string|max:1000",
    // USERS_PROJECT_SA: "required|string|max:5000",
    // BITCOIN_PROJECT_SA: "required|string|max:5000",
    // GIFTCARD_PROJECT_SA: "required|string|max:5000",
    // CORE_PROJECT_PUB_SA: "required|string|max:5000",
    // CORE_PROJECT_ID: "required|string|max:500",
    // APP_NAME: `required|string|in:${Object.values(AppNames)}`,
    // SERVICE_ID: "required|string|max:500",
    AUTHORIZED_SERVICES_ID: "present|string|max:10000",
    PUBSUB_JWT_SECRET: "required|string|max:1000",
    // PUSH_NOTIFICATION_ENDPOINT: "required|string|max:1000",
  };
  const envValidator = new ObjectValidator(envRules);
  // check validation
  if (!envValidator.validate(rawEnv))
    throw new ErrorHandler(
      "error validating environment variables",
      true,
      envValidator.response
    );

  return rawEnv;
}

export function commaStringToArray(str: string) {
  return str
    .split(",")
    .filter((part) => !!part) // remove empty strings
    .map((part) => part.trim()); // remove surrounding whitespace
}

export function parseEnv(rawEnv: RawEnv): ParsedEnv {
  return {
    ...rawEnv,
    // CORE_PROJECT_PUB_SA: JSON.parse(rawEnv.CORE_PROJECT_PUB_SA),
    AUTHORIZED_SERVICES_ID: commaStringToArray(rawEnv.AUTHORIZED_SERVICES_ID),
  };
}

// Validate environment variables
const rawEnv = validateEnv();
// Parse env with possible data transformation; e.g. "30" (string) to 30 (number)
const parsedEnv = parseEnv(rawEnv);

export default parsedEnv;
