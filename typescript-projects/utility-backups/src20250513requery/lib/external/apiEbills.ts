import axios, { AxiosError, AxiosResponse } from "axios";
import { DeepRequired, Flatten } from "../../interface/types";
import BaseProvider from "./providerBaseApi";
import ErrorHandler from "../../errors/errManager";
import ObjectValidator from "../../helpers/@objectValidator";
import parsedEnv from "../../helpers/@loadConfig";
import { logger } from "../../helpers/@logger";
import { ProviderId, ProviderTxStatus } from "../../interface/enums";
import {
  IProviderPaymentResult,
  IProviderRequeryResult,
} from "../../interface/interfaces";

export class Ebills extends BaseProvider {
  id = ProviderId.Ebills;
  apiToProviderStatusMap = {
    "completed-api": ProviderTxStatus.Successfull,
    "processing-api": ProviderTxStatus.Pending,
    "queued-api": ProviderTxStatus.Pending,
    "initiated-api": ProviderTxStatus.Pending,
    cancelled: ProviderTxStatus.Failed,
    pending: ProviderTxStatus.Pending,
    failed: ProviderTxStatus.Failed,
    refunded: ProviderTxStatus.Failed,
    "on-hold": ProviderTxStatus.Pending,
  };
  accessToken: string | null = null;

  async airtime(
    phoneNumber: string,
    amount: number,
    merchantId: string,
    txHash: string
  ): Promise<IProviderPaymentResult> {
    try {
      const { data } = await axios<
        unknown,
        AxiosResponse<TPaymentResponseData>
      >({
        method: "post",
        url: `${parsedEnv.EBILLS_BASE_URL}/api/v2/airtime`,
        data: {
          request_id: txHash,
          phone: phoneNumber,
          service_id: merchantId,
          amount: amount,
        },
        headers: await this.getHeaders(),
      });

      // Validate that the data (received over the network) has the correct shape
      this.validatePaymentResponseData(data, []);

      return { status: this.parseApiStatus(data.data.status, this.id) };
    } catch (error) {
      if (axios.isAxiosError(error))
        return { status: this.handlePaymentAxiosError(error) };

      // Some other error; likely after request was made. E.g. validation error
      if (!(error instanceof ErrorHandler))
        logger.error("Something went wrong", { error });
      return { status: ProviderTxStatus.Pending };
    }
  }

  async internet(
    phoneNumber: string,
    merchantId: string,
    planCode: string,
    txHash: string
  ): Promise<IProviderPaymentResult> {
    try {
      const { data } = await axios<
        unknown,
        AxiosResponse<TPaymentResponseData>
      >({
        method: "post",
        url: `${parsedEnv.EBILLS_BASE_URL}/api/v2/data`,
        data: {
          request_id: txHash,
          phone: phoneNumber,
          service_id: merchantId,
          variation_id: planCode,
        },
        headers: await this.getHeaders(),
      });

      // Validate that the data (received over the network) has the correct shape
      this.validatePaymentResponseData(data, []);

      return { status: this.parseApiStatus(data.data.status, this.id) };
    } catch (error) {
      if (axios.isAxiosError(error))
        return { status: this.handlePaymentAxiosError(error) };

      // Some other error; likely after request was made. E.g. validation error
      if (!(error instanceof ErrorHandler))
        logger.error("Something went wrong", { error });
      return { status: ProviderTxStatus.Pending };
    }
  }

  async cableTv(
    smartCardNumber: string,
    merchantId: string,
    planCode: string,
    txHash: string
  ): Promise<IProviderPaymentResult> {
    try {
      const { data } = await axios<
        unknown,
        AxiosResponse<TPaymentResponseData>
      >({
        method: "post",
        url: `${parsedEnv.EBILLS_BASE_URL}/api/v2/tv`,
        data: {
          request_id: txHash,
          customer_id: smartCardNumber,
          service_id: merchantId,
          variation_id: planCode,
        },
        headers: await this.getHeaders(),
      });

      // Validate that the data (received over the network) has the correct shape
      this.validatePaymentResponseData(data, []);

      return { status: this.parseApiStatus(data.data.status, this.id) };
    } catch (error) {
      if (axios.isAxiosError(error))
        return { status: this.handlePaymentAxiosError(error) };

      // Some other error; likely after request was made. E.g. validation error
      if (!(error instanceof ErrorHandler))
        logger.error("Something went wrong", { error });
      return { status: ProviderTxStatus.Pending };
    }
  }

