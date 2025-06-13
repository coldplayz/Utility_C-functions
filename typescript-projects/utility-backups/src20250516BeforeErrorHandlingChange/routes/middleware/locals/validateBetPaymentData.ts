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
    const utilityMeta = res.locals.utilityMeta; // TODO: -> reasonMeta???
    if (!utilityMeta)
      throw new ErrorHandler("No utilityMeta in locals!", false, {
        source: validateBetPaymentData.name,
      });

    if (!res.locals.appTxHash!)
      throw new ErrorHandler("No appTxHash in locals!", false, {
        source: validateBetPaymentData.name,
      });

    providerToBetPaymentDataValidatorMap[res.locals.providerId!](req, res); // TODO: set provider in locals/utilityMeta

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

const providerToBetPaymentDataValidatorMap = {
  [ProviderId.Ebills]: validateEbillsBetPaymentData,
};

// ################### PROVIDER-SPECIFIC VALIDATORS ###################

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
    const utilityMeta = res.locals
      .utilityMeta as unknown as TEbillsBetPaymentData; // TODO: -> reasonMeta???

    const dataToValidate = {
      provider: utilityMeta.provider,
      customerId: utilityMeta.customerId,
      merchant: utilityMeta.merchant,
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
