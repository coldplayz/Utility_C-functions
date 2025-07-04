/**
 * Note:
 * Initiate payment for postpaid utility product.
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
  TNairaMetadataUtilityWriteData,
  TPaymentData,
  TProcessData,
  TStatusDocsAccessData,
} from "../../../interface/types";
import updateUtilityTxStatusDocs from "../../../models/set/updateUtilityTxStatusDocs";
import ObjectValidator from "../../../helpers/@objectValidator";
import { AppTxStatus, ProviderTxStatus } from "../../../interface/enums";

export default class Postpaid {
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
      providerId: res.locals.providerId!,
      reference: res.locals.reference!,
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

  async processPostpaid() {
    try {
      console.log("####### PaymentData", this.data.paymentData); // TODO: remove
      this.validateProcessData();

      // Make payment
      const { customerId, amount, merchantId } = this.data.paymentData;
      const { status, metadata } = await this.data.provider.postpaid(
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
      const nairaMetadata: TNairaMetadataUtilityWriteData = {
        providerId: this.data.providerId,
        reference: this.data.reference,
        txPath: this.res.locals.txPath,
      };

      if (status === ProviderTxStatus.Failed) {
        await updateUtilityTxStatusDocs(docsAccessData, {
          status: AppTxStatus.Rejected,
          metadata: nairaMetadata,
        });

        // TODO: reversal request/message
        console.log("reversal to be initiated..."); // TODO: remove

        return Echo.HandleResponse(
          this.res,
          `${this.data.paymentData.merchantId} request failed!`,
          this.req.originalUrl
        );
      }

      // Request approved
      if (status === ProviderTxStatus.Successfull) {
        await updateUtilityTxStatusDocs(docsAccessData, {
          status: AppTxStatus.Approved,
          metadata: nairaMetadata,
        });

        // TODO: send token via FCM notification, or via any agreed token-delivery method
        console.log(`To send notification with token: ${metadata?.token}...`);

        return Echo.HandleResponse(
          this.res,
          `${this.data.paymentData.merchantId} request approved!`,
          this.req.originalUrl
        );
      }

      // Request pending
      await updateUtilityTxStatusDocs(docsAccessData, {
        status: AppTxStatus.Mempool,
        metadata: nairaMetadata,
      });

      return Echo.HandleResponse(
        this.res,
        `${this.data.paymentData.merchantId} request processing...`,
        this.req.originalUrl
      );
    } catch (error) {
      const err =
        error instanceof ErrorHandler
          ? error
          : new ErrorHandler(
              `error processing ${this.data.paymentData.merchantId} payment`,
              false,
              error
            );
      return Echo.HandleResponse(this.res, err, this.req.originalUrl);
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
  providerId: "required",
  reference: "required",
  "paymentData.customerId": "required|string",
  "paymentData.merchantId": "required|isUtilityMerchantId",
  "paymentData.productId": "required|isUtilityProductId",
  "paymentData.amount": `required|isNumber`,
  "paymentData.providerId": "required",
  "paymentData.planCode": "string",
  "paymentData.type": "isPlanType",
  "paymentData.planId": "string",
} satisfies { [k in keyof Flatten<DeepRequired<TProcessData>>]?: string };
