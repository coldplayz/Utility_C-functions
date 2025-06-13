import ErrorHandler from "../../errors/errManager";
import ObjectValidator from "../../helpers/@objectValidator";
import {
  DeepRequired,
  Flatten,
  TUtilityWithdrawalReadData,
} from "../../interface/types";
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
  "utility.appOrderId": "string",
  "utility.providerOrderId": "string",
  "utility.providerId": "isProviderId",
} satisfies {
  [k in keyof Flatten<DeepRequired<TUtilityWithdrawalReadData>>]?: string;
};
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
