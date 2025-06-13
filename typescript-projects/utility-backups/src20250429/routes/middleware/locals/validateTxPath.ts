/**
 * Ensures txPath points to valid document and save relevant data therefrom.
 */

import { NextFunction, Request, Response } from "express";
// import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import {
  Utility,
  UtilityMerchant,
  UtilityProduct,
  TUtilityMeta,
} from "../../../interface/types";
import selectRandom from "../../../helpers/@selectRandom";
import getUtilityTxDoc from "../../../models/get/getUtilityTxDoc";
import {
  generateRandomHex,
  generateRandomIntRange,
} from "../../../helpers/@generateRandom";

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

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Probably a test/dev request; use hard-coded data
    // TODO: test/dev only
    res.locals.utility = req.originalUrl.split("/").at(-2) as Utility;
    const merchantId = getRandomMerchant(req.originalUrl);
    const productId = getProductIdByMerchant(merchantId);
    const utilityMeta = {
      customerId: `customer_${generateRandomHex(3)}`,
      merchantId,
      productId,
      planId: generateRandomHex(8),
      amount: generateRandomIntRange(),
    } as TUtilityMeta;
    res.locals.utilityMeta = utilityMeta;

    res.locals.uid = "uid1";
    res.locals.appTxHash = "hash1";
    res.locals.nairaAdminDocPath =
      "/naira_admins/2025/April/28/transactions/hash1";
    res.locals.txPath = "users_transactions_withdrawal/uid1/utility/hash1";
    // res.locals.uid = "sE4toJDcBIhVSZqN4SugcpWGwt82";
    // res.locals.appTxHash =
    //   "0a5ecb9e5febd56895679124c7dae1328dc42a29ca2d2a23c9947ede21f6eab3";
    // res.locals.nairaAdminDocPath =
    //   "/naira_admins/2025/March/27/transactions/0a5ecb9e5febd56895679124c7dae1328dc42a29ca2d2a23c9947ede21f6eab3";
    // res.locals.txPath =
    //   "users_transactions_withdrawal/sE4toJDcBIhVSZqN4SugcpWGwt82/utility/0a5ecb9e5febd56895679124c7dae1328dc42a29ca2d2a23c9947ede21f6eab3";

    return next();

    // TODO: uncomment after testing
    // let defaultError = new ErrorHandler(
    //   `error validating data at txPath: ${txPath}`,
    //   false,
    //   error
    // );
    // if (error instanceof ErrorHandler) defaultError = error;
    // return Echo.HandleResponse(res, defaultError, req.originalUrl);
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

export function getRandomMerchant(originalUrl: string) {
  const urlParts = originalUrl.split("/");
  const utility = urlParts.at(-2);
  const utilityToMerchantMap = {
    [Utility.Bet]: [
      UtilityMerchant.Bet9ja,
      UtilityMerchant.Betking,
      UtilityMerchant.Betway,
      UtilityMerchant.Nairabet,
      UtilityMerchant.Sportybet,
    ],
    [Utility.Cable]: [
      UtilityMerchant.Dstv,
      UtilityMerchant.Gotv,
      UtilityMerchant.Startimes,
    ],
    [Utility.Electricity]: [
      UtilityMerchant.AbaElectric,
      UtilityMerchant.AbujaElectric,
      UtilityMerchant.EkoElectric,
      UtilityMerchant.IkejaElectric,
      UtilityMerchant.KadunaElectric,
    ],
    [Utility.Mobile]: [
      UtilityMerchant.Airtel,
      UtilityMerchant.Mtn,
      UtilityMerchant.NineMobile,
      UtilityMerchant.Glo,
      UtilityMerchant.Spectranet,
    ],
  };

  return selectRandom(utilityToMerchantMap[utility as Utility]);
}
