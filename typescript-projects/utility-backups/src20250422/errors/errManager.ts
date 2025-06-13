/**
 * Exposes custom logic for handling errors.
 *
 * - should handle both error logging and throwing at once.
 */

import { logger } from "../helpers/@logger";

export default class ErrorHandler extends Error {
  isSafe;
  isLogged = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, isSafe: boolean, error: any = {}) {
    super(JSON.stringify(message));
    this.isSafe = isSafe;
    this.error = error;

    // Set the prototype explicitly; TODO: find out why
    Object.setPrototypeOf(this, ErrorHandler.prototype);

    logger.error(error?.message || message, {
      reason: error?.reason,
      stack: error?.stack,
      error,
    });
    this.isLogged = true;
  }
}
