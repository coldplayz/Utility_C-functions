/**
 * Validates the data provided in the query of the utility payment status-processing request.
 */

import { NextFunction, Request, Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import { AppTxStatus, TStatusQuery } from "../../../interface/types";
import ObjectValidator from "../../../helpers/@objectValidator";

const statusQueryRule = {
  txPath: `required_if:status,${AppTxStatus.Mempool}`,
  providerId: "required|isProviderId",
  status: "required|isAppTxStatus",
} satisfies { [k in keyof TStatusQuery]?: string };
const statusQueryValidator = new ObjectValidator(statusQueryRule);

export default async function validateStatusQuery(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusQuery = req.query as unknown as TStatusQuery;

  try {
    if (!statusQueryValidator.validate(statusQuery))
      throw new ErrorHandler("Invalid status query.", true, {
        message: "Invalid status query.",
        reason: statusQueryValidator.response,
        source: "validateStatusQuery MD.",
      });

    res.locals.statusQuery = statusQuery;

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    let defaultError = new ErrorHandler(
      `error validating status request query: ${statusQuery}`,
      false,
      error
    );
    if (error instanceof ErrorHandler) defaultError = error;
    return Echo.HandleResponse(res, defaultError, req.originalUrl);
  }
}
