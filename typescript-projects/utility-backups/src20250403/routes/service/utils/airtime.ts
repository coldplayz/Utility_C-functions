/**
 * Handles airtime utility service.
 */

import ErrorHandler from "../../../errors/errManager";
import { IUtilityProvider, IUtilityService } from "../../../interface/types";
import provider from "./providers/_provider";

export class Airtime implements IUtilityService {
  constructor(public provider: IUtilityProvider) {}

  async pay() {
    // TODO: implement
    try {
      await this.provider.payAirtime();
      return "Airtime request processing...";
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error); // TODO: error message
    }
  }

  async onSuccess() {
    // TODO: implement
    try {
      return "Airtime request approved!";
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error); // TODO: error message
    }
  }

  async onFailure() {
    // TODO: implement
    try {
      return "Airtime request reversed!";
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error); // TODO: error message
    }
  }
}

const airtime = new Airtime(provider);
export default airtime;
