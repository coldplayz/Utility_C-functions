/**
 * Ensures the bet payment data for THE provider is available and valid.
 *
 * - set validated payment data in locals
 */

import { NextFunction, Request, Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import ObjectValidator from "../../../helpers/@objectValidator";
import { TEbillsBetPaymentData } from "../../../interface/types";
import { ProviderId } from "../../../interface/enums";

export default async function validateBetPaymentData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reasonMeta = res.locals.reasonMeta;
    if (!reasonMeta)
      throw new ErrorHandler("No reasonMeta in locals!", false, {
        source: validateBetPaymentData.name,
      });

    if (!res.locals.appTxHash!)
      throw new ErrorHandler("No appTxHash in locals!", false, {
        source: validateBetPaymentData.name,
      });

    if (!res.locals.providerId)
      throw new ErrorHandler("No providerId in locals!", false, {
        source: validateBetPaymentData.name,
      });

    providerToBetPaymentDataValidatorMap[res.locals.providerId!](req, res);

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const err =
      error instanceof ErrorHandler
        ? error
        : new ErrorHandler(`error validating bet payment data`, false, error);
    return Echo.HandleResponse(res, err, req.originalUrl);
  }
}

// ################### PROVIDER-SPECIFIC VALIDATORS START ###################

// EBILLS
const ebillsBetPaymentDataRule: {
  [K in keyof TEbillsBetPaymentData]: string;
} = {
  merchant: "required|string",
  customerId: "required|string",
  provider: "required|isProviderId",
  amount: "required|isNumber",
};
const ebillsBetPaymentDataValidator =
  new ObjectValidator<TEbillsBetPaymentData>(ebillsBetPaymentDataRule);

export function validateEbillsBetPaymentData(req: Request, res: Response) {
  try {
    const reasonMeta = res.locals
      .reasonMeta as unknown as TEbillsBetPaymentData;

    const dataToValidate = {
      provider: reasonMeta.provider,
      customerId: reasonMeta.customerId,
      merchant: reasonMeta.merchant,
      amount: res.locals.amount!,
    };

    if (!ebillsBetPaymentDataValidator.validate(dataToValidate))
      throw new ErrorHandler("Error validating payment data!", true, {
        source: validateEbillsBetPaymentData.name,
        reason: ebillsBetPaymentDataValidator.response,
      });

    res.locals.paymentData = {
      appOrderId: res.locals.appTxHash!,
      customerId: dataToValidate.customerId,
      merchantId: dataToValidate.merchant,
      amount: dataToValidate.amount,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const err =
      error instanceof ErrorHandler
        ? error
        : new ErrorHandler(
            `error validating ebills bet payment data`,
            false,
            error
          );
    throw err;
  }
}

// GIFTBILLS
// TODO: implement when data shape available
export const validateGiftbillsBetPaymentData = validateEbillsBetPaymentData;

// ################### PROVIDER-SPECIFIC VALIDATORS END ###################

const providerToBetPaymentDataValidatorMap = {
  [ProviderId.Ebills]: validateEbillsBetPaymentData,
  [ProviderId.Giftbills]: validateGiftbillsBetPaymentData,
};
