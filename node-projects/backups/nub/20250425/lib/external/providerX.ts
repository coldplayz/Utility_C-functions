import { logger } from "../../helpers/@logger";
import selectRandom from "../../helpers/@selectRandom";
import {
  AppTxStatus,
  IUtilityProvider,
  ProviderTxStatus,
  TStatusQuery,
  UtilityMerchant,
  UtilityProduct,
} from "../../interface/types";

export class ProviderX implements IUtilityProvider {
  constructor() {}

  async [UtilityProduct.Airtime]() {
    // TODO: implementation

    return {
      initialStatus: selectRandom(Object.values(ProviderTxStatus)),
      statusUpdateMethods: {
        isPushToApp: selectRandom([true, false]),
        isPullFromProvider: selectRandom([true, false]),
      },
    };
  }

  async [UtilityProduct.Default]() {
    // TODO: implementation

    return {
      initialStatus: selectRandom(Object.values(ProviderTxStatus)),
      statusUpdateMethods: {
        isPushToApp: selectRandom([true, false]),
        isPullFromProvider: selectRandom([true, false]),
      },
    };
  }

  async [UtilityProduct.Plan]() {
    // TODO: implementation

    return {
      initialStatus: selectRandom(Object.values(ProviderTxStatus)),
      statusUpdateMethods: {
        isPushToApp: selectRandom([true, false]),
        isPullFromProvider: selectRandom([true, false]),
      },
    };
  }

  async [UtilityProduct.Postpaid]() {
    // TODO: implementation

    return {
      initialStatus: selectRandom(Object.values(ProviderTxStatus)),
      statusUpdateMethods: {
        isPushToApp: selectRandom([true, false]),
        isPullFromProvider: selectRandom([true, false]),
      },
    };
  }

  async [UtilityProduct.Prepaid]() {
    // TODO: implementation

    return {
      initialStatus: selectRandom(Object.values(ProviderTxStatus)),
      statusUpdateMethods: {
        isPushToApp: selectRandom([true, false]),
        isPullFromProvider: selectRandom([true, false]),
      },
    };
  }

  async checkStatus(reqQuery: TStatusQuery, _reqBody: Record<string, unknown>) {
    // TODO: implementation
    // TODO: if reqBody is webhook data, validate

    return {
      status: selectRandom(Object.values(AppTxStatus)),
      txPath: reqQuery.txPath,
    };
  }

  txpathToTxref(txPath: string) {
    // TODO: implementation
    logger.error(`Not yet implemented`, {
      class: this.constructor.name,
      method: this.txpathToTxref.name,
    });
    return txPath;
  }

  txrefToTxpath(txRef: string) {
    // TODO: implementation
    logger.error(`Not yet implemented`, {
      class: this.constructor.name,
      method: this.txrefToTxpath.name,
    });
    return txRef;
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
