import ErrorHandler from "../../errors/errManager";
import ObjectValidator from "../../helpers/@objectValidator";
import selectRandom from "../../helpers/@selectRandom";
import { UtilityMerchant, UtilityProduct } from "../../interface/enums";
import { Flatten, TUtilityWithdrawalReadData } from "../../interface/types";
import ConfigDB from "../config/configDB";
import Obtain from "./obtain";

const txDocRule = {
  adminInfo: "required",
  "adminInfo.naira_path": "required|string",
  userId: "required|string",
  hash: "required|string",
  amount: `required|isNumber`,
  "reasonMeta.provider": `required|isProviderId`,
  "reasonMeta.merchant": "required|string",
  "reasonMeta.customerId": "string",
  "reasonMeta.cardNumber": "string",
  "reasonMeta.phoneNumber": `string`,
  "reasonMeta.variationId": "string",
  "utility.appOrderId": "required|string",
  "utility.providerOrderId": "required|string",
  "utility.providerId": "required|isProviderId",
} satisfies { [k in keyof Flatten<TUtilityWithdrawalReadData>]?: string };
const txDocValidator = new ObjectValidator(txDocRule);

/**
 * Get and validate data related to a utility bill payment request.
 * @param txPath - full path to the doc in DB (users_transactions_withdrawal).
 * @returns data containing info for processing (and updating) a utility payment.
 */
export default async function getUtilityTxDoc(
  txPath: string
): Promise<TUtilityWithdrawalReadData> {
  try {
    // Get data at txPath
    const txData = await Obtain.dataByDocRef<TUtilityWithdrawalReadData>(
      ConfigDB.getNairaDocRefByFullPath(txPath)
    );

    // Validate it
    if (!txDocValidator.validate(txData))
      throw new ErrorHandler("Error validating tx doc.", false, {
        cause: txDocValidator.response,
        source: getUtilityTxDoc.name,
      });

    return txData;
  } catch (error) {
    if (error instanceof ErrorHandler) throw error;
    throw new ErrorHandler(
      `error getting valid doc at txPath ${txPath}`,
      false,
      error
    );
  }
}

// TODO: test only (or maybe not???)
export function getProductIdByMerchant(merchant: UtilityMerchant) {
  const merchantToProductMap: {
    [K in UtilityMerchant]: UtilityProduct[];
  } = {
    // Mobile
    "9mobile": [UtilityProduct.Airtime, UtilityProduct.Internet],
    glo: [UtilityProduct.Airtime, UtilityProduct.Internet],
    mtn: [UtilityProduct.Airtime, UtilityProduct.Internet],
    airtel: [UtilityProduct.Airtime, UtilityProduct.Internet],
    spectranet: [UtilityProduct.Internet],
    // Electricity
    abaElectric: [UtilityProduct.Prepaid, UtilityProduct.Postpaid],
    abujaElectric: [UtilityProduct.Prepaid, UtilityProduct.Postpaid],
    ekoElectric: [UtilityProduct.Prepaid, UtilityProduct.Postpaid],
    ikejaElectric: [UtilityProduct.Prepaid, UtilityProduct.Postpaid],
    kadunaElectric: [UtilityProduct.Prepaid, UtilityProduct.Postpaid],
    // Bet
    bet9ja: [UtilityProduct.Bet],
    betking: [UtilityProduct.Bet],
    betway: [UtilityProduct.Bet],
    nairabet: [UtilityProduct.Bet],
    sportybet: [UtilityProduct.Bet],
    // Cable TV
    dstv: [UtilityProduct.CableTv],
    gotv: [UtilityProduct.CableTv],
    startimes: [UtilityProduct.CableTv],
  };

  return selectRandom(merchantToProductMap[merchant]);
}
