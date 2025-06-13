/**
 * Ensures txPath points to valid document and save relevant data therefrom.
 */

import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../../../errors/errManager";
import getUtilityTxDoc from "../../../models/get/getUtilityTxDoc";
import Echo from "../../../helpers/@response";
import { getProviderById } from "../../../helpers/@getProviderById";

export default async function validateTxPath(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let txPath = res.locals.txPath;
  txPath ||
    (res.locals.txPath = txPath =
      `users_transactions_withdrawal/uid1/utility/hash${getProductFromUrl(
        req.originalUrl
      )}`); // TODO: test/dev only

  try {
    if (!txPath)
      throw new ErrorHandler("Missing txPath in locals!.", false, {
        source: "validateTxPath MD.",
      });

    // Get and validate data at txPath
    const txData = await getUtilityTxDoc(txPath);

    // TODO: set other data
    res.locals.uid = txData.userId;
    res.locals.appTxHash = txData.hash;
    res.locals.nairaAdminDocPath = txData.adminInfo.naira_path;
    res.locals.providerId = txData.reasonMeta.provider;
    res.locals.amount = txData.amount;
    res.locals.provider = getProviderById(res.locals.providerId);
    res.locals.reasonMeta = txData.reasonMeta;
    res.locals.utilityMeta = txData.utility;

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // TODO: uncomment after testing
    const err =
      error instanceof ErrorHandler
        ? error
        : new ErrorHandler(
            `error validating data at txPath: ${txPath}`,
            false,
            error
          );
    return Echo.HandleResponse(res, err, req.originalUrl);
  }
}

export function getProductFromUrl(originalUrl: string) {
  let product: string;
  const [utility, processAndPossiblyProduct] = originalUrl
    .split("/")
    .splice(-2);
  const groupedUtilities = ["mobile", "electricity"];

  if (groupedUtilities.includes(utility))
    product = processAndPossiblyProduct.substring(7).toLowerCase();
  // processAirtime -> airtime; processPrepaid -> prepaid for above
  else product = utility; // e.g. bet and cableTv

  return product;
}
