import BaseProvider from "../lib/external/providerBaseApi"; // TODO: see about doing without this (import)

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
  AUTHORIZED_SERVICES_ID: string;
  PUBSUB_JWT_SECRET: string;
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
  AUTHORIZED_SERVICES_ID: string[];
  PUBSUB_JWT_SECRET: string;
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
  processPrepaid: "/bills/electricity/processPrepaid";
  processPostpaid: "/bills/electricity/processPostpaid";
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

export enum Utility {
  Mobile = "mobile",
  Electricity = "electricity",
  Cable = "cableTv",
  Bet = "bet",
}
// TODO: update
export enum UtilityMerchant {
  // Mobile merchants
  Mtn = "mtn",
  Airtel = "airtel",
  Glo = "glo",
  NineMobile = "9mobile",
  Spectranet = "spectranet",
  // Electricity merchants
  IkejaElectric = "ikejaElectric",
  AbujaElectric = "abujaElectric",
  EkoElectric = "ekoElectric",
  KadunaElectric = "kadunaElectric",
  AbaElectric = "abaElectric",
  // Cable TV merchants
  Dstv = "dstv",
  Gotv = "gotv",
  Startimes = "startimes",
  // Bet merchants
  Betking = "betking",
  Bet9ja = "bet9ja",
  Betway = "betway",
  Sportybet = "sportybet",
  Nairabet = "nairabet",
}
// TODO: merchantService -> product
export enum UtilityProduct {
  Airtime = "airtime",
  Internet = "internet",
  Prepaid = "prepaid",
  Postpaid = "postpaid",
  CableTv = "cableTv",
  Bet = "bet",
}

/** Plan type, whether a new or renewal request */
export enum PlanType {
  Renew = "renew",
  Subscribe = "subscribe",
}

// TODO: update
export type TPlanData = {
  providerId: ProviderId;
  planCode?: string;
  type?: PlanType;
};

export type TPaymentData = TUtilityMeta & TPlanData;

/** Data expected to come into the payment-processing endpoint service class */
export type TProcessData = {
  paymentData: TPaymentData;
  uid: string;
  appTxHash: string;
  nairaAdminDocPath: string;
  txPath: string;
  provider: BaseProvider;
};

/** Data expected to come into the status-processing endpoint service class */
export type TStatusData = {
  provider: BaseProvider;
  queryStatus: AppTxStatus;
  reference?: string;
  txPath?: string;
};

/** Unique identifier for each of our providers. E.g. vtpass, remita, paga */
export enum ProviderId {
  Ebills = "ebills",
}

export enum ProviderTxStatus {
  Pending = "pending",
  Successfull = "successful",
  Failed = "failed",
}
export enum AppTxStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
  Mempool = "mempool",
}

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

// ------------------- MODEL -------------------

/** Contains data about the utility payment request */
export type TUtilityMeta = {
  /** Unique identifier for the customer, at the merchant */
  customerId: string;
  merchantId: UtilityMerchant;
  productId: UtilityProduct;
  planId: string;
  amount: number;
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
  utility: Utility;
  utilityMeta: TUtilityMeta;
};

export type TNairaAdminTxWriteData = {
  utilityStatus?: AppTxStatus;
};

export type TNairaMetadataUtilityWriteData = {
  utilityStatus?: AppTxStatus;
  /** ID of the utility payment tx we generate and supply to the provider */
  reference?: string;
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
      planData?: TPlanData;
      // providerId?: ProviderId;
      /** Contains data about the utility payment request */
      utilityMeta?: TUtilityMeta;
      /** uid of user whose utility request is being handled */
      uid?: string;
      /** hash of naira withdrawal tx, which also serves as tx doc ID */
      appTxHash?: string;
      /** full path to the related naira_admin doc */
      nairaAdminDocPath?: string;
      /** Path (in users_transactions_withdrawal collection) to doc containing data related to the utility payment request */
      txPath?: string;
      /** Status set in the query of the status-processing request */
      queryStatus?: AppTxStatus;
      /** Utility payment request ID retrieved via 'metaPath' in a mempool request */
      reference?: string;
      provider?: BaseProvider;
    }
  }
}
