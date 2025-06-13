import { Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import ObjectValidator from "../../../helpers/@objectValidator";

type ServiceInputData =
  | ElectricityProcessInputData
  | ElectricityStatusInputData;

export default class Electricity {
  input;

  constructor(input: ServiceInputData) {
    this.input = input;
  }

  validateElectricityProcessInput() {
    if (!electricityProcessValidator.validate(this.input))
      throw new ErrorHandler("electricity proc input validation error", false, {
        reason: electricityProcessValidator.response,
        service: this.constructor.name,
      });
  }

  validateElectricityStatusInput() {
    if (!electricityStatusValidator.validate(this.input))
      throw new ErrorHandler("electricity stat input validation error", false, {
        reason: electricityStatusValidator.response,
        service: this.constructor.name,
      });
  }

  async processElectricity(res: Response) {
    try {
      this.validateElectricityProcessInput();

      // TODO: utility payment
      // TODO: necessary business logic

      return Echo.HandleResponse(
        res,
        "Electricity request processing...",
        this.input.originalUrl
      );
    } catch (error) {
      let defaultError = new ErrorHandler("error", false, error); // TODO: error message
      if (error instanceof ErrorHandler) defaultError = error;
      return Echo.HandleResponse(res, defaultError, this.input.originalUrl);
    }
  }

  async statusElectricity(res: Response) {
    try {
      this.validateElectricityStatusInput();

      // TODO: utility payment status check
      // TODO: necessary business logic

      return Echo.HandleResponse(
        res,
        "Electricity request approved!",
        this.input.originalUrl
      );
    } catch (error) {
      let defaultError = new ErrorHandler("error", false, error); // TODO: error message
      if (error instanceof ErrorHandler) defaultError = error;
      return Echo.HandleResponse(res, defaultError, this.input.originalUrl);
    }
  }
}

type ElectricityProcessInputData = { originalUrl: string; key: unknown };
const electricityProcessValidatorRule: {
  [k in keyof ElectricityProcessInputData]: string;
} = {
  originalUrl: "required|string",
  key: "required",
};
const electricityProcessValidator = new ObjectValidator(
  electricityProcessValidatorRule
);

type ElectricityStatusInputData = { originalUrl: string; key: unknown };
const electricityStatusValidatorRule: {
  [k in keyof ElectricityStatusInputData]: string;
} = {
  originalUrl: "required|string",
  key: "required",
};
const electricityStatusValidator = new ObjectValidator(
  electricityStatusValidatorRule
);
