/**
 * Ensures product plan ID is set when necessary, and it's data is available and valid.
 */

import { NextFunction, Request, Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import {
  UtilityMerchant,
  UtilityProduct,
  ProviderId,
  IUtilityProvider,
} from "../../../interface/types";
import getPlanData from "../../../models/get/getPlanData";
import { idToProviderMap } from "../../../constants";

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

    const planProducts = [UtilityProduct.Plan]; // products having plan data
    if (planProducts.includes(utilityMeta.productId)) {
      planId = utilityMeta.planId;
      if (!planId)
        throw new ErrorHandler("No planId in utilityMeta!", false, {
          source: validatePlan.name,
          merchant: utilityMeta.merchantId,
          product: utilityMeta.productId,
        });

      res.locals.planData = await getPlanData(planId);
      res.locals.providerId = res.locals.planData.providerId;

      next();
    } else
      res.locals.providerId = getSupportingProvider(
        utilityMeta.merchantId,
        utilityMeta.productId
      ); // product doesn't have plan data associated
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

export function getSupportingProvider(
  merchant: UtilityMerchant,
  product: UtilityProduct
) {
  const providerEntries = Object.entries(idToProviderMap) as unknown as [
    ProviderId,
    IUtilityProvider
  ][];

  // TODO: savable on locals for programmatic switching of providers...(propose later)
  const supportingProviderIds = providerEntries.reduce(
    (supportingIds, [id, provider]) => {
      if (provider.supports(merchant, product)) supportingIds.push(id);
      return supportingIds;
    },
    [] as ProviderId[]
  );

  if (supportingProviderIds.length === 0)
    throw new ErrorHandler("No provider available", true, {
      merchant,
      product,
      source: validatePlan.name,
    });

  const providerId = supportingProviderIds[0];

  return providerId;
}
