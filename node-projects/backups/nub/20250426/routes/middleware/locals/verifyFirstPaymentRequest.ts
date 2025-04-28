/**
 * Ensures that only one utility payment request is processed.
 */

import { NextFunction, Request, Response } from "express";
import Echo from "../../../helpers/@response";
import { logger } from "../../../helpers/@logger";
import ErrorHandler from "../../../errors/errManager";
import { AppTxStatus } from "../../../interface/types";
import initializeUtilityTxStatusDocs from "../../../models/set/initializeUtilityTxStatusDocs";
import ObjectValidator from "../../../helpers/@objectValidator";
import prepareUtilityTxStatusData from "../../../models/set/prepareUtilityTxStatusData";

type MdData = { uid: string; appTxHash: string; nairaAdminDocPath: string };
const rule: { [K in keyof MdData]: string } = {
  uid: "required|string",
  appTxHash: "required|string",
  nairaAdminDocPath: "required|string",
};
const validator = new ObjectValidator<MdData>(rule);

export default async function verifyFirstPaymentRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const mdData = {
      uid: res.locals.uid!,
      appTxHash: res.locals.appTxHash!,
      nairaAdminDocPath: res.locals.nairaAdminDocPath!,
    };
    if (!validator.validate(mdData))
      return Echo.HandleResponse(
        res,
        new ErrorHandler("error validating middleware data", true, {
          source: "verifyFirstPaymentRequest MD",
          message: validator.response,
        }),
        req.originalUrl
      );

    const docsData = prepareUtilityTxStatusData(AppTxStatus.Pending);
    const { statusDocsWritten } = await initializeUtilityTxStatusDocs(
      {
        uid: mdData.uid,
        appTxHash: mdData.appTxHash,
        nairaAdminDocPath: mdData.nairaAdminDocPath,
      },
      docsData.nairaMetadata,
      docsData.nairaAdmindata
    );

    if (!statusDocsWritten)
      return Echo.HandleResponse(
        res,
        new ErrorHandler("Duplicate payment requests.", true, {
          source: "verifyFirstPaymentRequest MD",
          message:
            "Duplicate payment requests. 'naira_metadata' doc exists already!",
        }),
        req.originalUrl
      );

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (!(error instanceof ErrorHandler))
      logger.error(error.message, { error });
    return Echo.ErrorPub(res, "error verifying if first payment request");
  }
}
