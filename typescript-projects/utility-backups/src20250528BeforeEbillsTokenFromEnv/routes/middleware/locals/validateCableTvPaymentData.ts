/**
 * Ensures the cableTv payment data for THE provider is available and valid.
 *
 * - set validated payment data in locals
 */

import { NextFunction, Request, Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import ObjectValidator from "../../../helpers/@objectValidator";
import { TEbillsCableTvPaymentData } from "../../../interface/types";
import { ProviderId } from "../../../interface/enums";

export default async function validateCableTvPaymentData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reasonMeta = res.locals.reasonMeta;
    if (!reasonMeta)
      throw new ErrorHandler("No reasonMeta in locals!", false, {
        source: validateCableTvPaymentData.name,
      });

    if (!res.locals.appTxHash!)
      throw new ErrorHandler("No appTxHash in locals!", false, {
        source: validateCableTvPaymentData.name,
      });

    if (!res.locals.providerId)
      throw new ErrorHandler("No providerId in locals!", false, {
        source: validateCableTvPaymentData.name,
      });

    providerToCableTvPaymentDataValidatorMap[res.locals.providerId!](req, res);

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const err =
      error instanceof ErrorHandler
        ? error
        : new ErrorHandler(
            `error validating cableTv payment data`,
            false,
            error
          );
    return Echo.HandleResponse(res, err, req.originalUrl);
  }
}

// ################### PROVIDER-SPECIFIC VALIDATORS START ###################

// EBILLS
const ebillsCableTvPaymentDataRule: {
  [K in keyof TEbillsCableTvPaymentData]: string;
} = {
  merchant: "required|string",
  cardNumber: "required|string",
  provider: "required|isProviderId",
  variationId: "required|string",
};
const ebillsCableTvPaymentDataValidator =
  new ObjectValidator<TEbillsCableTvPaymentData>(ebillsCableTvPaymentDataRule);

export function validateEbillsCableTvPaymentData(req: Request, res: Response) {
  try {
    const reasonMeta = res.locals
      .reasonMeta as unknown as TEbillsCableTvPaymentData;

    const dataToValidate = {
      provider: reasonMeta.provider,
      cardNumber: reasonMeta.cardNumber,
      merchant: reasonMeta.merchant,
      variationId: reasonMeta.variationId,
    };

    if (!ebillsCableTvPaymentDataValidator.validate(dataToValidate))
      throw new ErrorHandler("Error validating payment data!", true, {
        source: validateEbillsCableTvPaymentData.name,
        reason: ebillsCableTvPaymentDataValidator.response,
      });

    res.locals.paymentData = {
      appOrderId: res.locals.appTxHash!,
      customerId: dataToValidate.cardNumber,
      merchantId: dataToValidate.merchant,
      productId: dataToValidate.variationId,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const err =
      error instanceof ErrorHandler
        ? error
        : new ErrorHandler(
            `error validating ebills cableTv payment data`,
            false,
            error
          );
    throw err;
  }
}

// GIFTBILLS
// TODO: implement when data shape available
export const validateGiftbillsCableTvPaymentData =
  validateEbillsCableTvPaymentData;

// ################### PROVIDER-SPECIFIC VALIDATORS END ###################

const providerToCableTvPaymentDataValidatorMap = {
  [ProviderId.Ebills]: validateEbillsCableTvPaymentData,
  [ProviderId.Giftbills]: validateGiftbillsCableTvPaymentData,
};
