import { Request, Response } from "express";
import ErrorHandler from "../../../errors/errManager";
import Echo from "../../../helpers/@response";
import {
  TStatusDocsAccessData,
  AppTxStatus,
  DeepRequired,
  Flatten,
  TStatusData,
} from "../../../interface/types";
import getUtilityTxDoc from "../../../models/get/getUtilityTxDoc";
import BaseUtility from "../utils/baseUtility";
import ObjectValidator from "../../../helpers/@objectValidator";
import updateUtilityTxStatusDocs from "../../../models/set/updateUtilityTxStatusDocs";

export default class ProcessStatus {
  data: TStatusData;

  constructor(public req: Request, public res: Response) {
    const data: TStatusData = {
      providerId: res.locals.providerId!,
      queryStatus: res.locals.queryStatus!,
      reference: res.locals.reference,
      txPath: res.locals.txPath,
    };
    this.data = data;
  }

  validateStatusData() {
    const statusDataValidator = new ObjectValidator(statusDataRule);

    if (!statusDataValidator.validate(this.data))
      throw new ErrorHandler("Error validating status data", false, {
        reason: statusDataValidator.response,
        invalidData: this.data,
        source: this.validateStatusData.name,
      });
  }

  async execute() {
    let txData;

    try {
      this.validateStatusData();

      const provider = BaseUtility.getProviderById(this.data.providerId);

      // TODO: utility payment status check
      const { status, txPath } = await provider.checkStatus(
        this.data,
        this.req.body
      );

      // Get validated transaction data
      txData = await getUtilityTxDoc(txPath);
      const docsAccessData: TStatusDocsAccessData = {
        uid: txData.userId,
        appTxHash: txData.hash,
        nairaAdminDocPath: txData.adminInfo.naira_path,
      };

      // TODO: necessary business logic
      if (status === AppTxStatus.Rejected) {
        await updateUtilityTxStatusDocs(docsAccessData, {
          status: AppTxStatus.Rejected,
        });
        return Echo.HandleResponse(
          this.res,
          `${txData.utility} request failed!`,
          this.req.originalUrl
        );
      }
      if (status === AppTxStatus.Approved) {
        await updateUtilityTxStatusDocs(docsAccessData, {
          status: AppTxStatus.Approved,
        });
        return Echo.HandleResponse(
          this.res,
          `${txData.utility} request approved!`,
          this.req.originalUrl
        );
      }

      // Request still pending
      return Echo.HandleResponse(
        this.res,
        `${txData.utility} request processing...`,
        this.req.originalUrl
      );
    } catch (error) {
      let defaultError = new ErrorHandler(
        `error processing ${txData?.utility || "utility"} status`,
        false,
        error
      );
      if (error instanceof ErrorHandler) defaultError = error;
      return Echo.HandleResponse(this.res, defaultError, this.req.originalUrl);
    }
  }
}

const statusDataRule = {
  providerId: "required",
  queryStatus: "required",
  reference: `required_if:queryStatus,${AppTxStatus.Mempool}`,
  txPath: `required_if:queryStatus,${AppTxStatus.Mempool}`,
} satisfies { [k in keyof Flatten<DeepRequired<TStatusData>>]?: string };
