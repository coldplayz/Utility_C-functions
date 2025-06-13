/**
 * Handles bet utility service.
 */

import ErrorHandler from "../../../errors/errManager";
import { IUtilityProvider, IUtilityService } from "../../../interface/types";
import provider from "./providers/_provider";

export class Bet implements IUtilityService {
  constructor(public provider: IUtilityProvider) {}

  async pay() {
    // TODO: implement
    try {
      await this.provider.payBet();
      return "Bet request processing...";
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error); // TODO: error message
    }
  }

  async onSuccess() {
    // TODO: implement
    try {
      return "Bet request approved!";
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error); // TODO: error message
    }
  }

  async onFailure() {
    // TODO: implement
    try {
      return "Bet request reversed!";
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error); // TODO: error message
    }
  }
}

const bet = new Bet(provider);
export default bet;
