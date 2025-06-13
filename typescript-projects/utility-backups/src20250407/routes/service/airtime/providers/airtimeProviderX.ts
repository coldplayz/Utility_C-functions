/**
 * Logic for a specific provider like Paga
 */

import { IUtilityProvider, PaymentStatus } from "../../../../interface/types";

export class AirtimeProviderX implements IUtilityProvider {
  constructor() {}

  async pay() {
    // TODO: implement
  }

  async checkStatus() {
    // TODO: implement
    return PaymentStatus.Successfull;
  }
}

const airtimeProviderX = new AirtimeProviderX();
export default airtimeProviderX;
