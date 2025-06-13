import selectRandom from "../../helpers/@selectRandom";
import {
  AppTxStatus,
  IProviderPaymentResult,
  ProviderTxStatus,
  TCheckStatusResult,
  TStatusQuery,
} from "../../interface/types";

export class ProviderX {
  constructor() {}

  async payInternet(): Promise<IProviderPaymentResult> {
    // TODO: implementation

    return {
      initialStatus: selectRandom(Object.values(ProviderTxStatus)),
      statusUpdateMethods: {
        isPushToApp: selectRandom([true, false]),
        isPullFromProvider: selectRandom([true, false]),
      },
    };
  }

  async payAirtime(): Promise<IProviderPaymentResult> {
    // TODO: implementation

    return {
      initialStatus: selectRandom(Object.values(ProviderTxStatus)),
      statusUpdateMethods: {
        isPushToApp: selectRandom([true, false]),
        isPullFromProvider: selectRandom([true, false]),
      },
    };
  }

  async payElectricity(): Promise<IProviderPaymentResult> {
    // TODO: implementation

    return {
      initialStatus: selectRandom(Object.values(ProviderTxStatus)),
      statusUpdateMethods: {
        isPushToApp: selectRandom([true, false]),
        isPullFromProvider: selectRandom([true, false]),
      },
    };
  }

  async payBet(): Promise<IProviderPaymentResult> {
    // TODO: implementation

    return {
      initialStatus: selectRandom(Object.values(ProviderTxStatus)),
      statusUpdateMethods: {
        isPushToApp: selectRandom([true, false]),
        isPullFromProvider: selectRandom([true, false]),
      },
    };
  }

  async payCableTv(): Promise<IProviderPaymentResult> {
    // TODO: implementation

    return {
      initialStatus: selectRandom(Object.values(ProviderTxStatus)),
      statusUpdateMethods: {
        isPushToApp: selectRandom([true, false]),
        isPullFromProvider: selectRandom([true, false]),
      },
    };
  }

  async checkTxStatus(
    reqQuery: TStatusQuery,
    _reqBody: Record<string, unknown>
  ): Promise<TCheckStatusResult> {
    // TODO: implementation
    // TODO: if reqBody is webhook data, validate

    return {
      status: selectRandom(Object.values(AppTxStatus)),
      txPath: reqQuery.txPath,
    };
  }

  txpathToTxref() {}
  txrefToTxpath() {}
}

// type PaymentData = { [K: string]: unknown };
// const paymentDataValidatorRule: {
//   [k in keyof PaymentData]: string;
// } = {}; // TODO: actual data validation
// const paymentDataValidator = new ObjectValidator(paymentDataValidatorRule);

const providerX = new ProviderX();
export default providerX;
