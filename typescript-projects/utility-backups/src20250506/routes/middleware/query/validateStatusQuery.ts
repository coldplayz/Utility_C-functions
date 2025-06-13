/**
 * Validates the data provided in the query of the utility payment status-processing request.
 */

import { NextFunction, Request, Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import { TStatusQuery } from "../../../interface/types";
import ObjectValidator from "../../../helpers/@objectValidator";
import getMetadata from "../../../models/get/getMetadata";
import { getProviderById } from "../../../helpers/@getProviderById";
import { AppTxStatus } from "../../../interface/enums";

const statusQueryRule = {
  metaPath: `required_if:status,${AppTxStatus.Mempool}|string`, // required if request from mempool
  providerId: `required_unless:status,${AppTxStatus.Mempool}|isProviderId`, // required if request from webhook
  status: "required|isAppTxStatus", // "mempool" if request from mempool
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
        source: validateStatusQuery.name,
      });

    let pId;

    if (statusQuery.status === AppTxStatus.Mempool) {
      // Get data at metaPath, if mempool
      const { providerId, reference, txPath } = await getMetadata(
        statusQuery.metaPath
      );
      pId = providerId;
      res.locals.reference = reference;
      res.locals.txPath = txPath;
    } else {
      // Request from webhook
      pId = statusQuery.providerId;
    }

    res.locals.provider = getProviderById(pId!);
    res.locals.queryStatus = statusQuery.status;

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
