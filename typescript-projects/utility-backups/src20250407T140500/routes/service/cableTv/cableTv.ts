import { Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import ObjectValidator from "../../../helpers/@objectValidator";

type ServiceInputData = CableTvProcessInputData | CableTvStatusInputData;

export default class CableTv {
  input;

  constructor(input: ServiceInputData) {
    this.input = input;
  }

  validateCableTvProcessInput() {
    if (!cableTvProcessValidator.validate(this.input))
      throw new ErrorHandler("cableTv proc input validation error", false, {
        reason: cableTvProcessValidator.response,
        service: this.constructor.name,
      });
  }

  validateCableTvStatusInput() {
    if (!cableTvStatusValidator.validate(this.input))
      throw new ErrorHandler("cableTv stat input validation error", false, {
        reason: cableTvStatusValidator.response,
        service: this.constructor.name,
      });
  }

  async processCableTv(res: Response) {
    try {
      this.validateCableTvProcessInput();

      // TODO: utility payment
      // TODO: necessary business logic

      return Echo.HandleResponse(
        res,
        "CableTv request processing...",
        this.input.originalUrl
      );
    } catch (error) {
      let defaultError = new ErrorHandler("error", false, error); // TODO: error message
      if (error instanceof ErrorHandler) defaultError = error;
      return Echo.HandleResponse(res, defaultError, this.input.originalUrl);
    }
  }

  async statusCableTv(res: Response) {
    try {
      this.validateCableTvStatusInput();

      // TODO: utility payment status check
      // TODO: necessary business logic

      return Echo.HandleResponse(
        res,
        "CableTv request approved!",
        this.input.originalUrl
      );
    } catch (error) {
      let defaultError = new ErrorHandler("error", false, error); // TODO: error message
      if (error instanceof ErrorHandler) defaultError = error;
      return Echo.HandleResponse(res, defaultError, this.input.originalUrl);
    }
  }
}

type CableTvProcessInputData = { originalUrl: string; key: unknown };
const cableTvProcessValidatorRule: {
  [k in keyof CableTvProcessInputData]: string;
} = {
  originalUrl: "required|string",
  key: "required",
};
const cableTvProcessValidator = new ObjectValidator(
  cableTvProcessValidatorRule
);

type CableTvStatusInputData = { originalUrl: string; key: unknown };
const cableTvStatusValidatorRule: {
  [k in keyof CableTvStatusInputData]: string;
} = {
  originalUrl: "required|string",
  key: "required",
};
const cableTvStatusValidator = new ObjectValidator(cableTvStatusValidatorRule);
