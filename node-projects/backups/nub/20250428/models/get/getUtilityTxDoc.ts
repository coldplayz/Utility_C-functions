import ErrorHandler from "../../errors/errManager";
import {
  generateRandomHex,
  generateRandomIntRange,
} from "../../helpers/@generateRandom";
import ObjectValidator from "../../helpers/@objectValidator";
import selectRandom from "../../helpers/@selectRandom";
import {
  Flatten,
  TUtilityMeta,
  TUtilityWithdrawalReadData,
  Utility,
  UtilityMerchant,
  UtilityProduct,
} from "../../interface/types";
import { getProductIdByMerchant } from "../../routes/middleware/locals/validateTxPath";
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
export default async function getUtilityTxDoc(
  txPath: string
): Promise<TUtilityWithdrawalReadData> {
  try {
    // Get data at txPath
    const txData = await Obtain.dataByDocRef<TUtilityWithdrawalReadData>(
      Path.getNairaDocRefByFullPath(txPath)
    );

    // Validate it
    if (!txDocValidator.validate(txData))
      throw new ErrorHandler("Error validating tx doc.", false, {
        cause: txDocValidator.response,
        source: getUtilityTxDoc.name,
      });

    return txData;
  } catch (error) {
    // Probably a test/dev request; use hard-coded data
    // TODO: test/dev only
    const utility = selectRandom(Object.values(Utility));
    const merchantId = selectRandom(Object.values(UtilityMerchant));
    const productId = getProductIdByMerchant(merchantId);
    const utilityMeta = {
      customerId: `customer_${generateRandomHex(3)}`,
      merchantId,
      productId,
      planId:
        productId === UtilityProduct.Plan ? generateRandomHex(8) : undefined,
      amount:
        productId !== UtilityProduct.Plan
          ? generateRandomIntRange()
          : undefined,
    } as TUtilityMeta;

    const uid = "sE4toJDcBIhVSZqN4SugcpWGwt82";
    const appTxHash =
      "0a5ecb9e5febd56895679124c7dae1328dc42a29ca2d2a23c9947ede21f6eab3";
    const nairaAdminDocPath =
      "/naira_admins/2025/March/27/transactions/0a5ecb9e5febd56895679124c7dae1328dc42a29ca2d2a23c9947ede21f6eab3";

    return {
      adminInfo: {
        naira_path: nairaAdminDocPath,
      },
      amount: utilityMeta.amount,
      hash: appTxHash,
      userId: uid,
      utility: utility,
      utilityMeta: utilityMeta,
    };
  }
}
