/**
 * Validates the data provided in the body of the utility payment status-processing request.
 *
 * - sets on res.locals:
 *   - providerId
 *   - appOrderId (used in service)
 *   - txPath (used in validateTxPath MD to get data like userId and naira admin path)
 *   - provider (class instance, used in service)
 */

import { NextFunction, Request, Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import ObjectValidator from "../../../helpers/@objectValidator";
import getMetadata from "../../../models/get/getMetadata";
import { getProviderById } from "../../../helpers/@getProviderById";

type TStatusBody = {
  /** Path to the naira_metadata doc for this requery request */
  metaPath: string;
};
const statusBodyRule = {
  metaPath: `required|string`,
} satisfies { [k in keyof TStatusBody]?: string };
const statusBodyValidator = new ObjectValidator<TStatusBody>(statusBodyRule);

export default async function validateStatusBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!statusBodyValidator.validate(req.body))
      throw new ErrorHandler("Invalid status body.", true, {
        message: "Invalid status body.",
        reason: statusBodyValidator.response,
        source: validateStatusBody.name,
      });

    const metaPath = req.body.metaPath;

    const { providerId, appOrderId, providerOrderId, txPath } =
      await getMetadata(metaPath);
    res.locals.providerId = providerId;
    res.locals.appOrderId = appOrderId;
    res.locals.providerOrderId = providerOrderId;
    res.locals.txPath = txPath;

    res.locals.provider = getProviderById(providerId!);

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
