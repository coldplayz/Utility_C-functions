import selectRandom from "../../helpers/@selectRandom";
import { ProviderId, ProviderTxStatus } from "../../interface/types";
import BaseProvider from "./providerBaseApi";

export class Ebills extends BaseProvider {
  id = ProviderId.Ebills;

  async airtime(
    _phoneNumber: string,
    _amount: number,
    _providerId: string
  ): Promise<ProviderTxStatus> {
    return selectRandom(Object.values(ProviderTxStatus));
  }

  async internet(
    _phoneNumber: string,
    _amount: number,
    _providerId: string,
    _planCode: string
  ): Promise<ProviderTxStatus> {
    return selectRandom(Object.values(ProviderTxStatus));
  }

  async cableTV(
    _smartCardNumber: string,
    _amount: number,
    _providerId: string,
    _planCode: string,
    _type: string
  ): Promise<ProviderTxStatus> {
    return selectRandom(Object.values(ProviderTxStatus));
  }

  async postpaid(
    _meterNumber: string,
    _amount: number,
    _providerId: string
  ): Promise<ProviderTxStatus> {
    return selectRandom(Object.values(ProviderTxStatus));
  }

  async prepaid(
    _meterNumber: string,
    _amount: number,
    _providerId: string
  ): Promise<ProviderTxStatus> {
    return selectRandom(Object.values(ProviderTxStatus));
  }

  async bet(
    _accountId: string,
    _amount: number,
    _providerId: string
  ): Promise<ProviderTxStatus> {
    return selectRandom(Object.values(ProviderTxStatus));
  }
}

const ebills = new Ebills();
Object.freeze(ebills);
export default ebills;
