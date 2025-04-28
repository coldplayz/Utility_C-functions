import { Request, Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import {
  AppTxStatus,
  ProviderTxStatus,
  TPaymentData,
  TProcessData,
  TStatusDocsAccessData,
} from "../../../interface/types";
import BaseUtility from "../utils/baseUtility";
import updateUtilityTxStatusDocs from "../../../models/set/updateUtilityTxStatusDocs";

export default class Bet {
  data: TProcessData;

  constructor(public req: Request, public res: Response) {
    const data = {
      paymentData: {
        ...res.locals.utilityMeta,
        ...(res.locals.utilityMeta?.planId && {
          planData: res.locals.planData,
        }),
      } as TPaymentData,
      providerId: res.locals.providerId!,
      uid: res.locals.uid!,
      appTxHash: res.locals.appTxHash!,
      nairaAdminDocPath: res.locals.nairaAdminDocPath!,
      txPath: res.locals.txPath!,
    };
    this.data = data;
  }

  async processBet() {
    try {
      console.log("####### PaymentData", this.data.paymentData); // TODO: remove
      BaseUtility.validateProcessData(this.data);

      // Get provider to use in fulfilling request
      const provider = BaseUtility.getProviderById(this.data.providerId);

      // Make payment
      const { initialStatus, statusUpdateMethods, txRef } = await provider[
        this.data.paymentData.productId
      ](this.data.paymentData, this.data.txPath);

      // TODO: necessary business logic
      const docsAccessData: TStatusDocsAccessData = {
        uid: this.data.uid,
        appTxHash: this.data.appTxHash,
        nairaAdminDocPath: this.data.nairaAdminDocPath,
      };
      const metadata = {
        providerId: this.data.providerId,
        reference: txRef,
        txPath: this.data.txPath,
      };

      if (initialStatus === ProviderTxStatus.Failed) {
        await updateUtilityTxStatusDocs(docsAccessData, {
          status: AppTxStatus.Rejected,
          metadata,
        });
        return Echo.HandleResponse(
          this.res,
          `${this.data.paymentData.merchantId} request failed!`,
          this.req.originalUrl
        );
      }

      // Request pending or approved
      if (statusUpdateMethods.isRequery)
        await updateUtilityTxStatusDocs(docsAccessData, {
          status: AppTxStatus.Mempool,
          metadata,
        });
      // else webhook status-update method; write metadata without status update
      else await updateUtilityTxStatusDocs(docsAccessData, { metadata }); // else webhook status update method; do nothing

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
