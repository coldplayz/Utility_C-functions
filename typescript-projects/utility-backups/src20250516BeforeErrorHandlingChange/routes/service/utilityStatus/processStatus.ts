/**
 * Notes:
 *
 * The exported class takes care of utility transactions requery at providers.
 *
 * - query the status of a transaction at the provider
 * - update the status on our end (app) and take any required action:
 *   - on failure provider status, update app status to rejected and initiate reversal
 *   - on success, update app status to approved (and, in the case of electricity, probably send token)
 *   - on pending, do nothing (requery will be triggered again by mempool)
 */

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
import { AppTxStatus, ProviderTxStatus } from "../../../interface/enums";
import BaseProvider from "../../../lib/external/providerBaseApi";

/** Data expected to come into the status-processing endpoint service class */
export type TStatusData = {
  provider: BaseProvider;
  /** ID of the utility payment tx we generate and supply to the provider */
  appOrderId: string;
  /** ID of the utility payment tx the provider generates and sends back to us */
  providerOrderId: string;
  uid: string;
  appTxHash: string;
  nairaAdminDocPath: string;
  merchantId?: string;
};

export default class ProcessStatus {
  data: TStatusData;

  constructor(public req: Request, public res: Response) {
    const data: TStatusData = {
      provider: res.locals.provider!,
      appOrderId: res.locals.appOrderId!,
      providerOrderId: res.locals.providerOrderId!,
      uid: res.locals.uid!,
      appTxHash: res.locals.appTxHash!,
      nairaAdminDocPath: res.locals.nairaAdminDocPath!,
      merchantId: res.locals.utilityMeta?.merchant,
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

      const { status } = await this.data.provider.checkStatus(
        this.data.appOrderId,
        this.data.providerOrderId
      );

      // Update DB (app status and related data) based on provider status evaluation
      const docsAccessData: TStatusDocsAccessData = {
        uid: this.data.uid,
        appTxHash: this.data.appTxHash,
        nairaAdminDocPath: this.data.nairaAdminDocPath,
      };

      if (status === ProviderTxStatus.Failed) {
        // Update app status and initiate reversal
        await updateUtilityTxStatusDocs(docsAccessData, {
          status: AppTxStatus.Rejected,
        });

        // TODO: reversal request/message
        console.log("reversal to be initiated..."); // TODO: remove

        return Echo.HandleResponse(
          this.res,
          `${this.data.merchantId || "utility"} request failed!`,
          this.req.originalUrl
        );
      }

      // TODO: add other metadata (e.g. settlement timestamp)???
      if (status === ProviderTxStatus.Successfull) {
        // Utility payment request successful
        await updateUtilityTxStatusDocs(docsAccessData, {
          status: AppTxStatus.Approved,
        });
        return Echo.HandleResponse(
          this.res,
          `${this.data.merchantId || "utility"} request approved!`,
          this.req.originalUrl
        );
      }

      // Request still pending
      return Echo.HandleResponse(
        this.res,
        `${this.data.merchantId || "utility"} request still processing...`,
        this.req.originalUrl
      );
    } catch (error) {
      const err =
        error instanceof ErrorHandler
          ? error
          : new ErrorHandler(
              `error processing ${this.data.merchantId || "utility"} status`,
              false,
              error
            );
      return Echo.HandleResponse(this.res, err, this.req.originalUrl);
    }
  }
}

const statusDataRule = {
  provider: "required",
  appOrderId: `required`,
  providerOrderId: `string`,
  appTxHash: `required`,
  nairaAdminDocPath: `required`,
  uid: `required`,
  merchantId: `string`,
} satisfies { [k in keyof Flatten<DeepRequired<TStatusData>>]: string };
