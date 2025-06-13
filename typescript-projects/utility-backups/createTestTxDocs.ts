import { generateRandomIntRange } from "./helpers/@generateRandom";
import { ProviderId } from "./interface/enums";
import { TUtilityWithdrawalReadData } from "./interface/types";
import ConfigDB from "./models/config/configDB";

const nairaAdminData = { status: "approved" };

const airtimeNairaAdminPath =
  "/naira_admins/2025/April/28/transactions/hashairtime";
const airtimeDocPath =
  "/users_transactions_withdrawal/uid1/utility/hashairtime";
const airtimeData: TUtilityWithdrawalReadData = {
  adminInfo: {
    naira_path: "naira_admins/2025/April/28/transactions/hashairtime",
  },
  hash: "hashairtime",
  userId: "uid1",
  amount: generateRandomIntRange(),
  reasonMeta: {
    provider: ProviderId.Giftbills,
    merchant: "airtel-ng",
    phoneNumber: "+2348103665556",
  },
};

const internetNairaAdminPath =
  "/naira_admins/2025/April/28/transactions/hashinternet";
const internetDocPath =
  "/users_transactions_withdrawal/uid1/utility/hashinternet";
const internetData: TUtilityWithdrawalReadData = {
  adminInfo: {
    naira_path: "naira_admins/2025/April/28/transactions/hashinternet",
  },
  hash: "hashinternet",
  userId: "uid1",
  amount: generateRandomIntRange(),
  reasonMeta: {
    provider: ProviderId.Ebills,
    merchant: "spectranet",
    phoneNumber: "07064859204",
    variationId: "one-week-data-plan-code",
  },
};

const betNairaAdminPath = "/naira_admins/2025/April/28/transactions/hashbet";
const betDocPath = "/users_transactions_withdrawal/uid1/utility/hashbet";
const betData: TUtilityWithdrawalReadData = {
  adminInfo: {
    naira_path: "naira_admins/2025/April/28/transactions/hashbet",
  },
  hash: "hashbet",
  userId: "uid1",
  amount: generateRandomIntRange(),
  reasonMeta: {
    provider: ProviderId.Ebills,
    merchant: "paripesa",
    customerId: "id-at-bet-merchant",
  },
};

const cableTvNairaAdminPath =
  "/naira_admins/2025/April/28/transactions/hashcableTv";
const cableTvDocPath =
  "/users_transactions_withdrawal/uid1/utility/hashcableTv";
const cableTvData: TUtilityWithdrawalReadData = {
  adminInfo: {
    naira_path: "naira_admins/2025/April/28/transactions/hashcableTv",
  },
  hash: "hashcableTv",
  userId: "uid1",
  amount: generateRandomIntRange(),
  reasonMeta: {
    provider: ProviderId.Ebills,
    merchant: "dstv",
    cardNumber: "id-at-cableTv-merchant",
    variationId: "family-bouquet-code",
  },
};

const electricityNairaAdminPath =
  "/naira_admins/2025/April/28/transactions/hashelectricity";
const electricityDocPath =
  "/users_transactions_withdrawal/uid1/utility/hashelectricity";
const electricityData: TUtilityWithdrawalReadData = {
  adminInfo: {
    naira_path: "naira_admins/2025/April/28/transactions/hashelectricity",
  },
  hash: "hashelectricity",
  userId: "uid1",
  amount: generateRandomIntRange(),
  reasonMeta: {
    provider: ProviderId.Ebills,
    merchant: "ikeja-electric",
    customerId: "id-at-prepaid-merchant",
    productType: "prepaid",
  },
};

const promises = [
  ConfigDB.nairaFirestore.doc(airtimeDocPath).set(airtimeData),
  ConfigDB.nairaFirestore.doc(airtimeNairaAdminPath).set(nairaAdminData),

  ConfigDB.nairaFirestore.doc(internetDocPath).set(internetData),
  ConfigDB.nairaFirestore.doc(internetNairaAdminPath).set(nairaAdminData),

  ConfigDB.nairaFirestore.doc(betDocPath).set(betData),
  ConfigDB.nairaFirestore.doc(betNairaAdminPath).set(nairaAdminData),

  ConfigDB.nairaFirestore.doc(cableTvDocPath).set(cableTvData),
  ConfigDB.nairaFirestore.doc(cableTvNairaAdminPath).set(nairaAdminData),

  ConfigDB.nairaFirestore.doc(electricityDocPath).set(electricityData),
  ConfigDB.nairaFirestore.doc(electricityNairaAdminPath).set(nairaAdminData),
];

Promise.all(promises).then(console.log);
