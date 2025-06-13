/**
 * Logic for a specific provider like Paga
 */

import { IUtilityProvider, PaymentStatus } from "../../../../interface/types";

export class BetProviderX implements IUtilityProvider {
  constructor() {}

  async pay() {
    // TODO: implement
  }

  async checkStatus() {
    // TODO: implement
    return PaymentStatus.Successfull;
  }
}

const betProviderX = new BetProviderX();
export default betProviderX;
