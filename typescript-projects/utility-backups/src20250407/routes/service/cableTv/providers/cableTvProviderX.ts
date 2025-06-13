/**
 * Logic for a specific provider like Paga
 */

import { IUtilityProvider, PaymentStatus } from "../../../../interface/types";

export class CableTvProviderX implements IUtilityProvider {
  constructor() {}

  async pay() {
    // TODO: implement
  }

  async checkStatus() {
    // TODO: implement
    return PaymentStatus.Successfull;
  }
}

const cableTvProviderX = new CableTvProviderX();
export default cableTvProviderX;
