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

/** Unique identifier for each of our providers. E.g. vtpass, remita, paga */
export enum ProviderId {
  Ebills = "ebills",
  Giftbills = "giftbills",
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
