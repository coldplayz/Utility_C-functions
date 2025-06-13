import BaseProvider from "../lib/external/providerBaseApi";
import { AppTxStatus, ProviderId, Utility } from "./enums";

export type AppName = "gojigi" | "atechpadi";

export type RawEnv = {
  // CORS_URL: string;
  // JWT_SECRET: string;
  // USERS_PROJECT_SA: string;
  // GIFTCARD_PROJECT_SA: string;
  // BITCOIN_PROJECT_SA: string;
  // CORE_PROJECT_PUB_SA: string;
  // CORE_PROJECT_ID: string;
  // APP_NAME: AppName;
  // SERVICE_ID: string;
  NAIRA_PROJECT_SA: string;
  EBILLS_ACCESS_TOKEN: string;
  EBILLS_BASE_URL: string;
  EBILLS_AUTH_URL: string;
  AUTHORIZED_SERVICES_ID: string;
  PUBSUB_JWT_SECRET: string;
  GIFTBILLS_API_KEY: string;
  GIFTBILLS_ENCRYPTION_KEY: string;
  /** Giftbills account username */
  GIFTBILLS_MERCHANT_ID: string;
  GIFTBILLS_BASE_URL: string;
  // PUSH_NOTIFICATION_ENDPOINT: string;
};
export type ParsedEnv = {
  // CORS_URL: string;
  // JWT_SECRET: string;
  // USERS_PROJECT_SA: string;
  // GIFTCARD_PROJECT_SA: string;
  // BITCOIN_PROJECT_SA: string;
  // CORE_PROJECT_PUB_SA: Record<string, unknown>;
  // CORE_PROJECT_ID: string;
  // APP_NAME: AppName;
  // SERVICE_ID: string;
  NAIRA_PROJECT_SA: string;
  EBILLS_ACCESS_TOKEN: string;
  EBILLS_BASE_URL: string;
  EBILLS_AUTH_URL: string;
  AUTHORIZED_SERVICES_ID: string[];
  PUBSUB_JWT_SECRET: string;
  GIFTBILLS_API_KEY: string;
  GIFTBILLS_ENCRYPTION_KEY: string;
  /** Giftbills account username */
  GIFTBILLS_MERCHANT_ID: string;
  GIFTBILLS_BASE_URL: string;
  // PUSH_NOTIFICATION_ENDPOINT: string;
};

/** Flattens a map. E.g { a: { a1: any, a2: any } } -> { a: {...}, "a.a1": any, "a.a2": any } */
export type Flatten<T> = T extends Record<string, unknown>
  ? UnionToIntersection<
      {
        [K in keyof DeepRequired<T>]: K extends string
          ? T[K] extends Record<string, unknown>
            ? {
                [P in `${K}.${keyof Flatten<T[K]> & string}`]: Flatten<
                  T[K]
                >[P extends `${K}.${infer R}` ? R : never];
              } & { [P in K]: T[K] }
            : { [P in K]: T[K] }
          : never;
      }[keyof T]
    >
  : never;

export type UnionToIntersection<T> = (
  T extends unknown ? (x: T) => void : never
) extends (x: infer R) => void
  ? R
  : never;

/** Recursively make all properties of a map/object required */
export type DeepRequired<T> = {
  [K in keyof T]-?: Exclude<T[K], undefined> extends Record<string, unknown>
    ? DeepRequired<T[K]>
    : T[K];
};

export type TArrayItem<ArrayType> = ArrayType extends (infer ItemType)[]
  ? ItemType
  : never;

export type MicroServiceRoutePath = {
  serviceStatus: "/status";
  processAirtime: "/bills/mobile/processAirtime";
  processInternet: "/bills/mobile/processInternet";
  processElectricity: "/bills/electricity/process";
  processCableTv: "/bills/cableTv/process";
  processBet: "/bills/bet/process";
  processStatus: "/bills/status/process";
};
export type MicroServiceRoutePathVal =
  MicroServiceRoutePath[keyof MicroServiceRoutePath];

/** Data passed in query when making a request to the status-processing endpoint */
export type TStatusQuery = {
  status: AppTxStatus;
  providerId?: ProviderId;
  /** Path (in naira_metadata collection) to doc containing data related to the utility payment request */
  metaPath?: string;
} & (
  | { status: AppTxStatus.Mempool; metaPath: string; providerId?: undefined }
  | {
      status: Exclude<AppTxStatus, AppTxStatus.Mempool>;
      metaPath?: undefined;
      providerId: ProviderId;
    }
);

// export type TPaymentData = TReasonMeta & TPlanData;
export type TPaymentData =
  | TEbillsAirtimePaymentData
  | TEbillsInternetPaymentData
  | TEbillsBetPaymentData
  | TEbillsCableTvPaymentData
  | TEbillsElectricityPaymentData;

// ################## EBILLS PROVIDER START ##################
export type TEbillsAirtimePaymentData = {
  provider: ProviderId;
  phoneNumber: string;
  merchant: string;
  amount: number; // `amount` in tx doc root
};

export type TEbillsInternetPaymentData = {
  provider: ProviderId;
  phoneNumber: string;
  merchant: string;
  variationId: string;
};

export type TEbillsBetPaymentData = {
  provider: ProviderId;
  customerId: string;
  merchant: string;
  amount: number; // `amount` in tx doc root
};

export type TEbillsCableTvPaymentData = {
  provider: ProviderId;
  cardNumber: string;
  merchant: string;
  variationId: string;
};

export type TEbillsElectricityPaymentData = {
  provider: ProviderId;
  merchant: string;
  customerId: string;
  amount: number; // `amount` in tx doc root
  productType: string; // e.g. prepaid
};
// ################## EBILLS PROVIDER END ##################

