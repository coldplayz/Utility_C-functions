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

import axios, { AxiosError, AxiosResponse } from "axios";
import { DeepRequired, Flatten } from "../../interface/types";
import ErrorHandler from "../../errors/errManager";
import ObjectValidator from "../../helpers/@objectValidator";
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

export class Giftbills extends BaseProvider {
  id = ProviderId.Giftbills;
  apiToProviderStatusMap = {
    delivered: ProviderTxStatus.Successfull,
    successful: ProviderTxStatus.Successfull,
    success: ProviderTxStatus.Successfull,
    fail: ProviderTxStatus.Failed,
    pending: ProviderTxStatus.Pending,
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
      const body = {
        provider: merchantId,
        customerId: accountId,
        amount,
        reference: appOrderId,
      };

      const { data } = await axios<
        unknown,
        AxiosResponse<TPaymentResponseData>
      >({
        method: "post",
        url: path.join(parsedEnv.GIFTBILLS_BASE_URL, "/betting/topup"),
        data: body,
        headers: this.getHeaders(body),
      });

      if (!data.success)
        return {
          status: ProviderTxStatus.Failed,
          providerOrderId: data.data?.orderNo?.toString(),
        };

      // Validate that the data (received over the network) has the correct shape
      this.validatePaymentResponseData(data, []);

      return {
        status: this.parseApiStatus(data.data.status, this.id),
        providerOrderId: data.data.orderNo.toString(),
      };
    } catch (error) {
      if (axios.isAxiosError(error))
        return {
          status: this.handlePaymentAxiosError(error),
          providerOrderId: "",
        };

      // Some other error; likely after request was made. E.g. validation error
      if (!(error instanceof ErrorHandler))
        logger.error("Something went wrong", { error });
      return { status: ProviderTxStatus.Pending, providerOrderId: "" };
    }
  }

  async checkStatus(appOrderId: string): Promise<IProviderRequeryResult> {
    try {
      const { data } = await axios<
        unknown,
        AxiosResponse<TRequeryResponseData>
      >({
        method: "post",
        url: `${parsedEnv.EBILLS_BASE_URL}/api/v2/requery`,
        data: {
          request_id: appOrderId,
        },
        headers: this.getHeaders(),
      });

      // Validate that the data (received over the network) has the correct shape
      this.validateRequeryResponseData(data, []);

      // TODO: also return possible metadata (e.g. electricity token)
      return { status: this.parseApiStatus(data.data.status, this.id) };
    } catch (error) {
      if (axios.isAxiosError(error))
        return { status: this.handleRequeryAxiosError(error) };

      // Some other error; likely after request was made. E.g. validation error
      if (!(error instanceof ErrorHandler))
        logger.error("Something went wrong", { error });
      return { status: ProviderTxStatus.Pending };
    }
  }

  validatePaymentResponseData(
    data: TPaymentResponseData,
    _requireList: (keyof Flatten<DeepRequired<TPaymentResponseData>>)[]
  ) {
    // /** Maps all required fields to the corresponding `required` rule */
    // const require = requireList.reduce((map, requiredFieldPath) => {
    //   map[requiredFieldPath] = "required|";
    //   return map;
    // }, {} as { [K in keyof Flatten<DeepRequired<TPaymentResponseData>>]: `required|` });

    const paymentResponseRule = {
      "data.status": "required|string",
    } satisfies {
      [k in keyof Flatten<DeepRequired<TPaymentResponseData>>]?: string;
    };

    const paymentResponseValidator = new ObjectValidator(paymentResponseRule);

    if (!paymentResponseValidator.validate(data)) {
      throw new ErrorHandler("Error validating payment response data", false, {
        reason: paymentResponseValidator.response,
        invalidData: data,
        method: this.validatePaymentResponseData.name,
        class: this.constructor.name,
      });
    }
  }

  validateRequeryResponseData(
    data: TRequeryResponseData,
    _requireList: (keyof Flatten<DeepRequired<TRequeryResponseData>>)[]
  ) {
    const requeryResponseRule = {
      "data.status": "required|string",
      // "data.token": `${require["data.token"] || ""}string`,
    } satisfies {
      [k in keyof Flatten<DeepRequired<TRequeryResponseData>>]?: string;
    };

    const requeryResponseValidator = new ObjectValidator(requeryResponseRule);

    if (!requeryResponseValidator.validate(data)) {
      throw new ErrorHandler("Error validating requery response data", false, {
        reason: requeryResponseValidator.response,
        invalidData: data,
        method: this.validatePaymentResponseData.name,
        class: this.constructor.name,
      });
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
      if (error.response.status === 404)
        return ProviderTxStatus.Failed; // order_not_found – No order found for the request ID.
      else return ProviderTxStatus.Pending; // requery and/or investigate error
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      return ProviderTxStatus.Pending; // we'll requery to be on the safe side
    } else {
      // Something happened in setting up the request that triggered an Error
      // TODO: look into returning different statuses for different error codes
      return ProviderTxStatus.Pending; // requery and/or investigate error
    }
  }

  getHmacOf(data: Record<string, unknown>) {
    const sortedMap = this.sortMapAsc(data);
    const hmac = createHmac("sha512", parsedEnv.GIFTBILLS_ENCRYPTION_KEY);

    return hmac.update(JSON.stringify(sortedMap)).digest("hex");
  }

  sortMapAsc(map: Record<string, unknown>) {
    return Object.entries(map)
      .sort(([k], [k2]) => (k < k2 ? -1 : k > k2 ? 1 : 0))
      .reduce((prev, [k, v]) => {
        prev[k] = v;
        return prev;
      }, {} as Record<string, unknown>);
  }

  getHeaders(requestBody?: Record<string, unknown>) {
    return {
      Authorization: `Bearer ${parsedEnv.GIFTBILLS_API_KEY}`,
      MerchantId: parsedEnv.GIFTBILLS_MERCHANT_ID,
      "Content-Type": "application/json",
      ...(requestBody && { Encryption: this.getHmacOf(requestBody) }),
    };
  }
}

type TPaymentResponseData = {
  // BET
  success: boolean | 0; //
  code?: string;
  message?: string;
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
  code?: string;
  message?: string;
  data: {
    trx?: string;
    /** providerOrderId */
    orderNo: string;
    /** appOrderId */
    reference: string | null;
    status: string;
    errorMsg?: string;
    service_type?: unknown;
    channel?: unknown;
    // bill: {
    //   provider: "MTN";
    //   recipient: "07025150008";
    //   amount: "500.00";
    //   discount: "10";
    //   fee: "0";
    //   voucher: "0";
    //   paid: "490";
    //   init_bal: "95758.28";
    //   new_bal: "95268.28";
    //   cg: "2";
    //   init_cg: "0";
    //   new_cg: "0";
    //   debit: "balance";
    //   purchased_code: null;
    //   units: null;
    //   refunded: false;
    // };
    // created_at: "2022-06-13T21:06:57.000000Z";
    // updated_at: "2022-06-13T22:51:49.000000Z";
  };
};

const giftbills = new Giftbills();
Object.freeze(giftbills);
export default giftbills;
