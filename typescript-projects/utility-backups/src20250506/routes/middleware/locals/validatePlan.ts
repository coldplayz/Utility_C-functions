/**
 * Ensures product plan ID is set when necessary, and it's data is available and valid.
 *
 * - set provider instance in locals
 */

import { NextFunction, Request, Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import getPlanData from "../../../models/get/getPlanData";
import { getProviderById } from "../../../helpers/@getProviderById";

export default async function validatePlan(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let planId: string | undefined;

  try {
    const utilityMeta = res.locals.utilityMeta;
    if (!utilityMeta)
      throw new ErrorHandler("No utilityMeta in locals!", false, {
        source: validatePlan.name,
      });

    planId = utilityMeta.planId;
    if (!planId)
      throw new ErrorHandler("No planId in utilityMeta!", false, {
        source: validatePlan.name,
        merchant: utilityMeta.merchantId,
        product: utilityMeta.productId,
      });

    res.locals.planData = await getPlanData(planId, utilityMeta.productId);
    res.locals.provider = getProviderById(res.locals.planData.providerId);

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    let defaultError = new ErrorHandler(
      `error validating plan: ${planId || "undefined"}`,
      false,
      error
    );
    if (error instanceof ErrorHandler) defaultError = error;
    return Echo.HandleResponse(res, defaultError, req.originalUrl);
  }
}