/** Uniform interface for abstracting utility payment info from all providers */
export type TAppPaymentData = {
  /** Unique identifier for the customer, at the merchant */
  customerId: string;
  /** Producer of value. E.g. mtn, dstv, betking, ikeja-electric */
  merchantId: string;
  /** The unique identifier we generate and send to provider...per transaction */
  appOrderId: string;
  /** ID for a bundled, fixed-price products. E.g. ID for internet and cable tv product bundles/plans/bouquet */
  productId?: string;
  /** Amount for a variable-price product like airtime */
  amount?: number;
};

/** Data expected to come into the payment-processing endpoint service class */
export type TProcessData = {
  paymentData: TAppPaymentData;
  uid: string;
  appTxHash: string;
  nairaAdminDocPath: string;
  txPath: string;
  provider: BaseProvider;
  providerId: ProviderId;
};

// /** Data expected to come into the status-processing endpoint service class */
// export type TStatusData = {
//   provider: BaseProvider;
//   /** ID of the utility payment tx we generate and supply to the provider */
//   appOrderId?: string;
//   /** ID of the utility payment tx the provider generates and sends back to us */
//   providerOrderId?: string;
//   txPath?: string;
// };

/** Data for getting document refs of docs to be written/updated during utility processing. */
export type TStatusDocsAccessData = {
  uid: string;
  /** hash of naira withdrawal tx, which also serves as tx doc ID */
  appTxHash: string;
  /** full path to the related naira_admin doc */
  nairaAdminDocPath: string;
};

/** Result of a provider transaction status check and/or parsing */
export type TCheckStatusResult = { status: AppTxStatus; txPath: string };

// export type TEbillsAirtimePaymentData = {
//   request_id: string;
//   phone: string;
//   service_id: string;
//   amount: number;
// };

// ------------------- MODEL -------------------

/** Contains data about the utility payment request */
export type TReasonMeta = TEbillsReasonMeta;
export type TEbillsReasonMeta = {
  // /** Unique identifier for the customer, at the merchant */
  // customerId: string;
  // merchantId: UtilityMerchant;
  // productId: UtilityProduct;
  // planId: string;
  // amount: number;
  /** Provider Identifier. E.g. ebills */
  provider: ProviderId;
  /** E.g. mtn, mtn-n. Provider-specific */
  merchant: string;
  /** Product ID at provider */
  variationId?: string;
  /** Customer ID at merchant for airtime and internet products */
  phoneNumber?: string;
  /** Customer ID at merchant for bet, prepaid, and postpaid products */
  customerId?: string;
  /** Customer ID at merchant for cableTV product */
  cardNumber?: string;
  /** Electricity product ID. E.g. prepaid or postpaid */
  productType?: string;
};

export type TUtilityWithdrawalReadData = {
  adminInfo: {
    /** Path to the related naira_admins doc */
    naira_path: string;
  };
  amount?: number;
  /** doc ID for this, and the related naira_admins and naira_metadata update docs */
  hash: string;
  userId: string;
  // reason: Utility;
  reasonMeta: TReasonMeta;
  utility?: TUtilityMeta;
};
export type TUtilityMeta = TUtilityWithdrawalWriteData["utility"];

export type TUtilityWithdrawalWriteData = {
  utility: {
    /** Wallet balance (at specific provider) before payment request is made */
    balanceBefore?: number;
    /** Wallet balance (at specific provider) after payment request is made */
    balanceAfter?: number;
    status?: AppTxStatus;
    /** ID of the utility payment tx we generate and supply to the provider */
    appOrderId?: string;
    /** ID of the utility payment tx the provider generates and sends back to us */
    providerOrderId?: string;
    /** The time at which the request was received and initiated by our app */
    initiatedAt?: number;
    /** The time at which a response is recieved from the provider */
    acknowledgedAt?: number;
    /** The time at which the utility tx gets a settled status like `approved` and `rejected` */
    settledAt?: number;
    providerId?: ProviderId;
    /** Electricity token */
    token?: string;
  };
};

export type TNairaAdminTxWriteData = {
  utilityStatus?: AppTxStatus;
};

export type TNairaMetadataUtilityWriteData = {
  utilityStatus?: AppTxStatus;
  /** ID of the utility payment tx we generate and supply to the provider */
  appOrderId?: string;
  /** ID of the utility payment tx the provider generates and sends back to us */
  providerOrderId?: string;
  txTimestamp?: number;
  providerId?: ProviderId;
  txPath?: string;
};

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    // Improve type-safety for the otherwise permissive `locals` object
    interface Locals {
      utility?: Utility;
      providerId?: ProviderId;
      /** Contains initial data about the utility payment request */
      reasonMeta?: TReasonMeta;
      /** Contains metadata about the utility payment request */
      utilityMeta?: TUtilityMeta;
      /** uid of user whose utility request is being handled */
      uid?: string;
      /** hash of naira withdrawal tx, which also serves as tx doc ID */
      appTxHash?: string;
      /** full path to the related naira_admin doc */
      nairaAdminDocPath?: string;
      /** Path (in users_transactions_withdrawal collection) to doc containing data related to the utility payment request */
      txPath?: string;
      /** Product amount retrieved from tx doc root */
      amount?: number;
      /** ID of the utility payment tx we generate and supply to the provider */
      appOrderId?: string;
      /** ID of the utility payment tx the provider generates and sends back to us */
      providerOrderId?: string;
      provider?: BaseProvider;
      paymentData?: TAppPaymentData;
    }
  }
}
