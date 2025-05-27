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
    const reasonMeta = res.locals.reasonMeta;
    if (!reasonMeta)
      throw new ErrorHandler("No reasonMeta in locals!", false, {
        source: validateInternetPaymentData.name,
      });

    if (!res.locals.appTxHash!)
      throw new ErrorHandler("No appTxHash in locals!", false, {
        source: validateInternetPaymentData.name,
      });

    if (!res.locals.providerId)
      throw new ErrorHandler("No providerId in locals!", false, {
        source: validateInternetPaymentData.name,
      });

    providerToInternetPaymentDataValidatorMap[res.locals.providerId!](req, res);

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

// ################### PROVIDER-SPECIFIC VALIDATORS START ###################

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
    const reasonMeta = res.locals
      .reasonMeta as unknown as TEbillsInternetPaymentData;

    const dataToValidate = {
      provider: reasonMeta.provider,
      phoneNumber: reasonMeta.phoneNumber,
      merchant: reasonMeta.merchant,
      variationId: reasonMeta.variationId,
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

// GIFTBILLS
// TODO: implement when data shape available
export const validateGiftbillsInternetPaymentData =
  validateEbillsInternetPaymentData;

// ################### PROVIDER-SPECIFIC VALIDATORS END ###################

const providerToInternetPaymentDataValidatorMap = {
  [ProviderId.Ebills]: validateEbillsInternetPaymentData,
  [ProviderId.Giftbills]: validateGiftbillsInternetPaymentData,
};
