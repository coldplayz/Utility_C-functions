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
import { unix } from "../../helpers/@time";
import selectRandom from "../../helpers/@selectRandom";
import { generateRandomIntRange } from "../../helpers/@generateRandom";

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
    [ProviderTxStatus.Successfull]: ProviderTxStatus.Successfull,
  };

  async airtime(
    phoneNumber: string,
    amount: number,
    merchantId: string,
    appOrderId: string
  ): Promise<IProviderPaymentResult> {
    if (/^dev/.test(process.env.NODE_ENV || "")) {
      return getDummyPaymentResult(this.airtime.name);
    } else {
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

        const { data } = await axios({
          method: "post",
          url: new URL(`/wp-json/api/v2/airtime`, parsedEnv.EBILLS_BASE_URL)
            .href,
          data: {
            request_id: appOrderId,
            phone: phoneNumber,
            service_id: merchantId,
            amount: amount,
          },
          headers: {
            Authorization: `Bearer ${parsedEnv.EBILLS_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
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

        // Validate response and see if it match expectation
        const status = responseData?.data?.status;
        if (!status)
          throw new ErrorHandler("No status in response data", false, {
            invalidResponse: responseData,
            method: this.airtime.name,
            class: this.constructor.name,
          });

        // return needed data
        return {
          status: this.parseApiStatus(status.toLowerCase(), this.id),
          providerOrderId: responseData?.data?.order_id.toString() || "",
          metadata: { balanceBefore, balanceAfter, acknowledgedAt },
        };
      } catch (error) {
        // use the usual error handler
        if (!(error instanceof ErrorHandler))
          logger.error("Something went wrong", { error });
        return { status: ProviderTxStatus.Pending, providerOrderId: "" };
      }
    }
  }

  async internet(
    phoneNumber: string,
    merchantId: string,
    planCode: string,
    appOrderId: string
  ): Promise<IProviderPaymentResult> {
    if (/^dev/.test(process.env.NODE_ENV || "")) {
      return getDummyPaymentResult(this.internet.name);
    } else {
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

        const { data } = await axios({
          method: "post",
          url: new URL(`/wp-json/api/v2/data`, parsedEnv.EBILLS_BASE_URL).href,
          data: {
            request_id: appOrderId,
            phone: phoneNumber,
            service_id: merchantId,
            variation_id: planCode,
          },
          headers: {
            Authorization: `Bearer ${parsedEnv.EBILLS_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
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

        // Validate response and see if it match expectation
        const status = responseData?.data?.status;
        if (!status)
          throw new ErrorHandler("No status in response data", false, {
            invalidResponse: responseData,
            method: this.airtime.name,
            class: this.constructor.name,
          });

        // return needed data
        return {
          status: this.parseApiStatus(status.toLowerCase(), this.id),
          providerOrderId: responseData?.data?.order_id.toString() || "",
          metadata: { balanceBefore, balanceAfter, acknowledgedAt },
        };
      } catch (error) {
        // use the usual error handler
        if (!(error instanceof ErrorHandler))
          logger.error("Something went wrong", { error });
        return { status: ProviderTxStatus.Pending, providerOrderId: "" };
      }
    }
  }

  async cableTv(
    smartCardNumber: string,
    merchantId: string,
    planCode: string,
    appOrderId: string
  ): Promise<IProviderPaymentResult> {
    if (/^dev/.test(process.env.NODE_ENV || "")) {
      return getDummyPaymentResult(this.cableTv.name);
    } else {
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

        const { data } = await axios({
          method: "post",
          url: new URL(`/wp-json/api/v2/tv`, parsedEnv.EBILLS_BASE_URL).href,
          data: {
            request_id: appOrderId,
            customer_id: smartCardNumber,
            service_id: merchantId,
            variation_id: planCode,
          },
          headers: {
            Authorization: `Bearer ${parsedEnv.EBILLS_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
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

        // Validate response and see if it match expectation
        const status = responseData?.data?.status;
        if (!status)
          throw new ErrorHandler("No status in response data", false, {
            invalidResponse: responseData,
            method: this.airtime.name,
            class: this.constructor.name,
          });

        // return needed data
        return {
          status: this.parseApiStatus(status.toLowerCase(), this.id),
          providerOrderId: responseData?.data?.order_id.toString() || "",
          metadata: { balanceBefore, balanceAfter, acknowledgedAt },
        };
      } catch (error) {
        // use the usual error handler
        if (!(error instanceof ErrorHandler))
          logger.error("Something went wrong", { error });
        return { status: ProviderTxStatus.Pending, providerOrderId: "" };
      }
    }
  }

  async electricity(
    meterNumber: string,
    amount: number,
    merchantId: string,
    appOrderId: string,
    productType: string
  ): Promise<IProviderPaymentResult> {
    if (/^dev/.test(process.env.NODE_ENV || "")) {
      return getDummyPaymentResult(this.electricity.name);
    } else {
      try {
        let balanceBefore: number;

        console.log("about to get balance..."); // TODO: remove
        try {
          balanceBefore = await this.getWalletBalance();
        } catch (err) {
          return {
            status: ProviderTxStatus.Failed,
            providerOrderId: "",
          };
        }

        const { data } = await axios({
          method: "post",
          url: new URL(`/wp-json/api/v2/electricity`, parsedEnv.EBILLS_BASE_URL)
            .href,
          data: {
            request_id: appOrderId,
            customer_id: meterNumber,
            service_id: merchantId,
            variation_id: productType,
            amount,
          },
          headers: {
            Authorization: `Bearer ${parsedEnv.EBILLS_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
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

        // Validate response and see if it match expectation
        const status = responseData?.data?.status;
        if (!status)
          throw new ErrorHandler("No status in response data", false, {
            invalidResponse: responseData,
            method: this.airtime.name,
            class: this.constructor.name,
          });

        // return needed data
        return {
          status: this.parseApiStatus(status.toLowerCase(), this.id),
          providerOrderId: responseData?.data?.order_id.toString() || "",
          metadata: {
            balanceBefore,
            balanceAfter,
            acknowledgedAt,
            token: responseData?.data?.token,
          },
        };
      } catch (error) {
        // use the usual error handler
        if (!(error instanceof ErrorHandler))
          logger.error("Something went wrong", { error });
        return { status: ProviderTxStatus.Pending, providerOrderId: "" };
      }
    }
  }

  async bet(
    accountId: string,
    amount: number,
    merchantId: string,
    appOrderId: string
  ): Promise<IProviderPaymentResult> {
    if (/^dev/.test(process.env.NODE_ENV || "")) {
      return getDummyPaymentResult(this.bet.name);
    } else {
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

        const { data } = await axios({
          method: "post",
          url: new URL(`/wp-json/api/v2/betting`, parsedEnv.EBILLS_BASE_URL)
            .href,
          data: {
            request_id: appOrderId,
            customer_id: accountId,
            service_id: merchantId,
            amount,
          },
          headers: {
            Authorization: `Bearer ${parsedEnv.EBILLS_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
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

        // Validate response and see if it match expectation
        const status = responseData?.data?.status;
        if (!status)
          throw new ErrorHandler("No status in response data", false, {
            invalidResponse: responseData,
            method: this.airtime.name,
            class: this.constructor.name,
          });

        // return needed data
        return {
          status: this.parseApiStatus(status.toLowerCase(), this.id),
          providerOrderId: responseData?.data?.order_id.toString() || "",
          metadata: { balanceBefore, balanceAfter, acknowledgedAt },
        };
      } catch (error) {
        // use the usual error handler
        if (!(error instanceof ErrorHandler))
          logger.error("Something went wrong", { error });
        return { status: ProviderTxStatus.Pending, providerOrderId: "" };
      }
    }
  }

  async checkStatus(appOrderId: string): Promise<IProviderRequeryResult> {
    try {
      const { data } = await axios({
        method: "post",
        url: new URL(`/wp-json/api/v2/requery`, parsedEnv.EBILLS_BASE_URL).href,
        data: {
          request_id: appOrderId,
        },
        headers: {
          Authorization: `Bearer ${parsedEnv.EBILLS_ACCESS_TOKEN}`,
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
      return {
        status: this.parseApiStatus(status.toLowerCase(), this.id),
      };
    } catch (error) {
      // use the usual error handler
      if (!(error instanceof ErrorHandler))
        logger.error("Something went wrong", { error });
      return { status: ProviderTxStatus.Pending };
    }
  }

  async getWalletBalance() {
    try {
      const { data } = await axios({
        method: "get",
        url: new URL(`/wp-json/api/v2/balance`, parsedEnv.EBILLS_BASE_URL).href,
        headers: {
          Authorization: `Bearer ${parsedEnv.EBILLS_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }).catch((error) => {
        if (axios.isAxiosError(error) && error.response)
          logger.error(` axios error querying wallet balance for ${this.id}`, {
            error: error.response.data,
          }); // ebills sends descriptive data back on error
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
}

// TODO: test/dev only
function getDummyPaymentResult(productId: string): IProviderPaymentResult {
  const status = selectRandom(Object.values(ProviderTxStatus));
  const acknowledgedAt = unix();
  const providerOrderId = "";
  let balanceBefore!: number;
  let balanceAfter!: number;
  const token =
    productId === "electricity" && !(status === ProviderTxStatus.Failed)
      ? "dummyToken"
      : undefined;

  if (
    status === ProviderTxStatus.Successfull ||
    status === ProviderTxStatus.Pending
  ) {
    balanceBefore = generateRandomIntRange(1000, 100_000);
    balanceAfter = balanceBefore - Math.floor(balanceBefore / 2);
  }

  return {
    status,
    providerOrderId,
    metadata: { balanceAfter, balanceBefore, acknowledgedAt, token },
  };
}

type TPaymentResponseData = {
  code: string;
  message: string;
  data: {
    order_id: number; // -- providerOrderId
    status: string;
    request_id: string; // -- appOrderId
    token?: string;
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

type TBalanceQueryResponseData = {
  // code: "success";
  // message: "Wallet balance retrieved successfully!";
  data: { balance: number };
};

const ebills = new Ebills();
Object.freeze(ebills);
export default ebills;
