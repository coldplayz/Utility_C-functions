import { Request, Response } from "express";
import ErrorHandler from "../../../errors/errManager";
import Echo from "../../../helpers/@response";
import {
  TStatusDocsAccessData,
  DeepRequired,
  Flatten,
} from "../../../interface/types";
import ObjectValidator from "../../../helpers/@objectValidator";
import updateUtilityTxStatusDocs from "../../../models/set/updateUtilityTxStatusDocs";
import {
  AppTxStatus,
  ProviderTxStatus,
  Utility,
} from "../../../interface/enums";
import BaseProvider from "../../../lib/external/providerBaseApi";

/** Data expected to come into the status-processing endpoint service class */
export type TStatusData = {
  provider: BaseProvider;
  reference: string;
  uid: string;
  appTxHash: string;
  nairaAdminDocPath: string;
  utility: Utility;
};
export default class ProcessStatus {
  data: TStatusData;

  constructor(public req: Request, public res: Response) {
    const data: TStatusData = {
      provider: res.locals.provider!,
      reference: res.locals.reference!,
      uid: res.locals.uid!,
      appTxHash: res.locals.appTxHash!,
      nairaAdminDocPath: res.locals.nairaAdminDocPath!,
      utility: res.locals.utility!,
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
    try {
      this.validateStatusData();

      // TODO: utility payment status check
      const { status } = await this.data.provider.checkStatus(
        this.data.reference!
      );

      // TODO: necessary business logic
      const docsAccessData: TStatusDocsAccessData = {
        uid: this.data.uid,
        appTxHash: this.data.appTxHash,
        nairaAdminDocPath: this.data.nairaAdminDocPath,
      };

      if (status === ProviderTxStatus.Failed) {
        await updateUtilityTxStatusDocs(docsAccessData, {
          status: AppTxStatus.Rejected,
        });

        // TODO: reversal request/message
        console.log("reversal to be initiated..."); // TODO: remove

        return Echo.HandleResponse(
          this.res,
          `${this.data.utility} request failed!`,
          this.req.originalUrl
        );
      }

      // TODO: add other metadata (e.g. settlement timestamp)???
      if (status === ProviderTxStatus.Successfull) {
        await updateUtilityTxStatusDocs(docsAccessData, {
          status: AppTxStatus.Approved,
        });
        return Echo.HandleResponse(
          this.res,
          `${this.data.utility} request approved!`,
          this.req.originalUrl
        );
      }

      // Request still pending
      return Echo.HandleResponse(
        this.res,
        `${this.data.utility} request still processing...`,
        this.req.originalUrl
      );
    } catch (error) {
      const err =
        error instanceof ErrorHandler
          ? error
          : new ErrorHandler(
              `error processing ${this.data?.utility || "utility"} status`,
              false,
              error
            );
      return Echo.HandleResponse(this.res, err, this.req.originalUrl);
    }
  }
}

const statusDataRule = {
  provider: "required",
  reference: `required`,
  appTxHash: `required`,
  nairaAdminDocPath: `required`,
  uid: `required`,
  utility: `required`,
} satisfies { [k in keyof Flatten<DeepRequired<TStatusData>>]: string };
