import { Request, Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import {
  ProviderId,
  ProviderTxStatus,
  TPaymentData,
  TStatusDocsWriteTxData,
} from "../../../interface/types";
import BaseUtility from "../utils/baseUtility";

export default class Bet {
  data: {
    paymentData: TPaymentData;
    providerId: ProviderId;
    uid: string;
    appTxHash: string;
    nairaAdminDocPath: string;
  };

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
      const { initialStatus, statusUpdateMethods } = await provider[
        this.data.paymentData.productId
      ](this.data.paymentData);

      // TODO: necessary business logic
      const writeData: TStatusDocsWriteTxData = {
        uid: this.data.uid,
        appTxHash: this.data.appTxHash,
        nairaAdminDocPath: this.data.nairaAdminDocPath,
      };

      if (initialStatus === ProviderTxStatus.Failed) {
        await BaseUtility.handleFailedPayment(writeData);
        return Echo.HandleResponse(
          this.res,
          `${this.data.paymentData.merchantId} request failed!`,
          this.req.originalUrl
        );
      }

      // Request pending or approved
      if (statusUpdateMethods.isPullFromProvider)
        await BaseUtility.handleInitialPendingOrApprovedPayment(writeData); // else webhook status update method; do nothing

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
