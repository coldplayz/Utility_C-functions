/**
 * Ensures that only one utility payment request is processed.
 */

import { NextFunction, Request, Response } from "express";
import Echo from "../../../helpers/@response";
import { logger } from "../../../helpers/@logger";
import ErrorHandler from "../../../errors/errManager";
import initializeUtilityTxStatusDocs from "../../../models/set/initializeUtilityTxStatusDocs";
import ObjectValidator from "../../../helpers/@objectValidator";
import { AppTxStatus } from "../../../interface/enums";
import { unix } from "../../../helpers/@time";
import NairaAdminCollectionSchema from "../../../models/schema/_nairaAdminCollectionSchema";
import UtilityTxCollectionSchema from "../../../models/schema/_utilityTxCollectionSchema";

type MdData = { uid: string; appTxHash: string; nairaAdminDocPath: string };
const rule: { [K in keyof MdData]: string } = {
  uid: "required|string",
  appTxHash: "required|string",
  nairaAdminDocPath: "required|string",
};
const validator = new ObjectValidator<MdData>(rule);

export default async function verifyIsNewPayment(
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
          source: verifyIsNewPayment.name,
          message: validator.response,
        }),
        req.originalUrl
      );

    const status = AppTxStatus.Pending;
    const utilityUpdate = {
      "utility.initiatedAt": unix(),
      "utility.status": status,
    };
    const nairaAdminUpdate = { utilityStatus: status };

    // Validate data
    new UtilityTxCollectionSchema(utilityUpdate).validate();
    new NairaAdminCollectionSchema(nairaAdminUpdate).validate();

    const { statusDocsWritten } = await initializeUtilityTxStatusDocs(
      {
        uid: mdData.uid,
        appTxHash: mdData.appTxHash,
        nairaAdminDocPath: mdData.nairaAdminDocPath,
      },
      utilityUpdate,
      nairaAdminUpdate
    );

    if (!statusDocsWritten)
      return Echo.HandleResponse(
        res,
        new ErrorHandler("Duplicate payment requests!", true, {
          source: verifyIsNewPayment.name,
          message: "Duplicate payment requests! Found a status on utility doc.",
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
