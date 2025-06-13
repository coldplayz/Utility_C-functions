/**
 * Handles cable TV utility service.
 */

import ErrorHandler from "../../../errors/errManager";
import { IUtilityProvider, IUtilityService } from "../../../interface/types";
import provider from "./providers/_provider";

export class CableTv implements IUtilityService {
  constructor(public provider: IUtilityProvider) {}

  async pay() {
    // TODO: implement
    try {
      await this.provider.payCableTv();
      return "Cable TV request processing...";
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error); // TODO: error message
    }
  }

  async onSuccess() {
    // TODO: implement
    try {
      return "Cable TV request approved!";
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error); // TODO: error message
    }
  }

  async onFailure() {
    // TODO: implement
    try {
      return "Cable TV request reversed!";
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error); // TODO: error message
    }
  }
}

const cable = new CableTv(provider);
export default cable;
