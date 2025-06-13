export type txPathDoc = {
  reason: "mobile" | "electricity" | "cableTv" | "bet";
  reasonMeta: {
    providerId: "ebills";
    /** id at merchant. E.g. phone number, meter number, smart card number, bet account ID */
    customerId: string;
    /** the merchant identifier at the provider. E.g. mtn, MTN, mtn-ng, etc */
    merchantId: string;
    /** the merchant product identifier, if exists. Provider-specific; optional if product is bet, airtime, prepaid, or postpaid (variable pricing model products) */
    productId: string;
    /** the value of the payment, if variable pricing as with airtime and bet; optional if fixed pricing for product (e.g. internet and cableTv products) */
    amount: number;
  };
};
