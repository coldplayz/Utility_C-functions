import ErrorHandler from "../../errors/errManager";
import selectRandom from "../../helpers/@selectRandom";
import { ProviderId, TPlanData } from "../../interface/types";
import {
  generateRandomHex,
  generateRandomIntRange,
} from "../../helpers/@generateRandom";

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
 * @returns data containing info about an Atechcoins plan (for bundled services/products with fixed prices).
 */
export default async function getPlanData(_planId: string) {
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
      {
        providerId: selectRandom(Object.values(ProviderId)),
        planCode: generateRandomHex(8),
        amount: generateRandomIntRange(),
      },
      {
        providerId: selectRandom(Object.values(ProviderId)),
        planCode: generateRandomHex(8),
        amount: generateRandomIntRange(),
      },
      {
        providerId: selectRandom(Object.values(ProviderId)),
        planCode: generateRandomHex(8),
        amount: generateRandomIntRange(),
      },
      {
        providerId: selectRandom(Object.values(ProviderId)),
        planCode: generateRandomHex(8),
        amount: generateRandomIntRange(),
      },
      {
        providerId: selectRandom(Object.values(ProviderId)),
        planCode: generateRandomHex(8),
        amount: generateRandomIntRange(),
      },
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
