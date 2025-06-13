import axios, { AxiosResponse } from "axios";
import { DeepRequired, Flatten } from "../../interface/types";
import BaseProvider from "./providerBaseApi";
import ErrorHandler from "../../errors/errManager";
import ObjectValidator from "../../helpers/@objectValidator";
import parsedEnv from "../../helpers/@loadConfig";
import { logger } from "../../helpers/@logger";
import { ProviderId, ProviderTxStatus } from "../../interface/enums";
import { IProviderPaymentResult } from "../../interface/interfaces";

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

      return { initialStatus: this.parseApiStatus(data.data.status, this.id) };
    } catch (error) {
      if (axios.isAxiosError(error))
        return { initialStatus: this.handleAxiosError(error) };

      // Some other error; likely after request was made. E.g. validation error
      if (!(error instanceof ErrorHandler))
        logger.error("Something went wrong", { error });
      return { initialStatus: ProviderTxStatus.Pending };
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

      return { initialStatus: this.parseApiStatus(data.data.status, this.id) };
    } catch (error) {
      if (axios.isAxiosError(error))
        return { initialStatus: this.handleAxiosError(error) };

      // Some other error; likely after request was made. E.g. validation error
      if (!(error instanceof ErrorHandler))
        logger.error("Something went wrong", { error });
      return { initialStatus: ProviderTxStatus.Pending };
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

      return { initialStatus: this.parseApiStatus(data.data.status, this.id) };
    } catch (error) {
      if (axios.isAxiosError(error))
        return { initialStatus: this.handleAxiosError(error) };

      // Some other error; likely after request was made. E.g. validation error
      if (!(error instanceof ErrorHandler))
        logger.error("Something went wrong", { error });
      return { initialStatus: ProviderTxStatus.Pending };
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
        initialStatus: this.parseApiStatus(data.data.status, this.id),
        metadata: { token: data.data.token },
      };
    } catch (error) {
      if (axios.isAxiosError(error))
        return { initialStatus: this.handleAxiosError(error) };

      // Some other error; likely after request was made. E.g. validation error
      if (!(error instanceof ErrorHandler))
        logger.error("Something went wrong", { error });
      return { initialStatus: ProviderTxStatus.Pending };
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
        initialStatus: this.parseApiStatus(data.data.status, this.id),
        metadata: { token: data.data.token },
      };
    } catch (error) {
      if (axios.isAxiosError(error))
        return { initialStatus: this.handleAxiosError(error) };

      // Some other error; likely after request was made. E.g. validation error
      if (!(error instanceof ErrorHandler))
        logger.error("Something went wrong", { error });
      return { initialStatus: ProviderTxStatus.Pending };
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

      return { initialStatus: this.parseApiStatus(data.data.status, this.id) };
    } catch (error) {
      if (axios.isAxiosError(error))
        return { initialStatus: this.handleAxiosError(error) };

      // Some other error; likely after request was made. E.g. validation error
      if (!(error instanceof ErrorHandler))
        logger.error("Something went wrong", { error });
      return { initialStatus: ProviderTxStatus.Pending };
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
    }, {} as { [K in keyof Flatten<DeepRequired<TPaymentResponseData>>]: string });

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

const ebills = new Ebills();
Object.freeze(ebills);
export default ebills;
