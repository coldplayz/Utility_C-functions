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
  processMobile: "/bills/mobile/process";
  processElectricity: "/bills/electricity/process";
  processCableTv: "/bills/cableTv/process";
  processBet: "/bills/bet/process";
  processStatus: "/bills/status/process";
};
export type MicroServiceRoutePathVal =
  MicroServiceRoutePath[keyof MicroServiceRoutePath];

/** Data passed in query when making a request to the status-processing endpoint */
export type TStatusQuery = {
  providerId: ProviderId;
  status: AppTxStatus;
  /** Path (in users_transactions_withdrawal collection) to doc containing data related to the utility payment request */
  txPath?: string;
} & { status: AppTxStatus.Mempool; txPath: string };

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
  IkejaElectric = "ikeja",
  AbujaElectric = "abuja",
  EkoElectric = "eko",
  KadunaElectric = "kaduna",
  AbaElectric = "aba",
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
export enum UtilityMerchantService {
  Airtime = "airtime",
  Prepaid = "prepaid",
  Postpaid = "postpaid",
  Plan = "plan",
  Default = "default",
}

// TODO: update
export type TPlanData = {
  providerId: ProviderId;
  planCode: string;
  amount: number;
};

export type TPaymentData = TUtilityMeta &
  (
    | {
        // Require plan data as well, if service is of 'plan' type...
        merchantServiceId: UtilityMerchantService.Plan;
        planData: TPlanData;
      }
    | {
        // ...otherwise, it should not be present.
        merchantServiceId: Exclude<UtilityMerchantService, "plan">;
        planData?: undefined;
      }
  );

export interface IUtilityProvider {
  /** Maps merchant service IDs recognized by our app with those of a specific provider. */
  appToProviderServiceMap: { [K in UtilityMerchantService]: string };

  /**
   * Determines if a provider supports a merchant service/product.
   * @param service - the merchant service ID recognized by our app.
   * @returns true if specified service/product payment is supported
   */
  supports(service: UtilityMerchantService): boolean;

  /**
   * Make utility payment for airtime.
   * @param paymentData - all data that'll be needed to make the utility payment.
   * @returns data to help with further processing of the request at the business logic level.
   */
  [UtilityMerchantService.Airtime](
    paymentData: TPaymentData
  ): Promise<IProviderPaymentResult>;

  /**
   * Make utility payment for a merchant's default service (variable pricing).
   * @param paymentData - all data that'll be needed to make the utility payment.
   * @returns data to help with further processing of the request at the business logic level.
   */
  [UtilityMerchantService.Default](
    paymentData: TPaymentData
  ): Promise<IProviderPaymentResult>;

  /**
   * Make utility payment for merchant services grouped into bundles with fixed prices.
   * @param paymentData - all data that'll be needed to make the utility payment.
   * @returns data to help with further processing of the request at the business logic level.
   */
  [UtilityMerchantService.Plan](
    paymentData: TPaymentData
  ): Promise<IProviderPaymentResult>;

  /**
   * Make utility payment for electricity postpaid service.
   * @param paymentData - all data that'll be needed to make the utility payment.
   * @returns data to help with further processing of the request at the business logic level.
   */
  [UtilityMerchantService.Postpaid](
    paymentData: TPaymentData
  ): Promise<IProviderPaymentResult>;

  /**
   * Make utility payment for electricity prepaid service.
   * @param paymentData - all data that'll be needed to make the utility payment.
   * @returns data to help with further processing of the request at the business logic level.
   */
  [UtilityMerchantService.Prepaid](
    paymentData: TPaymentData
  ): Promise<IProviderPaymentResult>;

  /** Returns the current transaction status of the bill payment request */
  checkStatus(
    reqQuery: TStatusQuery,
    _reqBody: Record<string, unknown>
  ): Promise<TCheckStatusResult>;

  /**
   * Derive a request reference given a transaction path.
   * @param txPath - full path to transaction doc (users_transactions_withdrawal).
   * @returns reference used to make the payment request to the provider.
   */
  txpathToTxref(txPath: string): string;
  /**
   * Derive a transaction path given a request reference.
   * @param txRef - reference used to make the payment request to the provider.
   * @returns full path to transaction doc (users_transactions_withdrawal).
   */
  txrefToTxpath(txRef: string): string;
}

/** Unique identifier for each of our providers. E.g. vtpass, remita, paga */
export enum ProviderId {
  ProviderX = "providerX", // TODO: remove; test provider
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
  /** How status update is retrieved; push (webhook) or pull (calling provider) */
  statusUpdateMethods: { isPushToApp: boolean; isPullFromProvider: boolean };
}

export type TStatusDocsWriteTxData = {
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
  merchantServiceId: UtilityMerchantService;
  planId?: string;
  amount?: number;
} & (
  | {
      // Require planId if service is of 'plan' type...
      merchantServiceId: UtilityMerchantService.Plan;
      planId: string;
      amount?: undefined;
    }
  | {
      // ...else, require amount instead
      merchantServiceId: Exclude<UtilityMerchantService, "plan">;
      planId?: undefined;
      amount: number;
    }
);
export type TUtilityWithdrawalReadData = {
  adminInfo: {
    /** Path to the related naira_admins doc */
    naira_path: string;
  };
  amount: number;
  /** doc ID for this, and the related naira_admins and naira_metadata update docs */
  hash: string;
  userId: string;
  utility: Utility;
  utilityMeta: TUtilityMeta;
};

export type TNairaAdminTxWriteData = {
  utilityStatus: AppTxStatus;
};

export type TNairaMetadataUtilityWriteData = {
  utilityStatus: AppTxStatus;
  /** ID of the utility payment tx we generate and supply to the provider */
  reference?: string;
  txTimestamp?: number;
  providerId?: ProviderId;
};

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    // Improve type-safety for the otherwise permissive `locals` object
    interface Locals {
      utility?: Utility;
      // utilityMerchant?: UtilityMerchant;
      // utilityMerchantService?: UtilityMerchantService;
      // amount?: number;
      // planId?: string;
      planData?: TPlanData;
      providerId?: ProviderId;
      // /** Unique identifier for the customer, at the merchant */
      // customerId?: string;
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
      /** Data sent in the query to the status processing endpoint */
      statusQuery?: TStatusQuery;
    }
  }
}
