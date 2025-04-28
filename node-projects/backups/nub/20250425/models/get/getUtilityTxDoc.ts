import ErrorHandler from "../../errors/errManager";
import ObjectValidator from "../../helpers/@objectValidator";
import {
  Flatten,
  TUtilityWithdrawalReadData,
  UtilityProduct,
} from "../../interface/types";
import Path from "../config/path";
import Obtain from "./obtain";

const txDocRule = {
  adminInfo: "required",
  "adminInfo.naira_path": "required|string",
  userId: "required|string",
  hash: "required|string",
  utility: "required|isUtilityId",
  "utilityMeta.customerId": "required|string",
  "utilityMeta.merchantId": "required|isUtilityMerchantId",
  "utilityMeta.productId": "required|isUtilityProductId",
  "utilityMeta.planId": `required_if:utilityMeta.productId,${UtilityProduct.Plan}|string`,
  "utilityMeta.amount": `required_unless:utilityMeta.productId,${UtilityProduct.Plan}|isNumber`,
} satisfies { [k in keyof Flatten<TUtilityWithdrawalReadData>]?: string };
const txDocValidator = new ObjectValidator(txDocRule);

/**
 * Get and validate data related to a utility bill payment request.
 * @param txPath - full path to the doc in DB (users_transactions_withdrawal).
 * @returns data containing info for processing (and updating) a utility payment.
 */
export default async function getUtilityTxDoc(txPath: string) {
  // Get data at txPath
  const txData = await Obtain.dataByDocRef<TUtilityWithdrawalReadData>(
    Path.getNairaDocRefByFullPath(txPath)
  );

  // Validate it
  if (!txDocValidator.validate(txData))
    throw new ErrorHandler("Error validating tx doc.", false, {
      cause: txDocValidator.response,
    });

  return txData;
}
