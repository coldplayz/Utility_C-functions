import ErrorHandler from "../../errors/errManager";
import { logger } from "../../helpers/@logger";
import selectRandom from "../../helpers/@selectRandom";
import {
  AppTxStatus,
  IUtilityProvider,
  ProviderTxStatus,
  TPaymentData,
  TStatusData,
  UtilityMerchant,
  UtilityProduct,
} from "../../interface/types";

export class ProviderX implements IUtilityProvider {
  constructor() {}

  async [UtilityProduct.Airtime](_: TPaymentData, txPath: string) {
    // TODO: implementation

    return {
      initialStatus: selectRandom(Object.values(ProviderTxStatus)),
      statusUpdateMethods: {
        isWebhook: selectRandom([true, false]),
        isRequery: selectRandom([true, false]),
      },
      txRef: this.txpathToTxref(txPath),
    };
  }

  async [UtilityProduct.Default](_: TPaymentData, txPath: string) {
    // TODO: implementation

    return {
      initialStatus: selectRandom(Object.values(ProviderTxStatus)),
      statusUpdateMethods: {
        isWebhook: selectRandom([true, false]),
        isRequery: selectRandom([true, false]),
      },
      txRef: this.txpathToTxref(txPath),
    };
  }

  async [UtilityProduct.Plan](_: TPaymentData, txPath: string) {
    // TODO: implementation

    return {
      initialStatus: selectRandom(Object.values(ProviderTxStatus)),
      statusUpdateMethods: {
        isWebhook: selectRandom([true, false]),
        isRequery: selectRandom([true, false]),
      },
      txRef: this.txpathToTxref(txPath),
    };
  }

  async [UtilityProduct.Postpaid](_: TPaymentData, txPath: string) {
    // TODO: implementation

    return {
      initialStatus: selectRandom(Object.values(ProviderTxStatus)),
      statusUpdateMethods: {
        isWebhook: selectRandom([true, false]),
        isRequery: selectRandom([true, false]),
      },
      txRef: this.txpathToTxref(txPath),
    };
  }

  async [UtilityProduct.Prepaid](_: TPaymentData, txPath: string) {
    // TODO: implementation

    return {
      initialStatus: selectRandom(Object.values(ProviderTxStatus)),
      statusUpdateMethods: {
        isWebhook: selectRandom([true, false]),
        isRequery: selectRandom([true, false]),
      },
      txRef: this.txpathToTxref(txPath),
    };
  }

  async checkStatus(
    statusData: TStatusData,
    _reqBody: Record<string, unknown>
  ) {
    // TODO: implementation
    // TODO: if reqBody is webhook data, validate

    const ref = statusData.reference;
    if (!ref)
      throw new ErrorHandler("Request reference is missing", false, {
        source: this.checkStatus.name,
      });

    return {
      status: selectRandom(Object.values(AppTxStatus)),
      txPath: this.txrefToTxpath(ref),
    };
  }

