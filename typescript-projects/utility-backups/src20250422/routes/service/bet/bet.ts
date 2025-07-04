import { Request, Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import ObjectValidator from "../../../helpers/@objectValidator";
import providerX from "../../../lib/external/providerX";
import {
  ProviderTxStatus,
  TStatusDocsWriteTxData,
} from "../../../interface/types";
import BaseUtility from "../utils/baseUtility";

export default class Bet {
  constructor() {}

  async processBet(req: Request, res: Response) {
    try {
      // TODO: utility payment
      // TODO: use providerId from request to get provider (as in status logic)
      const { initialStatus, statusUpdateMethods } = await providerX.payBet();

      // TODO: necessary business logic
      const writeData: TStatusDocsWriteTxData = {
        uid: res.locals.uid!,
        appTxHash: res.locals.appTxHash!,
        nairaAdminDocPath: res.locals.nairaAdminDocPath!,
      };
      this.validateProcessData(writeData);

      if (initialStatus === ProviderTxStatus.Failed) {
        await BaseUtility.handleFailedPayment(writeData);
        return Echo.HandleResponse(res, "Bet request failed!", req.originalUrl);
      }

      // Request pending or approved
      if (statusUpdateMethods.isPullFromProvider)
        await BaseUtility.handleInitialPendingOrApprovedPayment(writeData); // else webhook status update method; do nothing

      return Echo.HandleResponse(
        res,
        "Bet request processing...",
        req.originalUrl
      );
    } catch (error) {
      let defaultError = new ErrorHandler(
        "error processing bet payment",
        false,
        error
      );
      if (error instanceof ErrorHandler) defaultError = error;
      return Echo.HandleResponse(res, defaultError, req.originalUrl);
    }
  }

  validateProcessData(data: TStatusDocsWriteTxData) {
    if (!processDataValidator.validate(data))
      throw new ErrorHandler("process data validation error", false, {
        reason: processDataValidator.response,
        service: this.constructor.name,
      });
  }
}

type ProcessData = {
  uid: string;
  /** hash of naira withdrawal tx, which also serves as tx doc ID */
  appTxHash: string;
  /** full path to the related naira_admin doc */
  nairaAdminDocPath: string;
};
const processDataValidatorRule: {
  [k in keyof ProcessData]: string;
} = {
  uid: "required|string",
  appTxHash: "required|string",
  nairaAdminDocPath: "required|string",
};
const processDataValidator = new ObjectValidator(processDataValidatorRule);
