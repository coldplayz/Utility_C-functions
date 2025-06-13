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
    const utilityMeta = res.locals.utilityMeta; // TODO: -> reasonMeta???
    if (!utilityMeta)
      throw new ErrorHandler("No utilityMeta in locals!", false, {
        source: validateAirtimePaymentData.name,
      });

    if (!res.locals.appTxHash!)
      throw new ErrorHandler("No appTxHash in locals!", false, {
        source: validateAirtimePaymentData.name,
      });

    providerToAirtimePaymentDataValidatorMap[res.locals.providerId!](req, res); // TODO: set provider in locals/utilityMeta

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    let defaultError = new ErrorHandler(
      `error validating airtime payment data`,
      false,
      error
    );
    if (error instanceof ErrorHandler) defaultError = error;
    return Echo.HandleResponse(res, defaultError, req.originalUrl);
  }
}

const providerToAirtimePaymentDataValidatorMap = {
  [ProviderId.Ebills]: validateEbillsAirtimePaymentData,
};

// PROVIDER-SPECIFIC VALIDATORS
const ebillsAirtimePaymentDataRule: {
  [K in keyof TEbillsAirtimePaymentData]: string;
} = {
  request_id: "required|string",
  phone: "required|string",
  service_id: "required|string",
  amount: "required|isNumber",
};
const ebillsAirtimePaymentDataValidator =
  new ObjectValidator<TEbillsAirtimePaymentData>(ebillsAirtimePaymentDataRule);
export function validateEbillsAirtimePaymentData(req: Request, res: Response) {
  try {
    const utilityMeta = res.locals
      .utilityMeta as unknown as TEbillsAirtimePaymentData; // TODO: -> reasonMeta???

    if (!ebillsAirtimePaymentDataValidator.validate(utilityMeta))
      throw new ErrorHandler("Error validating payment data!", true, {
        source: validateEbillsAirtimePaymentData.name,
        reason: ebillsAirtimePaymentDataValidator.response,
      });

    res.locals.paymentData = {
      reference: res.locals.appTxHash!,
      customerId: utilityMeta.phone,
      merchantId: utilityMeta.service_id,
      amount: utilityMeta.amount,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    let defaultError = new ErrorHandler(
      `error validating ebills airtime payment data`,
      false,
      error
    );
    if (error instanceof ErrorHandler) defaultError = error;
    return Echo.HandleResponse(res, defaultError, req.originalUrl);
  }
}
