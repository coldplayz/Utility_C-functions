/**
 * Note:
 * Initiate payment for airtime utility product.
 *
 * - initiate payment to provider
 * - update db based on payment result
 */

import { Request, Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import {
  DeepRequired,
  Flatten,
  TPaymentData,
  TProcessData,
  TStatusDocsAccessData,
} from "../../../interface/types";
import updateUtilityTxStatusDocs from "../../../models/set/updateUtilityTxStatusDocs";
import ObjectValidator from "../../../helpers/@objectValidator";
import { AppTxStatus, ProviderTxStatus } from "../../../interface/enums";

export default class Airtime {
  data: TProcessData;

  constructor(public req: Request, public res: Response) {
    const data: TProcessData = {
      paymentData: {
        ...res.locals.utilityMeta,
        ...res.locals.planData,
      } as TPaymentData,
      uid: res.locals.uid!,
      appTxHash: res.locals.appTxHash!,
      nairaAdminDocPath: res.locals.nairaAdminDocPath!,
      txPath: res.locals.txPath!,
      provider: res.locals.provider!,
    };
    this.data = data;
  }

  validateProcessData() {
    const processDataValidator = new ObjectValidator(processDataRule);

    if (!processDataValidator.validate(this.data))
      throw new ErrorHandler("Error validating utility process data", false, {
        reason: processDataValidator.response,
        invalidData: this.data,
        source: this.validateProcessData.name,
      });
  }

  async processAirtime() {
    try {
      console.log("####### PaymentData", this.data.paymentData); // TODO: remove
      this.validateProcessData();

      // Make payment
      const { customerId, amount, merchantId } = this.data.paymentData;
      const { initialStatus } = await this.data.provider.airtime(
        customerId,
        amount,
        merchantId,
        this.data.appTxHash
      );

      // Update db based on payment result
      const docsAccessData: TStatusDocsAccessData = {
        uid: this.data.uid,
        appTxHash: this.data.appTxHash,
        nairaAdminDocPath: this.data.nairaAdminDocPath,
      };

      if (initialStatus === ProviderTxStatus.Failed) {
        await updateUtilityTxStatusDocs(docsAccessData, {
          status: AppTxStatus.Rejected,
        });

        // TODO: reversal request/message
        console.log("reversal to be initiated..."); // TODO: remove

        return Echo.HandleResponse(
          this.res,
          `${this.data.paymentData.merchantId} request failed!`,
          this.req.originalUrl
        );
      }

      // Request pending or approved
      await updateUtilityTxStatusDocs(docsAccessData, {
        status: AppTxStatus.Mempool,
      });

      return Echo.HandleResponse(
        this.res,
        `${this.data.paymentData.merchantId} request processing...`,
        this.req.originalUrl
      );
    } catch (error) {
      let defaultError = new ErrorHandler(
        `error processing ${this.data.paymentData.merchantId} payment`,
        false,
        error
      );
      if (error instanceof ErrorHandler) defaultError = error;
      return Echo.HandleResponse(this.res, defaultError, this.req.originalUrl);
    }
  }
}

// TODO: product-specific data validation
const processDataRule = {
  uid: "required",
  appTxHash: "required",
  nairaAdminDocPath: "required",
  provider: "required",
  txPath: "required",
  "paymentData.customerId": "required|string",
  "paymentData.merchantId": "required|isUtilityMerchantId",
  "paymentData.productId": "required|isUtilityProductId",
  "paymentData.amount": `required|isNumber`,
  "paymentData.providerId": "required",
  "paymentData.planCode": "string",
  "paymentData.type": "isPlanType",
  "paymentData.planId": "string",
} satisfies { [k in keyof Flatten<DeepRequired<TProcessData>>]?: string };
