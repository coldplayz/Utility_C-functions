import { ProviderId, ProviderTxStatus } from "../../interface/types";

export default abstract class BaseProvider {
  abstract id: ProviderId;

  // mobile handler
  abstract airtime(
    phoneNumber: string,
    amount: number,
    providerId: string
  ): Promise<ProviderTxStatus>;
  abstract internet(
    phoneNumber: string,
    amount: number,
    providerId: string,
    planCode: string
  ): Promise<ProviderTxStatus>;

  // cable tv handler
  abstract cableTV(
    smartCardNumber: string,
    amount: number,
    providerId: string,
    planCode: string,
    type: string
  ): Promise<ProviderTxStatus>;

  // electricity handler
  abstract postpaid(
    meterNumber: string,
    amount: number,
    providerId: string
  ): Promise<ProviderTxStatus>;

  abstract prepaid(
    meterNumber: string,
    amount: number,
    providerId: string
  ): Promise<ProviderTxStatus>;

  // bet handler
  abstract bet(
    accountId: string,
    amount: number,
    providerId: string
  ): Promise<ProviderTxStatus>;
}
