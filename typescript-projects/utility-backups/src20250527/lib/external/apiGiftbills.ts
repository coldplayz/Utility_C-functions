/**
 * Notes:
 *
 * The exported class exposes logic for the Giftbills API (VAS currently).
 *
 * Note on provider-specific quirks and nuances:
 * - requery:
 *   - status 200 && success 0 === invalid api key
 *   - status 404  === order ID not found? (tried with empty string)
 * - pay:
 *   - status 200 && success 0 === invalid api key
 *   - status 200 && success [false, 0] === invalid header
 *   - status 200 && success false === incomplete request data
 * - all:
 *   - SEEMS status 200 && success [false, 0] indicates a failed tx, suggesting that the `success` property is best indicator of a failed tx
 */

import axios, { AxiosError } from "axios";
import ErrorHandler from "../../errors/errManager";
import parsedEnv from "../../helpers/@loadConfig";
import { logger } from "../../helpers/@logger";
import { ProviderId, ProviderTxStatus } from "../../interface/enums";
import {
  IProviderPaymentResult,
  IProviderRequeryResult,
} from "../../interface/interfaces";
import BaseProvider from "./providerBaseApi";
import { createHmac } from "crypto";
import path from "path";
import { generateRandomIntRange } from "../../helpers/@generateRandom";
import { unix } from "../../helpers/@time";

export class Giftbills extends BaseProvider {
  id = ProviderId.Giftbills;
  apiToProviderStatusMap = {
    delivered: ProviderTxStatus.Successfull,
    successful: ProviderTxStatus.Successfull,
    success: ProviderTxStatus.Successfull,
    fail: ProviderTxStatus.Failed,
    pending: ProviderTxStatus.Pending,
    [ProviderTxStatus.Failed]: ProviderTxStatus.Failed,
  };
  accessToken: string | null = null;

  async airtime(
    _phoneNumber: string,
    _amount: number,
    _merchantId: string,
    _appOrderId: string
  ): Promise<IProviderPaymentResult> {
    try {
      throw new ErrorHandler(`Airtime not implemented for ${this.id}`, false);
    } catch (error) {
      return { status: ProviderTxStatus.Failed, providerOrderId: "" };
    }
  }

  async internet(
    _phoneNumber: string,
    _merchantId: string,
    _planCode: string,
    _appOrderId: string
  ): Promise<IProviderPaymentResult> {
    try {
      throw new ErrorHandler(`Internet not implemented for ${this.id}`, false);
    } catch (error) {
      return { status: ProviderTxStatus.Failed, providerOrderId: "" };
    }
  }

  async cableTv(
    _smartCardNumber: string,
    _merchantId: string,
    _planCode: string,
    _appOrderId: string
  ): Promise<IProviderPaymentResult> {
    try {
      throw new ErrorHandler(`Cable TV not implemented for ${this.id}`, false);
    } catch (error) {
      return { status: ProviderTxStatus.Failed, providerOrderId: "" };
    }
  }

  async postpaid(
    _meterNumber: string,
    _amount: number,
    _merchantId: string,
    _appOrderId: string
  ): Promise<IProviderPaymentResult> {
    try {
      throw new ErrorHandler(`Postpaid not implemented for ${this.id}`, false);
    } catch (error) {
      return { status: ProviderTxStatus.Failed, providerOrderId: "" };
    }
  }

  async prepaid(
    _meterNumber: string,
    _amount: number,
    _merchantId: string,
    _appOrderId: string
  ): Promise<IProviderPaymentResult> {
    try {
      throw new ErrorHandler(`Prepaid not implemented for ${this.id}`, false);
    } catch (error) {
      return { status: ProviderTxStatus.Failed, providerOrderId: "" };
    }
  }

  async bet(
    accountId: string,
    amount: number,
    merchantId: string,
    appOrderId: string
  ): Promise<IProviderPaymentResult> {
    try {
      let balanceBefore: number;

      try {
        balanceBefore = await this.getWalletBalance();
      } catch (err) {
        return {
          status: ProviderTxStatus.Failed,
          providerOrderId: "",
        };
      }

      const body = {
        provider: merchantId,
        customerId: accountId,
        amount: amount.toString(), // sending a number results in the VERY confusing: "Reseller/Agent Authentication Failed [A.A.E.101]" error. Took me AGES to debug.
        reference: appOrderId + generateRandomIntRange(), // TODO: fix after test (remove random number)
      };

      const headers = {
        Authorization: `Bearer ${parsedEnv.GIFTBILLS_API_KEY}`,
        MerchantId: parsedEnv.GIFTBILLS_MERCHANT_ID,
        "Content-Type": "application/json",
        Encryption: this.getHmacOf(body),
      };

      const { data } = await axios({
        method: "post",
        url: path.join(parsedEnv.GIFTBILLS_BASE_URL, "/betting/topup"),
        data: body,
        headers,
      }).catch((error) => {
        // handle provider errors and return appropriate response
        if (axios.isAxiosError(error))
          return {
            data: { data: { status: this.handlePaymentAxiosError(error) } },
          };

        throw error; // some unknown error
      });

      const balanceAfter = await this.getWalletBalance();
      const acknowledgedAt = unix();
      const responseData = data as TPaymentResponseData;

      if (!data.success) {
        logger.error(``, { error: data });
        return {
          status: ProviderTxStatus.Failed,
          providerOrderId: data.data?.orderNo?.toString() || "",
        };
      }

      // Validate response and see if it match expectation
      const status = responseData?.data?.status;
      if (!status)
        throw new ErrorHandler("No status in response data", false, {
          invalidResponse: responseData,
          method: this.bet.name,
          class: this.constructor.name,
        });

      const orderNo = responseData?.data?.orderNo;
      if (!orderNo)
        throw new ErrorHandler("No orderNo in response data", false, {
          invalidResponse: responseData,
          method: this.bet.name,
          class: this.constructor.name,
        });

      return {
        status: this.parseApiStatus(status.toLowerCase(), this.id),
        providerOrderId: orderNo.toString(),
        metadata: { balanceBefore, balanceAfter, acknowledgedAt },
      };
    } catch (error) {
      // Some other error; likely after request was made. E.g. validation error
      if (!(error instanceof ErrorHandler))
        logger.error("Something went wrong", { error });
      return { status: ProviderTxStatus.Pending, providerOrderId: "" };
    }
  }

