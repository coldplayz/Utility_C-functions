import { AxiosError } from "axios";
import { logger } from "../../helpers/@logger";
import { ProviderId, ProviderTxStatus } from "../../interface/enums";

export default abstract class BaseProvider {
  abstract id: ProviderId;
  abstract apiToProviderStatusMap: Record<string, ProviderTxStatus>;

  // mobile handler
  abstract airtime(
    phoneNumber: string,
    amount: number,
    merchantId: string,
    txHash: string
  ): Promise<ProviderTxStatus>;

  abstract internet(
    phoneNumber: string,
    merchantId: string,
    planCode: string,
    txHash: string
  ): Promise<ProviderTxStatus>;

  // cable tv handler
  abstract cableTv(
    smartCardNumber: string,
    amount: number,
    merchantId: string,
    planCode: string,
    type: string,
    txHash: string
  ): Promise<ProviderTxStatus>;

  // electricity handler
  abstract postpaid(
    meterNumber: string,
    amount: number,
    merchantId: string,
    txHash: string
  ): Promise<ProviderTxStatus>;

  abstract prepaid(
    meterNumber: string,
    amount: number,
    merchantId: string,
    txHash: string
  ): Promise<ProviderTxStatus>;

  // bet handler
  abstract bet(
    accountId: string,
    amount: number,
    merchantId: string,
    txHash: string
  ): Promise<ProviderTxStatus>;

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
   * Ensures the data returned in an API call is the expected one.
   * @param data - data (response.data) returned from an API call.
   * @param requirelist - list of properties whose presence is required for this validation.
   * @throws ErrorHandler, if data doesn't meet the expected format.
   */
  abstract validatePaymentResponseData(
    data: unknown,
    requirelist: unknown[]
  ): void;

  /**
   * Return an appropriate status for different AxiosError cases.
   * @param error - an Axios error object
   * @returns a recognized provider transaction status.
   */
  handleAxiosError(error: AxiosError): ProviderTxStatus {
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
}
