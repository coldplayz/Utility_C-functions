import { logger } from "../../helpers/@logger";
import selectRandom from "../../helpers/@selectRandom";
import {
  AppTxStatus,
  IUtilityProvider,
  ProviderTxStatus,
  TStatusQuery,
  UtilityMerchantService,
} from "../../interface/types";

export class ProviderX implements IUtilityProvider {
  appToProviderServiceMap = {
    airtime: "providerXairtime",
    default: "providerXdefault",
    plan: "providerXplan",
    postpaid: "providerXpostpaid",
    prepaid: "providerXprepaid",
  };

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

  supports(service: UtilityMerchantService): boolean {
    return !!this.appToProviderServiceMap[service];
  }
}

// type PaymentData = { [K: string]: unknown };
// const paymentDataValidatorRule: {
//   [k in keyof PaymentData]: string;
// } = {}; // TODO: actual data validation
// const paymentDataValidator = new ObjectValidator(paymentDataValidatorRule);

const providerX = new ProviderX();
export default providerX;
