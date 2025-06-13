/**
 * TODO: add note
 */

import ErrorHandler from "../../errors/errManager";
import ObjectValidator from "../../helpers/@objectValidator";
import { IUtilityProvider } from "../../interface/types";
import cableTvProviderX from "./cableTv/providers/cableTvProviderX";

type ServiceInputData = { key: unknown };

const rule: { [k in keyof ServiceInputData]: string } = { key: "required" };
const inputValidator = new ObjectValidator(rule);

export default class CableTv {
  data;
  provider: IUtilityProvider = cableTvProviderX;

  constructor(data: ServiceInputData) {
    this.data = data;
  }

  validateInput() {
    if (!inputValidator.validate(this.data))
      throw new ErrorHandler("service input validation error", false, {
        reason: inputValidator.response,
        service: this.constructor.name,
      });
  }

  async processPayment() {
    // TODO: implement
    try {
      await this.provider.pay();
      return "CableTv request processing...";
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error); // TODO: error message
    }
  }

  async processStatus() {
    // TODO: implement
    try {
      await this.provider.checkStatus();
      return "CableTv request approved!";
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error); // TODO: error message
    }
  }
}
