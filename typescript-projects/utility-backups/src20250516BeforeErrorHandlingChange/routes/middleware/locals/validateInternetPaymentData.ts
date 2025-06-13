/**
 * Ensures the internet payment data for THE provider is available and valid.
 *
 * - set validated payment data in locals
 */

import { NextFunction, Request, Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import ObjectValidator from "../../../helpers/@objectValidator";
import { TEbillsInternetPaymentData } from "../../../interface/types";
import { ProviderId } from "../../../interface/enums";

export default async function validateInternetPaymentData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const utilityMeta = res.locals.utilityMeta; // TODO: -> reasonMeta???
    if (!utilityMeta)
      throw new ErrorHandler("No utilityMeta in locals!", false, {
        source: validateInternetPaymentData.name,
      });

    if (!res.locals.appTxHash!)
      throw new ErrorHandler("No appTxHash in locals!", false, {
        source: validateInternetPaymentData.name,
      });

    providerToInternetPaymentDataValidatorMap[res.locals.providerId!](req, res); // TODO: set provider in locals/utilityMeta

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const err =
      error instanceof ErrorHandler
        ? error
        : new ErrorHandler(
            `error validating internet payment data`,
            false,
            error
          );
    return Echo.HandleResponse(res, err, req.originalUrl);
  }
}

const providerToInternetPaymentDataValidatorMap = {
  [ProviderId.Ebills]: validateEbillsInternetPaymentData,
};

// ################### PROVIDER-SPECIFIC VALIDATORS ###################

// EBILLS
const ebillsInternetPaymentDataRule: {
  [K in keyof TEbillsInternetPaymentData]: string;
} = {
  merchant: "required|string",
  phoneNumber: "required|string",
  provider: "required|isProviderId",
  variationId: "required|string",
};
const ebillsInternetPaymentDataValidator =
  new ObjectValidator<TEbillsInternetPaymentData>(
    ebillsInternetPaymentDataRule
  );

export function validateEbillsInternetPaymentData(req: Request, res: Response) {
  try {
    const utilityMeta = res.locals
      .utilityMeta as unknown as TEbillsInternetPaymentData; // TODO: -> reasonMeta???

    const dataToValidate = {
      provider: utilityMeta.provider,
      phoneNumber: utilityMeta.phoneNumber,
      merchant: utilityMeta.merchant,
      variationId: utilityMeta.variationId,
    };

    if (!ebillsInternetPaymentDataValidator.validate(dataToValidate))
      throw new ErrorHandler("Error validating payment data!", true, {
        source: validateEbillsInternetPaymentData.name,
        reason: ebillsInternetPaymentDataValidator.response,
      });

    res.locals.paymentData = {
      appOrderId: res.locals.appTxHash!,
      customerId: dataToValidate.phoneNumber,
      merchantId: dataToValidate.merchant,
      productId: dataToValidate.variationId,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const err =
      error instanceof ErrorHandler
        ? error
        : new ErrorHandler(
            `error validating ebills internet payment data`,
            false,
            error
          );
    throw err;
  }
}
