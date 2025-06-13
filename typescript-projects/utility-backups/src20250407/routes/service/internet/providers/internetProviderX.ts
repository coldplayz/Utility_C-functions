/**
 * Logic for a specific provider like Paga
 */

import { IUtilityProvider, PaymentStatus } from "../../../../interface/types";

export class InternetProviderX implements IUtilityProvider {
  constructor() {}

  async pay() {
    // TODO: implement
  }

  async checkStatus() {
    // TODO: implement
    return PaymentStatus.Successfull;
  }
}

const internetProviderX = new InternetProviderX();
export default internetProviderX;
