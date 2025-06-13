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
        [K in keyof T]: K extends string
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
export enum UtilityMerchant {}
export enum UtilityMerchantService {
  Airtime = "airtime",
  Internet = "internet",
}

// export interface IUtilityProvider {
//   payAirtime(): Promise<void>;
//   payBet(): Promise<void>;
//   payCableTv(): Promise<void>;
//   payElectricity(): Promise<void>;
//   payInternet(): Promise<void>;
// }

// export interface IUtilityProvider {
//   /** Makes request to provider for bill payment */
//   pay(): Promise<void>;
//   /** Returns the current transaction status of the bill payment request */
//   checkStatus(): Promise<PaymentStatus>;
// }

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

/** Unique identifier for each of our providers. E.g. vtpass, remita, paga */
export enum ProviderId {
  ProviderX = "providerX", // TODO: remove; test provider
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

export type TUtilityWithdrawalReadData = {
  adminInfo: {
    /** Path to the related naira_admins doc */
    naira_path: string;
  };
  amount: number;
  /** doc ID for this, and the related naira_admins and naira_metadata update docs */
  hash: string;
  userId: string;
  reason: Exclude<Utility, "mobile"> | UtilityMerchantService;
  reasonMeta: Record<string, unknown>;
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

// export interface IAirtimeProvider {
//   /** Makes request to provider for bill payment */
//   pay(): Promise<void>;
//   /** Returns the current transaction status of the bill payment request */
//   checkStatus(): Promise<PaymentStatus>;
// }

// export interface IDataProvider {
//   /** Makes request to provider for bill payment */
//   pay(): Promise<void>;
//   /** Returns the current transaction status of the bill payment request */
//   checkStatus(): Promise<PaymentStatus>;
// }

// export interface IElectricityProvider {
//   /** Makes request to provider for bill payment */
//   pay(): Promise<void>;
//   /** Returns the current transaction status of the bill payment request */
//   checkStatus(): Promise<PaymentStatus>;
// }

// export interface ICableTvProvider {
//   /** Makes request to provider for bill payment */
//   pay(): Promise<void>;
//   /** Returns the current transaction status of the bill payment request */
//   checkStatus(): Promise<PaymentStatus>;
// }

// export interface IBetProvider {
//   /** Makes request to provider for bill payment */
//   pay(): Promise<void>;
//   /** Returns the current transaction status of the bill payment request */
//   checkStatus(): Promise<PaymentStatus>;
// }

// export interface IUtilityService {
//   pay(): Promise<string>;
//   onSuccess(): Promise<string>;
//   onFailure(): Promise<string>;
// }

// export interface INotificationMessage {
//   title: string;
//   body: string;
// }

// export type UserProfileSelectOption =
//   KeyofFlattenedUserProfileCollectionReadData[];
// export type ReferralBlockchainSelectOption =
//   (keyof TReferralBlockchainCollectionData)[];
// export type CryptoTransactionSelectOption =
//   (keyof IUserCryptoTransactionCollectionReadData)[];
// export type GiftcardTransactionSelectOption =
//   (keyof IUserGiftcardTransactionCollectionReadData)[];

// export type QueryOption<SelectOption> = {
//   /** Array of [top-level] fields to include in each returned doc */
//   select?: SelectOption;
// };

// // =================== USER PROFILE COLLECTION START ===================
// export type TUserProfileCollectionReadData = {
//   uid?: string;
//   referralDetails?: {
//     referralCode?: string;
//     referredList?: string[];
//     referredRewarded?: { [k: string]: string };
//     referredTraded?: { [k: string]: string };
//     height?: number;
//     rewardPoints?: number;
//     referredBy?: string;
//   };
// };

// export type TUserProfileCollectionWriteData = {
//   referralDetails: {
//     referralCode?: string | FieldValue;
//     referredList?: string[] | FieldValue;
//     referredRewarded?: { [k: string]: string | FieldValue };
//     referredTraded?: { [k: string]: string | FieldValue };
//     height?: number | FieldValue;
//     rewardPoints?: number | FieldValue;
//     referredBy?: string | FieldValue;
//   };
// };
// export interface IUserProfileCollectionWriteDto {
//   referralDetails: {
//     referralCode?: TWriteDto<string>;
//     referredList?: TWriteDto<string[]>;
//     referredRewarded?: { [k: string]: TWriteDto<string> };
//     referredTraded?: { [k: string]: TWriteDto<string> };
//     height?: TWriteDto<number>;
//     rewardPoints?: TWriteDto<number>;
//     referredBy?: TWriteDto<string>;
//   };
// }

// export type FlattenedUserProfileCollectionWriteData = Flatten<
//   Required<{
//     [K in keyof TUserProfileCollectionWriteData]: Required<
//       TUserProfileCollectionWriteData[K]
//     >;
//   }>
// >;
// export type FlattenedUserProfileCollectionReadData = Flatten<
//   Required<{
//     [K in keyof TUserProfileCollectionReadData]: Required<
//       TUserProfileCollectionReadData[K]
//     >;
//   }>
// >;
// export type KeyofFlattenedUserProfileCollectionWriteData =
//   keyof FlattenedUserProfileCollectionWriteData;
// export type KeyofFlattenedUserProfileCollectionReadData =
//   keyof FlattenedUserProfileCollectionReadData;
// // =================== USER PROFILE COLLECTION END ===================

// // =================== REFERRAL BLOCKCHAIN COLLECTION START ===================
// export type TReferralBlockchainCollectionData = {
//   referredList: string[];
//   referredRewarded: { [k: string]: string };
//   referredTraded: { [k: string]: string };
//   height: number;
//   rewardPoints: number;
//   previousHash: string;
//   timestamp: number;
//   hash: string;
// };

// export type TReferralBlockchainCollectionDataToHash = {
//   referredList: string[];
//   referredRewarded: { [k: string]: string };
//   referredTraded: { [k: string]: string };
//   height: number;
//   rewardPoints: number;
//   previousHash: string;
// };

// export type KeyofFlattenedReferralBlockchainCollectionData =
//   keyof Flatten<TReferralBlockchainCollectionData>;

// // =================== REFERRAL BLOCKCHAIN COLLECTION END ===================

// // =================== CRYPTO TRANSACTION COLLECTION START ===================
// export interface IUserCryptoTransactionCollectionReadData {
//   userId: string;
// }
// // =================== CRYPTO TRANSACTION COLLECTION END ===================

// // =================== GIFTCARD TRANSACTION COLLECTION START ===================
// export interface IUserGiftcardTransactionCollectionReadData {
//   userId: string;
// }
// // =================== GIFTCARD TRANSACTION COLLECTION END ===================

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    // Improve type-safety for the otherwise permissive `locals` object
    interface Locals {
      utility?: Utility;
      utilityMerchantService?: UtilityMerchantService;
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
