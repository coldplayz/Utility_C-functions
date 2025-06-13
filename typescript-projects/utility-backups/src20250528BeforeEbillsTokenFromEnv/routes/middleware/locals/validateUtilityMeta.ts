/**
 * Ensures utility metadata (txDoc.utility) is present in locals...and valid.
 */

import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../../../errors/errManager";
import Echo from "../../../helpers/@response";
import { TUtilityMeta } from "../../../interface/types";
import ObjectValidator from "../../../helpers/@objectValidator";

const utilityMetaRule = {
  appOrderId: `required|string`,
  providerOrderId: `required|string`,
} satisfies { [k in keyof TUtilityMeta]: string };
const utilityMetaValidator = new ObjectValidator<TUtilityMeta>(utilityMetaRule);

export default async function validateUtilityMeta(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const utilityMeta = res.locals.utilityMeta;

  try {
    if (!utilityMeta)
      throw new ErrorHandler("Missing utilityMeta in locals!.", false, {
        source: validateUtilityMeta.name,
      });

    // Validate data on utilityMeta
    if (!utilityMetaValidator.validate(utilityMeta))
      throw new ErrorHandler("Error validating tx doc.", true, {
        cause: utilityMetaValidator.response,
        source: validateUtilityMeta.name,
      });

    res.locals.appOrderId = utilityMeta.appOrderId;
    res.locals.providerOrderId = utilityMeta.providerOrderId;

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const err =
      error instanceof ErrorHandler
        ? error
        : new ErrorHandler(
            `error validating data on utilityMeta: ${utilityMeta}`,
            false,
            error
          );
    return Echo.HandleResponse(res, err, req.originalUrl);
  }
}