  async postpaid(
    meterNumber: string,
    amount: number,
    merchantId: string,
    txHash: string
  ): Promise<IProviderPaymentResult> {
    try {
      const { data } = await axios<
        unknown,
        AxiosResponse<TPaymentResponseData>
      >({
        method: "post",
        url: `${parsedEnv.EBILLS_BASE_URL}/api/v2/electricity`,
        data: {
          request_id: txHash,
          customer_id: meterNumber,
          service_id: merchantId,
          variation_id: "postpaid",
          amount,
        },
        headers: await this.getHeaders(),
      });

      // Validate that the data (received over the network) has the correct shape
      this.validatePaymentResponseData(data, []);

      return {
        status: this.parseApiStatus(data.data.status, this.id),
        metadata: { token: data.data.token },
      };
    } catch (error) {
      if (axios.isAxiosError(error))
        return { status: this.handlePaymentAxiosError(error) };

      // Some other error; likely after request was made. E.g. validation error
      if (!(error instanceof ErrorHandler))
        logger.error("Something went wrong", { error });
      return { status: ProviderTxStatus.Pending };
    }
  }

  async prepaid(
    meterNumber: string,
    amount: number,
    merchantId: string,
    txHash: string
  ): Promise<IProviderPaymentResult> {
    try {
      const { data } = await axios<
        unknown,
        AxiosResponse<TPaymentResponseData>
      >({
        method: "post",
        url: `${parsedEnv.EBILLS_BASE_URL}/api/v2/electricity`,
        data: {
          request_id: txHash,
          customer_id: meterNumber,
          service_id: merchantId,
          variation_id: "prepaid",
          amount,
        },
        headers: await this.getHeaders(),
      });

      // Validate that the data (received over the network) has the correct shape
      this.validatePaymentResponseData(data, []);

      return {
        status: this.parseApiStatus(data.data.status, this.id),
        metadata: { token: data.data.token },
      };
    } catch (error) {
      if (axios.isAxiosError(error))
        return { status: this.handlePaymentAxiosError(error) };

      // Some other error; likely after request was made. E.g. validation error
      if (!(error instanceof ErrorHandler))
        logger.error("Something went wrong", { error });
      return { status: ProviderTxStatus.Pending };
    }
  }

  async bet(
    accountId: string,
    amount: number,
    merchantId: string,
    txHash: string
  ): Promise<IProviderPaymentResult> {
    try {
      const { data } = await axios<
        unknown,
        AxiosResponse<TPaymentResponseData>
      >({
        method: "post",
        url: `${parsedEnv.EBILLS_BASE_URL}/api/v2/betting`,
        data: {
          request_id: txHash,
          customer_id: accountId,
          service_id: merchantId,
          amount,
        },
        headers: await this.getHeaders(),
      });

      // Validate that the data (received over the network) has the correct shape
      this.validatePaymentResponseData(data, []);

      return { status: this.parseApiStatus(data.data.status, this.id) };
    } catch (error) {
      if (axios.isAxiosError(error))
        return { status: this.handlePaymentAxiosError(error) };

      // Some other error; likely after request was made. E.g. validation error
      if (!(error instanceof ErrorHandler))
        logger.error("Something went wrong", { error });
      return { status: ProviderTxStatus.Pending };
    }
  }

