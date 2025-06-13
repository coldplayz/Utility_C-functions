import { ProviderTxStatus } from "./enums";

export interface IUtilityStatusTxResult {
  statusDocsWritten: boolean;
}

// TODO: add other metadata from the payment request to save in DB
export interface IProviderPaymentResult {
  initialStatus: ProviderTxStatus;
  /** How status update is retrieved; push-to-app (webhook) or pull-from-provider (requery) */
  statusUpdateMethods: { isWebhook: boolean; isRequery: boolean };
  /** Unique (per utility request to provider) reference sent in utility request */
  txRef: string;
}
