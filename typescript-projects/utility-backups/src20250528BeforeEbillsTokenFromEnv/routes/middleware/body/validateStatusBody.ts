/**
 * Validates the data provided in the body of the utility payment status-processing request.
 *
 * - sets on res.locals:
 *   - txPath (used in validateTxPath MD to get data like userId and naira admin path)
 */

import { NextFunction, Request, Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import ObjectValidator from "../../../helpers/@objectValidator";

type TStatusBody = {
  /** Path to the original transaction doc for this utility request */
  txPath: string;
};
const statusBodyRule = {
  txPath: `required|string`,
} satisfies { [k in keyof TStatusBody]: string };
const statusBodyValidator = new ObjectValidator<TStatusBody>(statusBodyRule);

export default async function validateStatusBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!statusBodyValidator.validate(req.body))
      throw new ErrorHandler("Invalid status request body.", true, {
        message: "Invalid status request body.",
        reason: statusBodyValidator.response,
        source: validateStatusBody.name,
      });

    res.locals.txPath = req.body.txPath;

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const err =
      error instanceof ErrorHandler
        ? error
        : new ErrorHandler(
            `error validating status request body`,
            false,
            error
          );
    return Echo.HandleResponse(res, err, req.originalUrl);
  }
}