  async checkStatus(reference: string): Promise<IProviderRequeryResult> {
    try {
      const { data } = await axios<
        unknown,
        AxiosResponse<TRequeryResponseData>
      >({
        method: "post",
        url: `${parsedEnv.EBILLS_BASE_URL}/api/v2/requery`,
        data: {
          request_id: reference,
        },
        headers: await this.getHeaders(),
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
    requireList: (keyof Flatten<DeepRequired<TPaymentResponseData>>)[]
  ) {
    /** Maps all required fields to the corresponding `required` rule */
    const require = requireList.reduce((map, requiredFieldPath) => {
      map[requiredFieldPath] = "required|";
      return map;
    }, {} as { [K in keyof Flatten<DeepRequired<TPaymentResponseData>>]: `required|` });

    const paymentResponseRule = {
      "data.status": "required|string",
      "data.token": `${require["data.token"] || ""}string`, // electricity
    } satisfies {
      [k in keyof Flatten<DeepRequired<TPaymentResponseData>>]?: string;
    };

    const paymentResponseValidator = new ObjectValidator(paymentResponseRule);

    if (!paymentResponseValidator.validate(data)) {
      throw new ErrorHandler("Error validating payment response data", false, {
        reason: paymentResponseValidator.response,
        invalidData: data,
        source: this.validatePaymentResponseData.name,
      });
    }
  }

  validateRequeryResponseData(
    data: TRequeryResponseData,
    _requireList: (keyof Flatten<DeepRequired<TRequeryResponseData>>)[]
  ) {
    const requeryResponseRule = {
      "data.status": "required|string",
      // "data.token": `${require["data.token"] || ""}string`, // TODO: electricity
    } satisfies {
      [k in keyof Flatten<DeepRequired<TRequeryResponseData>>]?: string;
    };

    const requeryResponseValidator = new ObjectValidator(requeryResponseRule);

    if (!requeryResponseValidator.validate(data)) {
      throw new ErrorHandler("Error validating requery response data", false, {
        reason: requeryResponseValidator.response,
        invalidData: data,
        source: this.validateRequeryResponseData.name,
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

  async getAccessToken() {
    try {
      if (!this.accessToken) {
        const response = await axios(parsedEnv.EBILLS_AUTH_URL, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          data: {
            username: parsedEnv.EBILLS_USERNAME,
            password: parsedEnv.EBILLS_PASSWORD,
          },
        });

        const token = response.data.token as string;
        if (!token)
          throw new ErrorHandler(
            "undefined 'token' field in auth response",
            false,
            {
              source: this.getAccessToken.name,
              provider: this.id,
              invalidData: response.data,
            }
          );

        // TODO: logic to refresh access token?? E.g. setInterval every six days
        this.accessToken = token; // expires in seven days
      }

      return this.accessToken;
    } catch (error) {
      if (error instanceof ErrorHandler || axios.isAxiosError(error))
        throw error;
      throw new ErrorHandler(
        `error getting access token for ${this.id}`,
        false,
        error
      );
    }
  }

  async getHeaders() {
    const token = await this.getAccessToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
}

type TPaymentResponseData = {
  code: string; //
  message: string; //
  data: {
    // all
    order_id: number; //
    status: string; //
    request_id: string; // -- reference
    product_name: string; //
    service_name: string; //
    discount: string; //
    amount_charged: string; //
    initial_balance: string; //
    final_balance: string; //

    // airtime
    phone?: string;
    amount?: number;

    // data
    variation_id?: string;
    data_plan?: string;

    // electricity
    customer_id?: string;
    customer_name?: string;
    customer_address?: string;
    token?: string;
    units?: string;
    band?: string;
    // amount?: 10000;

    // bet
    // customer_id?: "12345";
    // customer_name?: "John Smith";
    customer_username?: string;
    customer_email_address?: string;
    customer_phone_number?: string;
    // amount?: 500;

    // cable tv
    // customer_id?: "1234567890";
    // customer_name?: "Aisha Chioma Oreoluwa";
    // amount?: 10500;
  };
};

type TRequeryResponseData = {
  code: string;
  message: string;
  data: {
    status: string;
    order_id: number;
    // request_id: string;
    // date_created: "2025-04-08 19:54:20";
    // date_updated: "2025-04-08 19:54:25";
  };
};

const ebills = new Ebills();
Object.freeze(ebills);
export default ebills;
