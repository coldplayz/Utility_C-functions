import ErrorHandler from "../../errors/errManager";
import selectRandom from "../../helpers/@selectRandom";
import {
  PlanType,
  ProviderId,
  TPlanData,
  UtilityProduct,
} from "../../interface/types";
import { generateRandomHex } from "../../helpers/@generateRandom";

// const txDocRule = {
//   adminInfo: "required",
//   "adminInfo.naira_path": "required|string",
//   userId: "required|string",
//   hash: "required|string",
//   utility: "required|isUtilityId",
//   "utilityMeta.customerId": "required|string",
//   "utilityMeta.merchantId": "required|isUtilityMerchantId",
//   "utilityMeta.merchantServiceId": "required|isUtilityMerchantServiceId",
//   "utilityMeta.planId": `required_if:utilityMeta.merchantServiceId,${UtilityMerchantService.Plan}`,
//   "utilityMeta.amount": `required_without:utilityMeta.planId|isNumber`,
// } satisfies { [k in keyof Flatten<TUtilityWithdrawalReadData>]?: string };
// const txDocValidator = new ObjectValidator(txDocRule);

/**
 * Get and validate data related to a utility bill payment plan ID.
 * @param planId - ID of the plan.
 * @returns data containing info about an Atechcoins plan.
 */
export default async function getPlanData(
  _planId: string,
  productId: UtilityProduct // TODO: test only?
) {
  try {
    // TODO: Get data at planId doc
    //   const txData = await Obtain.dataByDocRef<TUtilityWithdrawalReadData>(
    //     Path.getNairaDocRefByFullPath(planId)
    //   );

    // TODO: Validate it
    //   if (!txDocValidator.validate(txData))
    //     throw new ErrorHandler("Error validating tx doc.", false, {
    //       cause: txDocValidator.response,
    //     });

    // TODO: test only
    const plans: TPlanData[] = [
      generatePlanFor(productId),
      generatePlanFor(productId),
      generatePlanFor(productId),
      generatePlanFor(productId),
      generatePlanFor(productId),
    ];

    return selectRandom(plans);
  } catch (error) {
    if (error instanceof ErrorHandler) throw error;
    throw new ErrorHandler(
      `error fetching plan data for planId: ${_planId}`,
      false,
      error
    );
  }
}

export function generatePlanFor(productId: UtilityProduct): TPlanData {
  const providerId = selectRandom(Object.values(ProviderId));
  const planProducts = [UtilityProduct.CableTv, UtilityProduct.Internet];
  let planCode;
  let type;

  if (planProducts.includes(productId)) planCode = generateRandomHex(8);
  if (productId === UtilityProduct.CableTv)
    type = selectRandom(Object.values(PlanType));

  return { providerId, planCode, type };
}
