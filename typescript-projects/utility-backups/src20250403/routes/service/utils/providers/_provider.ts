/**
 * Logic for a specific provider like Paga
 */

import { IUtilityProvider } from "../../../../interface/types";

export class Provider implements IUtilityProvider {
  constructor() {}

  async payAirtime() {
    // TODO: implement request logic
  }

  async payBet() {
    // TODO: implement request logic
  }

  async payCableTv() {
    // TODO: implement request logic
  }

  async payElectricity() {
    // TODO: implement request logic
  }

  async payInternet() {
    // TODO: implement request logic
  }
}

const provider = new Provider();
export default provider;
