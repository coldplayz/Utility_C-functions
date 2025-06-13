/**
 * TODO: add note
 */

import ErrorHandler from "../../errors/errManager";
import ObjectValidator from "../../helpers/@objectValidator";
import airtime from "./utils/airtime";
import bet from "./utils/bet";
import cable from "./utils/cableTv";
import electricity from "./utils/electricity";
import internet from "./utils/internet";

type ServiceInputData = { key: unknown };

const rule: { [k in keyof ServiceInputData]: string } = { key: "required" };
const inputValidator = new ObjectValidator(rule);

export default class ReverseBill {
  data;

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

  async airtime() {
    try {
      return airtime.onFailure();
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error);
    }
  }

  async bet() {
    try {
      return bet.onFailure();
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error);
    }
  }

  async cableTv() {
    try {
      return cable.onFailure();
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error);
    }
  }

  async electricity() {
    try {
      return electricity.onFailure();
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error);
    }
  }

  async internet() {
    try {
      return internet.onFailure();
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error);
    }
  }

  async execute() {
    try {
      this.validateInput();

      return "airtime request is reversed!";
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error);
    }
  }
}
