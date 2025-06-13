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
  TUtilityWithdrawalWriteData,
  TProcessData,
  TStatusDocsAccessData,
  TNairaAdminTxWriteData,
} from "../../../interface/types";
import updateUtilityTxStatusDocs from "../../../models/set/updateUtilityTxStatusDocs";
import ObjectValidator from "../../../helpers/@objectValidator";
import { AppTxStatus, ProviderTxStatus } from "../../../interface/enums";
import NairaAdminCollectionSchema from "../../../models/schema/_nairaAdminCollectionSchema";
import UtilityTxCollectionSchema from "../../../models/schema/_utilityTxCollectionSchema";
import { IProviderPaymentResult } from "../../../interface/interfaces";
import { unix } from "../../../helpers/@time";

export default class Postpaid {
  data: TProcessData;

  constructor(public req: Request, public res: Response) {
    const data: TProcessData = {
      paymentData: res.locals.paymentData!,
      uid: res.locals.uid!,
      appTxHash: res.locals.appTxHash!,
      nairaAdminDocPath: res.locals.nairaAdminDocPath!,
      txPath: res.locals.txPath!,
      provider: res.locals.provider!,
      providerId: res.locals.providerId!,
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

  getUtilityUpdateData(
    paymentStatus: AppTxStatus,
    paymentMeta: IProviderPaymentResult
  ) {
    try {
      const isSettled =
        paymentStatus === AppTxStatus.Rejected ||
        paymentStatus === AppTxStatus.Approved;

      const utilityUpdate: UtilityData = {
        "utility.providerId": this.data.providerId,
        "utility.appOrderId": this.data.paymentData.appOrderId,
        ...(paymentMeta.metadata?.balanceBefore && {
          "utility.balanceBefore": paymentMeta.metadata?.balanceBefore,
        }),
        ...(paymentMeta.metadata?.balanceAfter && {
          "utility.balanceAfter": paymentMeta.metadata?.balanceAfter,
        }),
        ...(paymentMeta.metadata?.acknowledgedAt && {
          "utility.acknowledgedAt": paymentMeta.metadata?.acknowledgedAt,
        }),
        ...(isSettled && { "utility.settledAt": unix() }),
        "utility.providerOrderId": paymentMeta.providerOrderId,
        "utility.status": paymentStatus,
        ...(paymentMeta.metadata?.token && {
          "utility.token": paymentMeta.metadata?.token,
        }),
      };

      new UtilityTxCollectionSchema(utilityUpdate).validate();

      return utilityUpdate;
    } catch (error) {
      throw new ErrorHandler("Error validating utility update data", false, {
        error,
        method: this.getUtilityUpdateData.name,
        class: this.constructor.name,
      });
    }
  }

  getNairaAdminUpdateData(paymentStatus: AppTxStatus) {
    try {
      const nairaAdminUpdate: TNairaAdminTxWriteData = {
        utilityStatus: paymentStatus,
      };

      new NairaAdminCollectionSchema(nairaAdminUpdate).validate();

      return nairaAdminUpdate;
    } catch (error) {
      throw new ErrorHandler(
        "Error validating naira admin update data",
        false,
        {
          error,
          method: this.getNairaAdminUpdateData.name,
          class: this.constructor.name,
        }
      );
    }
  }

  async processPostpaid() {
    try {
      console.log("####### PaymentData", this.data.paymentData); // TODO: remove
      this.validateProcessData();

      // Make payment
      const { customerId, amount, merchantId } = this.data.paymentData;
      const paymentResult = await this.data.provider.postpaid(
        customerId,
        amount!,
        merchantId,
        this.data.paymentData.appOrderId
      );

      // Prepare data to update docs with
      const docsAccessData: TStatusDocsAccessData = {
        uid: this.data.uid,
        appTxHash: this.data.appTxHash,
        nairaAdminDocPath: this.data.nairaAdminDocPath,
      };
      const paymentStatus =
        paymentResult.status === ProviderTxStatus.Failed
          ? AppTxStatus.Rejected
          : AppTxStatus.Mempool;
      const utilityUpdate: UtilityData = this.getUtilityUpdateData(
        paymentStatus,
        paymentResult
      );
      const nairaAdminUpdate = this.getNairaAdminUpdateData(paymentStatus);

      if (paymentResult.status === ProviderTxStatus.Successfull) {
        // Request approved

        // TODO: send token via FCM notification, or via any agreed token-delivery method
        console.log(
          `To send notification with token: ${paymentResult.metadata?.token}...`
        );
      }

      // Update docs
      await updateUtilityTxStatusDocs(docsAccessData, {
        utilityUpdate,
        nairaAdminUpdate,
      });

      return Echo.HandleResponse(
        this.res,
        `${this.data.paymentData.merchantId} request ${paymentResult.status}!`,
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
  "paymentData.customerId": "required",
  "paymentData.merchantId": "required",
  "paymentData.amount": `required`,
  "paymentData.appOrderId": "required",
} satisfies { [k in keyof Flatten<DeepRequired<TProcessData>>]?: string };

type UtilityData = Partial<Flatten<DeepRequired<TUtilityWithdrawalWriteData>>>;
