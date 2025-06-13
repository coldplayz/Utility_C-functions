/**
 * Logic for a specific provider like Paga
 */

import { IUtilityProvider, PaymentStatus } from "../../../../interface/types";

export class ElectricityProviderX implements IUtilityProvider {
  constructor() {}

  async pay() {
    // TODO: implement
  }

  async checkStatus() {
    // TODO: implement
    return PaymentStatus.Successfull;
  }
}

const electricityProviderX = new ElectricityProviderX();
export default electricityProviderX;
