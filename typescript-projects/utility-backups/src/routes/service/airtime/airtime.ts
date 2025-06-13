/**
 * Handles airtime utility service.
 */

import ErrorHandler from "../../../errors/errManager";
import { IUitilityProvider } from "../../../interface/types";
import Provider from "./_provider";

export class Airtime {
  constructor(public provider: IUitilityProvider) {}

  async pay() {
    // TODO: implement
    try {
      await this.provider.payAirtime();
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error); // TODO: error message
    }
  }
}

const airtime = new Airtime(new Provider());
export default airtime;
