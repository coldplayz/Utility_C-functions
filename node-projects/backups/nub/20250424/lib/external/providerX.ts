import { logger } from "../../helpers/@logger";
import selectRandom from "../../helpers/@selectRandom";
import {
  AppTxStatus,
  IUtilityProvider,
  ProviderTxStatus,
  TStatusQuery,
  UtilityMerchant,
  UtilityMerchantService,
} from "../../interface/types";

export class ProviderX implements IUtilityProvider {
  constructor() {}

  async [UtilityMerchantService.Airtime]() {
    // TODO: implementation

    return {
      initialStatus: selectRandom(Object.values(ProviderTxStatus)),
      statusUpdateMethods: {
        isPushToApp: selectRandom([true, false]),
        isPullFromProvider: selectRandom([true, false]),
      },
    };
  }

  async [UtilityMerchantService.Default]() {
    // TODO: implementation

    return {
      initialStatus: selectRandom(Object.values(ProviderTxStatus)),
      statusUpdateMethods: {
        isPushToApp: selectRandom([true, false]),
        isPullFromProvider: selectRandom([true, false]),
      },
    };
  }

  async [UtilityMerchantService.Plan]() {
    // TODO: implementation

    return {
      initialStatus: selectRandom(Object.values(ProviderTxStatus)),
      statusUpdateMethods: {
        isPushToApp: selectRandom([true, false]),
        isPullFromProvider: selectRandom([true, false]),
      },
    };
  }

  async [UtilityMerchantService.Postpaid]() {
    // TODO: implementation

    return {
      initialStatus: selectRandom(Object.values(ProviderTxStatus)),
      statusUpdateMethods: {
        isPushToApp: selectRandom([true, false]),
        isPullFromProvider: selectRandom([true, false]),
      },
    };
  }

  async [UtilityMerchantService.Prepaid]() {
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

  supports(
    merchant: UtilityMerchant,
    service: UtilityMerchantService
  ): boolean {
    const merchantProducts = this.appToProviderProductMap[merchant];
    const productId = service as keyof typeof merchantProducts;

    return !!merchantProducts[productId];
  }

  appToProviderProductMap = {
    // Electricity
    [UtilityMerchant.AbaElectric]: {
      [UtilityMerchantService.Postpaid]: "providerXabaelectricpostpaid",
      [UtilityMerchantService.Prepaid]: "providerXabaelectricprepaid",
    },
    [UtilityMerchant.AbujaElectric]: {
      [UtilityMerchantService.Postpaid]: "providerXabujaelectricpostpaid",
      [UtilityMerchantService.Prepaid]: "providerXabujaelectricprepaid",
    },
    [UtilityMerchant.EkoElectric]: {
      [UtilityMerchantService.Postpaid]: "providerXekoelectricpostpaid",
      [UtilityMerchantService.Prepaid]: "providerXekoelectricprepaid",
    },
    [UtilityMerchant.IkejaElectric]: {
      [UtilityMerchantService.Postpaid]: "providerXikejaelectricpostpaid",
      [UtilityMerchantService.Prepaid]: "providerXikejaelectricprepaid",
    },
    [UtilityMerchant.KadunaElectric]: {
      [UtilityMerchantService.Postpaid]: "providerXkadunaelectricpostpaid",
      [UtilityMerchantService.Prepaid]: "providerXkadunaelectricprepaid",
    },
    // Mobile
    [UtilityMerchant.Airtel]: {
      [UtilityMerchantService.Airtime]: "providerXairtelairtime",
      [UtilityMerchantService.Plan]: "providerXairtelplan",
    },
    [UtilityMerchant.Glo]: {
      [UtilityMerchantService.Airtime]: "providerXgloairtime",
      [UtilityMerchantService.Plan]: "providerXgloplan",
    },
    [UtilityMerchant.Mtn]: {
      [UtilityMerchantService.Airtime]: "providerXmtnairtime",
      [UtilityMerchantService.Plan]: "providerXmtnplan",
    },
    [UtilityMerchant.NineMobile]: {
      [UtilityMerchantService.Airtime]: "providerX9mobileairtime",
      [UtilityMerchantService.Plan]: "providerX9mobileplan",
    },
    [UtilityMerchant.Spectranet]: {
      [UtilityMerchantService.Plan]: "providerXspectranetplan",
    },
    // Bet
    [UtilityMerchant.Bet9ja]: {
      [UtilityMerchantService.Default]: "providerXbet9jadefault",
    },
    [UtilityMerchant.Betking]: {
      [UtilityMerchantService.Default]: "providerXbetkingdefault",
    },
    [UtilityMerchant.Betway]: {
      [UtilityMerchantService.Default]: "providerXbetwaydefault",
    },
    [UtilityMerchant.Nairabet]: {
      [UtilityMerchantService.Default]: "providerXnairabetdefault",
    },
    [UtilityMerchant.Sportybet]: {
      [UtilityMerchantService.Default]: "providerXsportybetdefault",
    },
    // Cable TV
    [UtilityMerchant.Dstv]: {
      [UtilityMerchantService.Plan]: "providerXdstvplan",
    },
    [UtilityMerchant.Gotv]: {
      [UtilityMerchantService.Plan]: "providerXgotvplan",
    },
    [UtilityMerchant.Startimes]: {
      [UtilityMerchantService.Plan]: "providerXstartimesplan",
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
export default providerX;
