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
  TNairaAdminTxWriteData,
  TUtilityWithdrawalWriteData,
} from "../../../interface/types";
import ObjectValidator from "../../../helpers/@objectValidator";
import updateUtilityTxStatusDocs from "../../../models/set/updateUtilityTxStatusDocs";
import { AppTxStatus, ProviderTxStatus } from "../../../interface/enums";
import BaseProvider from "../../../lib/external/providerBaseApi";
import { unix } from "../../../helpers/@time";
import { IProviderRequeryResult } from "../../../interface/interfaces";
import NairaAdminCollectionSchema from "../../../models/schema/_nairaAdminCollectionSchema";
import UtilityTxCollectionSchema from "../../../models/schema/_utilityTxCollectionSchema";

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
      merchantId: res.locals.reasonMeta?.merchant,
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

  getUtilityUpdateData(
    requeryStatus: AppTxStatus,
    requeryMeta: IProviderRequeryResult
  ) {
    try {
      const isSettled =
        requeryStatus === AppTxStatus.Rejected ||
        requeryStatus === AppTxStatus.Approved;

      const utilityUpdate: UtilityData = {
        ...(isSettled && { "utility.settledAt": unix() }),
        "utility.status": requeryStatus,
        ...(requeryMeta.metadata?.token && {
          "utility.token": requeryMeta.metadata?.token,
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

  getNairaAdminUpdateData(requeryStatus: AppTxStatus) {
    try {
      const nairaAdminUpdate: TNairaAdminTxWriteData = {
        utilityStatus: requeryStatus,
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

  async execute() {
    try {
      this.validateStatusData();

      const requeryResult = await this.data.provider.checkStatus(
        this.data.appOrderId,
        this.data.providerOrderId
      );

      // Prepare data to update docs with
      const docsAccessData: TStatusDocsAccessData = {
        uid: this.data.uid,
        appTxHash: this.data.appTxHash,
        nairaAdminDocPath: this.data.nairaAdminDocPath,
      };
      const paymentStatus =
        requeryResult.status === ProviderTxStatus.Failed
          ? AppTxStatus.Rejected
          : requeryResult.status === ProviderTxStatus.Successfull
          ? AppTxStatus.Approved
          : AppTxStatus.Mempool;
      const utilityUpdate: UtilityData = this.getUtilityUpdateData(
        paymentStatus,
        requeryResult
      );
      const nairaAdminUpdate = this.getNairaAdminUpdateData(paymentStatus);

      // Update docs
      await updateUtilityTxStatusDocs(docsAccessData, {
        utilityUpdate,
        nairaAdminUpdate,
      });

      return Echo.HandleResponse(
        this.res,
        `${this.data.merchantId} request ${requeryResult.status}!`,
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

type UtilityData = Partial<Flatten<DeepRequired<TUtilityWithdrawalWriteData>>>;
