/**
 * Note:
 *
 * Base class defining the API contract for all utility providers.
 */

import { AxiosError } from "axios";
import { logger } from "../../helpers/@logger";
import { ProviderId, ProviderTxStatus } from "../../interface/enums";
import {
  IProviderPaymentResult,
  IProviderRequeryResult,
} from "../../interface/interfaces";

export default abstract class BaseProvider {
  abstract id: ProviderId;
  abstract apiToProviderStatusMap: Record<string, ProviderTxStatus>;

  // mobile handler
  abstract airtime(
    phoneNumber: string,
    amount: number,
    merchantId: string,
    txHash: string
  ): Promise<IProviderPaymentResult>;

  abstract internet(
    phoneNumber: string,
    merchantId: string,
    planCode: string,
    txHash: string
  ): Promise<IProviderPaymentResult>;

  // cable tv handler
  abstract cableTv(
    smartCardNumber: string,
    merchantId: string,
    planCode: string,
    txHash: string
  ): Promise<IProviderPaymentResult>;

  // electricity handler
  abstract postpaid(
    meterNumber: string,
    amount: number,
    merchantId: string,
    txHash: string
  ): Promise<IProviderPaymentResult>;

  abstract prepaid(
    meterNumber: string,
    amount: number,
    merchantId: string,
    txHash: string
  ): Promise<IProviderPaymentResult>;

  // bet handler
  abstract bet(
    accountId: string,
    amount: number,
    merchantId: string,
    txHash: string
  ): Promise<IProviderPaymentResult>;

  /**
   * Calls the provider's requery endpoint to get the latest status of a utility payment transaction.
   * @param reference - the unique ID for the payment request.
   * @returns the current payment status, as well as any related metadata (e.g. electricity token)
   */
  abstract checkStatus(reference: string): Promise<IProviderRequeryResult>;

  /**
   * Map status returned, in an API call, to an app-recognized status.
   * @param apiStatus - the status returned in a [payment] API call.
   * @param providerId - the app-recognized identifier for the utility provider.
   * @returns an app recognized provider transaction status (pending, successful, or failed).
   */
  parseApiStatus(apiStatus: string, providerId: ProviderId): ProviderTxStatus {
    const providerStatus =
      this.apiToProviderStatusMap[
        apiStatus as keyof typeof this.apiToProviderStatusMap
      ];

    if (!providerStatus) {
      logger.error(`API status (${apiStatus}) not in map for ${providerId}`);
      return ProviderTxStatus.Pending; // default
    }

    return providerStatus;
  }

  /**
   * Ensures the data returned in a payment API call is the expected one.
   * @param data - data (response.data) returned from an API call.
   * @param requirelist - list of properties whose presence is required for this validation.
   * @throws ErrorHandler, if data doesn't meet the expected format.
   */
  abstract validatePaymentResponseData(
    data: unknown,
    requirelist: unknown[]
  ): void;

  /**
   * Ensures the data returned in a requery API call is the expected one.
   * @param data - data (response.data) returned from an API call.
   * @param requirelist - list of properties whose presence is required for this validation.
   * @throws ErrorHandler, if data doesn't meet the expected format.
   */
  abstract validateRequeryResponseData(
    data: unknown,
    requirelist: unknown[]
  ): void;

  /**
   * Return an appropriate status for different AxiosError cases during utility payment.
   * @param error - an Axios error object
   * @returns a recognized provider transaction status.
   */
  handlePaymentAxiosError(error: AxiosError): ProviderTxStatus {
    logger.error(
      `An axios error occured! code: ${error.code}; message: ${error.message}`,
      { error: { responseData: error.response?.data } }
    );

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status >= 500) return ProviderTxStatus.Pending;
      else return ProviderTxStatus.Failed; // 4xx errors likely
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      return ProviderTxStatus.Pending; // we'll requery to be on the safe side
    } else {
      // Something happened in setting up the request that triggered an Error
      // TODO: look into returning different statuses for different error codes
      return ProviderTxStatus.Failed;
    }
  }

  /**
   * Return an appropriate status for different AxiosError cases on status requery.
   * @param error - an Axios error object
   * @returns a recognized provider transaction status.
   */
  handleRequeryAxiosError(error: AxiosError): ProviderTxStatus {
    logger.error(
      `An axios error occured! code: ${error.code}; message: ${error.message}`,
      { error: { responseData: error.response?.data } }
    );

    // Default implementation
    return ProviderTxStatus.Pending; // we'll requery to be on the safe side
  }
}
