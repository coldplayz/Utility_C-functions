import { Request, Response } from "express";
import ErrorHandler from "../../../errors/errManager";
import Echo from "../../../helpers/@response";
import { TStatusDocsWriteTxData, AppTxStatus } from "../../../interface/types";
import getUtilityTxDoc from "../../../models/get/getUtilityTxDoc";
import BaseUtility from "../utils/baseUtility";

export default class ProcessStatus {
  async execute(req: Request, res: Response) {
    try {
      const statusQuery = res.locals.statusQuery;
      // status request query already validated; body to be validated by provider
      if (!statusQuery)
        throw new ErrorHandler(`Missing query data in ProcessStatus.`, false);

      const provider = BaseUtility.getProviderById(statusQuery.providerId);

      // TODO: utility payment status check
      const { status, txPath } = await provider.checkTxStatus(
        statusQuery,
        req.body
      );

      // Get validated transaction data
      const txData = await getUtilityTxDoc(txPath);
      const writeData: TStatusDocsWriteTxData = {
        uid: txData.userId,
        appTxHash: txData.hash,
        nairaAdminDocPath: txData.adminInfo.naira_path,
      };

      // TODO: necessary business logic
      if (status === AppTxStatus.Rejected) {
        await BaseUtility.handleFailedPayment(writeData);
        return Echo.HandleResponse(
          res,
          "utility request failed!",
          req.originalUrl
        );
      }
      if (status === AppTxStatus.Approved) {
        await BaseUtility.handleApprovedPayment(writeData);
        return Echo.HandleResponse(
          res,
          "utility request approved!",
          req.originalUrl
        );
      }

      // Request still pending
      return Echo.HandleResponse(
        res,
        "utility request processing...",
        req.originalUrl
      );
    } catch (error) {
      let defaultError = new ErrorHandler(
        "error processing utility status",
        false,
        error
      );
      if (error instanceof ErrorHandler) defaultError = error;
      return Echo.HandleResponse(res, defaultError, req.originalUrl);
    }
  }
}