  async checkStatus(
    _appOrderId: string,
    providerOrderId: string
  ): Promise<IProviderRequeryResult> {
    try {
      const { data } = await axios({
        method: "get",
        url: path.join(
          parsedEnv.GIFTBILLS_BASE_URL,
          `/bill/status/${providerOrderId}`
        ),
        headers: {
          Authorization: `Bearer ${parsedEnv.GIFTBILLS_API_KEY}`,
          MerchantId: parsedEnv.GIFTBILLS_MERCHANT_ID,
          "Content-Type": "application/json",
        },
      }).catch((error) => {
        // handle provider errors and return appropriate response
        if (axios.isAxiosError(error))
          return {
            data: { data: { status: this.handleRequeryAxiosError(error) } },
          };

        throw error; // some unknown error
      });

      const responseData = data as TRequeryResponseData;

      // Validate response and see if it match expectation
      const status = responseData?.data?.status;
      if (!status)
        throw new ErrorHandler("No status in response data", false, {
          invalidResponse: responseData,
          method: this.checkStatus.name,
          class: this.constructor.name,
        });

      // TODO: also return possible metadata (e.g. electricity token)
      return { status: this.parseApiStatus(status.toLowerCase(), this.id) };
    } catch (error) {
      // Some other error; likely after request was made. E.g. validation error
      if (!(error instanceof ErrorHandler))
        logger.error("Something went wrong", { error });
      return { status: ProviderTxStatus.Pending };
    }
  }

  async getWalletBalance() {
    try {
      const { data } = await axios({
        method: "post",
        url: path.join(parsedEnv.GIFTBILLS_BASE_URL, `/check-balance`),
        headers: {
          Authorization: `Bearer ${parsedEnv.GIFTBILLS_API_KEY}`,
          MerchantId: parsedEnv.GIFTBILLS_MERCHANT_ID,
          "Content-Type": "application/json",
        },
      }).catch((error) => {
        if (axios.isAxiosError(error) && error.response)
          logger.error(` axios error querying wallet balance for ${this.id}`, {
            error: error.response.data,
          });
        throw error;
      });

      const responseData = data as TBalanceQueryResponseData;

      // Validate response and see if it match expectation
      const balance = responseData?.data?.balance;
      if (!balance)
        throw new ErrorHandler("No balance in response data", false, {
          invalidResponse: responseData,
          method: this.getWalletBalance.name,
          class: this.constructor.name,
        });

      return Number(balance);
    } catch (error) {
      const err =
        error instanceof ErrorHandler
          ? error
          : new ErrorHandler(
              `error getting wallet balance for ${this.id}`,
              false,
              error
            );

      throw err;
    }
  }

  handleRequeryAxiosError(error: AxiosError): ProviderTxStatus {
    logger.error(
      `An axios error occured! code: ${error.code}; message: ${error.message}`,
      { error: { responseData: error.response?.data } }
    );

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 404) return ProviderTxStatus.Failed; // No order found for the provider order ID (which only happened with an empty string; non-empty invalid order ID had status 200)
    }

    return ProviderTxStatus.Pending; // we'll requery to be on the safe side
  }

  /**
   * Compute the HMAC SHA512 of the request body.
   * @param data - the body of the request requiring the HMAC.
   * @returns the HMAC SHA512 digest of the data.
   */
  getHmacOf(data: Record<string, unknown>) {
    // const sortedMap = data;
    const sortedMap = this.sortMapAsc(data);
    const hmac = createHmac("sha512", parsedEnv.GIFTBILLS_ENCRYPTION_KEY);

    return hmac.update(JSON.stringify(sortedMap)).digest("hex");
  }

  /**
   * Sort the properties of a map/object in ascending order.
   * @example { j: 10, a: 1, z: 26, b: 2 } -> { a: 1, b: 2, j: 10, z: 26 }
   * @param map - the object whose properties to re-arrange.
   * @returns a sorted version of the input map.
   */
  sortMapAsc(map: Record<string, unknown>) {
    return Object.entries(map)
      .sort(([k], [k2]) => (k < k2 ? -1 : k > k2 ? 1 : 0))
      .reduce((prev, [k, v]) => {
        prev[k] = v;
        return prev;
      }, {} as Record<string, unknown>);
  }
}

type TPaymentResponseData = {
  // BET
  success: boolean | 0; //
  data: {
    /** providerOrderId */
    orderNo: string; //
    /** appOrderId */
    reference: string; //
    status: string; //
    errorMsg?: string | null;
  };
};

type TRequeryResponseData = {
  success: boolean | 0; //
  data: {
    /** providerOrderId */
    orderNo: string;
    /** appOrderId */
    reference: string | null;
    status: string;
    errorMsg?: string;
    // created_at: "2022-06-13T21:06:57.000000Z";
    // updated_at: "2022-06-13T22:51:49.000000Z";
  };
};

type TBalanceQueryResponseData = {
  success: boolean | 0; //
  message: string;
  data: {
    balance: string;
  };
};

const giftbills = new Giftbills();
Object.freeze(giftbills);
export default giftbills;
