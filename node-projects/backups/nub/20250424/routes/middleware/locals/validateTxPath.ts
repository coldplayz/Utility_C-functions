/**
 * Ensures txPath points to valid document and save relevant data therefrom.
 */

import { NextFunction, Request, Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import {
  Utility,
  UtilityMerchant,
  UtilityMerchantService,
  TUtilityMeta,
  ProviderId,
  IUtilityProvider,
} from "../../../interface/types";
import selectRandom from "../../../helpers/@selectRandom";
import getUtilityTxDoc from "../../../models/get/getUtilityTxDoc";
import {
  generateRandomHex,
  generateRandomIntRange,
} from "../../../helpers/@generateRandom";
import getPlanData from "../../../models/get/getPlanData";
import { idToProviderMap } from "../../../constants";

export default async function validateTxPath(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const txPath = res.locals.txPath;

  try {
    if (!txPath)
      throw new ErrorHandler("Missing txPath in locals!.", false, {
        source: "validateTxPath MD.",
      });

    // Get and validate data at txPath
    const txData = await getUtilityTxDoc(txPath);

    // TODO: set other data
    res.locals.uid = txData.userId;
    res.locals.appTxHash = txData.hash;
    res.locals.nairaAdminDocPath = txData.adminInfo.naira_path;
    res.locals.utility = txData.utility;
    res.locals.utilityMeta = txData.utilityMeta;
    if (txData.utilityMeta.merchantServiceId === UtilityMerchantService.Plan)
      res.locals.planData = await getPlanData(txData.utilityMeta.planId);
    res.locals.providerId =
      res.locals.planData?.providerId ||
      getSupportingProvider(
        txData.utilityMeta.merchantId,
        txData.utilityMeta.merchantServiceId
      );

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (!txPath) {
      // Probably a test/dev request; use hard-coded data
      // TODO: test/dev only
      res.locals.utility = selectRandom(Object.values(Utility));
      const merchantId = selectRandom(Object.values(UtilityMerchant));
      const merchantServiceId = getProductIdByMerchant(merchantId);
      const utilityMeta = {
        customerId: `customer_${generateRandomHex(3)}`,
        merchantId,
        merchantServiceId,
        planId:
          merchantServiceId === UtilityMerchantService.Plan
            ? generateRandomHex(8)
            : undefined,
        amount:
          merchantServiceId !== UtilityMerchantService.Plan
            ? generateRandomIntRange()
            : undefined,
      } as TUtilityMeta;
      res.locals.utilityMeta = utilityMeta;
      if (utilityMeta.merchantServiceId === UtilityMerchantService.Plan)
        res.locals.planData = await getPlanData(utilityMeta.planId);

      res.locals.providerId =
        res.locals.planData?.providerId ||
        getSupportingProvider(
          utilityMeta.merchantId,
          utilityMeta.merchantServiceId
        );

      res.locals.uid = "sE4toJDcBIhVSZqN4SugcpWGwt82";
      res.locals.appTxHash =
        "0a5ecb9e5febd56895679124c7dae1328dc42a29ca2d2a23c9947ede21f6eab3";
      res.locals.nairaAdminDocPath =
        "/naira_admins/2025/March/27/transactions/0a5ecb9e5febd56895679124c7dae1328dc42a29ca2d2a23c9947ede21f6eab3";
      res.locals.txPath =
        "users_transactions_withdrawal/sE4toJDcBIhVSZqN4SugcpWGwt82/utility/0a5ecb9e5febd56895679124c7dae1328dc42a29ca2d2a23c9947ede21f6eab3";

      return next();
    }

    let defaultError = new ErrorHandler(
      `error validating data at txPath: ${txPath}`,
      false,
      error
    );
    if (error instanceof ErrorHandler) defaultError = error;
    return Echo.HandleResponse(res, defaultError, req.originalUrl);
  }
}

export function getSupportingProvider(
  merchant: UtilityMerchant,
  service: UtilityMerchantService
) {
  const providerEntries = Object.entries(idToProviderMap) as unknown as [
    ProviderId,
    IUtilityProvider
  ][];
  const candidateProviderIds = providerEntries.reduce(
    (prev, [id, provider]) => {
      if (provider.supports(merchant, service)) prev.push(id);
      return prev;
    },
    [] as ProviderId[]
  );

  const providerId = candidateProviderIds[0] || "";

  return providerId;
}

// TODO: test only (or maybe not???)
export function getProductIdByMerchant(merchant: UtilityMerchant) {
  const merchantToProductMap: {
    [K in UtilityMerchant]: UtilityMerchantService[];
  } = {
    // Mobile
    "9mobile": [UtilityMerchantService.Airtime, UtilityMerchantService.Plan],
    glo: [UtilityMerchantService.Airtime, UtilityMerchantService.Plan],
    mtn: [UtilityMerchantService.Airtime, UtilityMerchantService.Plan],
    airtel: [UtilityMerchantService.Airtime, UtilityMerchantService.Plan],
    spectranet: [UtilityMerchantService.Plan],
    // Electricity
    abaElectric: [
      UtilityMerchantService.Prepaid,
      UtilityMerchantService.Postpaid,
    ],
    abujaElectric: [
      UtilityMerchantService.Prepaid,
      UtilityMerchantService.Postpaid,
    ],
    ekoElectric: [
      UtilityMerchantService.Prepaid,
      UtilityMerchantService.Postpaid,
    ],
    ikejaElectric: [
      UtilityMerchantService.Prepaid,
      UtilityMerchantService.Postpaid,
    ],
    kadunaElectric: [
      UtilityMerchantService.Prepaid,
      UtilityMerchantService.Postpaid,
    ],
    // Bet
    bet9ja: [UtilityMerchantService.Default],
    betking: [UtilityMerchantService.Default],
    betway: [UtilityMerchantService.Default],
    nairabet: [UtilityMerchantService.Default],
    sportybet: [UtilityMerchantService.Default],
    // Cable TV
    dstv: [UtilityMerchantService.Plan],
    gotv: [UtilityMerchantService.Plan],
    startimes: [UtilityMerchantService.Plan],
  };

  return selectRandom(merchantToProductMap[merchant]);
}
