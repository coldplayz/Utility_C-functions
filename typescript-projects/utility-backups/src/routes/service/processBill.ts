/**
 * TODO: add note
 */

import ErrorHandler from "../../errors/errManager";
import ObjectValidator from "../../helpers/@objectValidator";

type ServiceInputData = { key: unknown };

const rule: { [k in keyof ServiceInputData]: string } = { key: "required" };
const inputValidator = new ObjectValidator(rule);

export default class ProcessBill {
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

  async execute() {
    try {
      this.validateInput();

      return "airtime request is processing...";
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler("error", false, error);
    }
  }
}
