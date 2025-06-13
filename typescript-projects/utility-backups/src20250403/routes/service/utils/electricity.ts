/**
 * Handles electricity utility service.
 */

import ErrorHandler from "../../../errors/errManager";
import { IUtilityProvider, IUtilityService } from "../../../interface/types";
import provider from "./providers/_provider";

export class Electricity implements IUtilityService {
  constructor(public provider: IUtilityProvider) {}

  async pay() {
    // TODO: implement
    try {
      await this.provider.payElectricity();
      return "Electricity request processing...";
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error); // TODO: error message
    }
  }

  async onSuccess() {
    // TODO: implement
    try {
      return "Electricity request approved!";
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error); // TODO: error message
    }
  }

  async onFailure() {
    // TODO: implement
    try {
      return "Electricity request reversed!";
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error); // TODO: error message
    }
  }
}

const electricity = new Electricity(provider);
export default electricity;
