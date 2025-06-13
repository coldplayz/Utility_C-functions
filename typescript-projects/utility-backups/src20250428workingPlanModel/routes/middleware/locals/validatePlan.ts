/**
 * Ensures product plan ID is set when necessary, and it's data is available and valid.
 *
 * - set providerId in locals
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
      res.locals.providerId = getSupportingProviderId(
        utilityMeta.merchantId,
        utilityMeta.productId,
        res.locals.planData.providerId
      );
    } else
      res.locals.providerId = getSupportingProviderId(
        utilityMeta.merchantId,
        utilityMeta.productId
      ); // product doesn't have plan data associated

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

/**
 * Gets and/or validates a provider supporting the specified merchant product.
 * @param merchant - the producer of value (product/service).
 * @param product - the product class.
 * @param providerId - optional. If provided, used to get a specific provider instead of searching through all available providers.
 * @throws ErrorHandler, if no provider is found that supports the merchant product.
 * @returns a providerId.
 */
export function getSupportingProviderId(
  merchant: UtilityMerchant,
  product: UtilityProduct,
  providerId?: ProviderId
) {
  try {
    if (providerId) {
      const provider = idToProviderMap[providerId];
      if (provider.supports(merchant, product)) return providerId;
    } else {
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

      if (supportingProviderIds.length > 0) return supportingProviderIds[0];
    }

    // Didn't find any provider supporting merchant product, or the specified provider doesn't support it.
    throw new ErrorHandler("No provider available", true, {
      merchant,
      product,
      providerId,
      source: validatePlan.name,
    });
  } catch (error) {
    let defaultError = new ErrorHandler(
      `error getting supporting provider`,
      false,
      error
    );
    if (error instanceof ErrorHandler) defaultError = error;
    throw defaultError;
  }
}
