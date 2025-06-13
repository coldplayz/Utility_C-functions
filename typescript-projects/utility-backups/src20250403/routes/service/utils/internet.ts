/**
 * Handles internet utility service.
 */

import ErrorHandler from "../../../errors/errManager";
import { IUtilityProvider, IUtilityService } from "../../../interface/types";
import provider from "./providers/_provider";

export class Internet implements IUtilityService {
  constructor(public provider: IUtilityProvider) {}

  async pay() {
    // TODO: implement
    try {
      await this.provider.payInternet();
      return "Internet request processing...";
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error); // TODO: error message
    }
  }

  async onSuccess() {
    // TODO: implement
    try {
      return "Internet data request approved!";
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error); // TODO: error message
    }
  }

  async onFailure() {
    // TODO: implement
    try {
      return "Internet data request reversed!";
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error); // TODO: error message
    }
  }
}

const internet = new Internet(provider);
export default internet;