  txpathToTxref(txPath: string) {
    // TODO: implementation
    logger.error(`Not yet implemented`, {
      class: this.constructor.name,
      method: this.txpathToTxref.name,
    });
    return txPath.replace(/\//g, "---");
  }

  txrefToTxpath(txRef: string) {
    // TODO: implementation
    logger.error(`Not yet implemented`, {
      class: this.constructor.name,
      method: this.txrefToTxpath.name,
    });
    return txRef.replace(/---/g, "/");
  }

  supports(merchant: UtilityMerchant, service: UtilityProduct): boolean {
    const merchantProducts = this.appToProviderProductMap[merchant];
    const productId = service as keyof typeof merchantProducts;

    return !!merchantProducts[productId];
  }

  appToProviderProductMap = {
    // Electricity
    [UtilityMerchant.AbaElectric]: {
      [UtilityProduct.Postpaid]: "providerXabaelectricpostpaid",
      [UtilityProduct.Prepaid]: "providerXabaelectricprepaid",
    },
    [UtilityMerchant.AbujaElectric]: {
      [UtilityProduct.Postpaid]: "providerXabujaelectricpostpaid",
      [UtilityProduct.Prepaid]: "providerXabujaelectricprepaid",
    },
    [UtilityMerchant.EkoElectric]: {
      [UtilityProduct.Postpaid]: "providerXekoelectricpostpaid",
      [UtilityProduct.Prepaid]: "providerXekoelectricprepaid",
    },
    [UtilityMerchant.IkejaElectric]: {
      [UtilityProduct.Postpaid]: "providerXikejaelectricpostpaid",
      [UtilityProduct.Prepaid]: "providerXikejaelectricprepaid",
    },
    [UtilityMerchant.KadunaElectric]: {
      [UtilityProduct.Postpaid]: "providerXkadunaelectricpostpaid",
      [UtilityProduct.Prepaid]: "providerXkadunaelectricprepaid",
    },
    // Mobile
    [UtilityMerchant.Airtel]: {
      [UtilityProduct.Airtime]: "providerXairtelairtime",
      [UtilityProduct.Plan]: "providerXairtelplan",
    },
    [UtilityMerchant.Glo]: {
      [UtilityProduct.Airtime]: "providerXgloairtime",
      [UtilityProduct.Plan]: "providerXgloplan",
    },
    [UtilityMerchant.Mtn]: {
      [UtilityProduct.Airtime]: "providerXmtnairtime",
      [UtilityProduct.Plan]: "providerXmtnplan",
    },
    [UtilityMerchant.NineMobile]: {
      [UtilityProduct.Airtime]: "providerX9mobileairtime",
      [UtilityProduct.Plan]: "providerX9mobileplan",
    },
    [UtilityMerchant.Spectranet]: {
      [UtilityProduct.Plan]: "providerXspectranetplan",
    },
    // Bet
    [UtilityMerchant.Bet9ja]: {
      [UtilityProduct.Default]: "providerXbet9jadefault",
    },
    [UtilityMerchant.Betking]: {
      [UtilityProduct.Default]: "providerXbetkingdefault",
    },
    [UtilityMerchant.Betway]: {
      [UtilityProduct.Default]: "providerXbetwaydefault",
    },
    [UtilityMerchant.Nairabet]: {
      [UtilityProduct.Default]: "providerXnairabetdefault",
    },
    [UtilityMerchant.Sportybet]: {
      [UtilityProduct.Default]: "providerXsportybetdefault",
    },
    // Cable TV
    [UtilityMerchant.Dstv]: {
      [UtilityProduct.Plan]: "providerXdstvplan",
    },
    [UtilityMerchant.Gotv]: {
      [UtilityProduct.Plan]: "providerXgotvplan",
    },
    [UtilityMerchant.Startimes]: {
      [UtilityProduct.Plan]: "providerXstartimesplan",
    },
  };

  appToProviderMerchantMap = {
    // Mobile
    mtn: "providerXmerchantmtn",
    airtel: "providerXmerchantairtel",
    glo: "providerXmerchantglo",
    "9mobile": "providerXmerchant9mobile",
    spectranet: "providerXmerchantspectranet",
    // Electricity
    ikejaElectric: "providerXmerchantikejaelectric",
    abujaElectric: "providerXmerchantabujaelectric",
    ekoElectric: "providerXmerchantekoelectric",
    kadunaElectric: "providerXmerchantkadunaelectric",
    abaElectric: "providerXmerchantabaelectric",
    // Cable TV
    dstv: "providerXmerchantdstv",
    gotv: "providerXmerchantgotv",
    startimes: "providerXmerchantstartimes",
    // Bet
    betking: "providerXmerchantbetking",
    bet9ja: "providerXmerchantbet9ja",
    betway: "providerXmerchantbetway",
    sportybet: "providerXmerchantsportybet",
    nairabet: "providerXmerchantnairabet",
  };
}

// type WebhookData = { [K: string]: unknown };
// const webhookDataValidatorRule: {
//   [k in keyof WebhookData]: string;
// } = {}; // TODO: actual data validation
// const webhookDataValidator = new ObjectValidator(webhookDataValidatorRule);

const providerX = new ProviderX();
Object.freeze(providerX);
export default providerX;
