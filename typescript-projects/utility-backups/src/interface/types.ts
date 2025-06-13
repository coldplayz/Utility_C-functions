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
  // AUTHORIZED_SERVICES_ID: string;
  // PUBSUB_JWT_SECRET: string;
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
  // AUTHORIZED_SERVICES_ID: string[];
  // PUBSUB_JWT_SECRET: string;
  // PUSH_NOTIFICATION_ENDPOINT: string;
};

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

export type MicroServiceRoutePath = {
  serviceStatus: "/status";
  processBill: "/bill/process";
  approveBill: "/bill/approve";
  reverseBill: "/bill/reverse";
};
export type MicroServiceRoutePathVal =
  MicroServiceRoutePath[keyof MicroServiceRoutePath];

export enum Utility {
  Airtime = "airtime",
  Internet = "internet",
  Electricity = "electricity",
  Cable = "cable-tv",
  Bet = "bet",
}

export interface IUitilityProvider {
  payAirtime(): Promise<void>;
}

export interface IBuyAirtimeInput {}

// export interface INotificationMessage {
//   title: string;
//   body: string;
// }

// export type TransactionBlock = {
//   exists: boolean;
//   id?: string;
//   newBlock?: ReferralCollectionBlock;
//   latestBlock?: ReferralCollectionBlock;
// } & (
//   | { exists: false; id?: never; newBlock?: never; latestBlock?: never }
//   | {
//       // If newBlock is specified, latestBlock must not be set
//       exists: true;
//       id: string;
//       newBlock: ReferralCollectionBlock;
//       latestBlock?: never;
//     }
//   | {
//       // If latestBlock is specified, newBlock must not be set
//       exists: true;
//       id: string;
//       latestBlock: ReferralCollectionBlock;
//       newBlock?: never;
//     }
// );

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
      /** Auth user ID; for addReferral, it's the uid of the just-registered user */
      uid?: string;
      referralCode?: string;
      /** Array of uids in traded that are not in rewarded in credit block */
      tradedUids?: string[];
      serviceId?: string;
      /** Used to distinguish from new user (referral) uid in addReferral */
      referrerUid?: string;
      /** Latest block (by height) in the blockchain */
      // latestBlock?: ReferralCollectionBlock | null;
      /** uid of the user whose referral blockchain to validate/update */
      blockchainUid?: string;
      /** Email of the auth user */
      email?: string;
    }
  }
}
