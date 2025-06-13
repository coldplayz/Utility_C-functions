import { ProviderTxStatus } from "./enums";

export interface IUtilityStatusTxResult {
  statusDocsWritten: boolean;
}

// TODO: add other metadata from the payment request to save in DB
export interface IProviderPaymentResult {
  status: ProviderTxStatus;
  /** ID of the utility payment tx the provider generates and sends back to us */
  providerOrderId: string;
  metadata?: {
    /** Token for recharging prepaid or postpaid electricity units */
    token?: string;
  };
}

export interface IProviderRequeryResult {
  status: ProviderTxStatus;
  metadata?: {
    /** Token for recharging prepaid or postpaid electricity units */
    token?: string;
  };
}
