/**
 * Ensures the airtime payment data for THE provider is available and valid.
 *
 * - set validated payment data in locals
 */

import { NextFunction, Request, Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import ObjectValidator from "../../../helpers/@objectValidator";
import { TEbillsAirtimePaymentData } from "../../../interface/types";
import { ProviderId } from "../../../interface/enums";

export default async function validateAirtimePaymentData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reasonMeta = res.locals.reasonMeta;
    if (!reasonMeta)
      throw new ErrorHandler("No reasonMeta in locals!", false, {
        source: validateAirtimePaymentData.name,
      });

    if (!res.locals.appTxHash)
      throw new ErrorHandler("No appTxHash in locals!", false, {
        source: validateAirtimePaymentData.name,
      });

    if (!res.locals.providerId)
      throw new ErrorHandler("No providerId in locals!", false, {
        source: validateAirtimePaymentData.name,
      });

    providerToAirtimePaymentDataValidatorMap[res.locals.providerId!](req, res);

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const err =
      error instanceof ErrorHandler
        ? error
        : new ErrorHandler(
            `error validating airtime payment data`,
            false,
            error
          );
    return Echo.HandleResponse(res, err, req.originalUrl);
  }
}

// ################### PROVIDER-SPECIFIC VALIDATORS START ###################

// EBILLS
const ebillsAirtimePaymentDataRule: {
  [K in keyof TEbillsAirtimePaymentData]: string;
} = {
  merchant: "required|string",
  phoneNumber: "required|string",
  provider: "required|isProviderId",
  amount: "required|isNumber",
};
const ebillsAirtimePaymentDataValidator =
  new ObjectValidator<TEbillsAirtimePaymentData>(ebillsAirtimePaymentDataRule);

export function validateEbillsAirtimePaymentData(req: Request, res: Response) {
  try {
    const reasonMeta = res.locals
      .reasonMeta as unknown as TEbillsAirtimePaymentData;

    const dataToValidate = {
      provider: reasonMeta.provider,
      phoneNumber: reasonMeta.phoneNumber,
      merchant: reasonMeta.merchant,
      amount: res.locals.amount!,
    };

    if (!ebillsAirtimePaymentDataValidator.validate(dataToValidate))
      throw new ErrorHandler("Error validating payment data!", true, {
        source: validateEbillsAirtimePaymentData.name,
        reason: ebillsAirtimePaymentDataValidator.response,
      });

    res.locals.paymentData = {
      appOrderId: res.locals.appTxHash!,
      customerId: dataToValidate.phoneNumber,
      merchantId: dataToValidate.merchant,
      amount: dataToValidate.amount,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const err =
      error instanceof ErrorHandler
        ? error
        : new ErrorHandler(
            `error validating ebills airtime payment data`,
            false,
            error
          );
    throw err;
  }
}

// GIFTBILLS
// TODO: implement when data shape available
export const validateGiftbillsAirtimePaymentData =
  validateEbillsAirtimePaymentData;

// ################### PROVIDER-SPECIFIC VALIDATORS END ###################

const providerToAirtimePaymentDataValidatorMap = {
  [ProviderId.Ebills]: validateEbillsAirtimePaymentData,
  [ProviderId.Giftbills]: validateGiftbillsAirtimePaymentData,
};
