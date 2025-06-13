import { Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import ObjectValidator from "../../../helpers/@objectValidator";

type ServiceInputData = BetProcessInputData | BetStatusInputData;

export default class Bet {
  input;

  constructor(input: ServiceInputData) {
    this.input = input;
  }

  validateBetProcessInput() {
    if (!betProcessValidator.validate(this.input))
      throw new ErrorHandler("bet proc input validation error", false, {
        reason: betProcessValidator.response,
        service: this.constructor.name,
      });
  }

  validateBetStatusInput() {
    if (!betStatusValidator.validate(this.input))
      throw new ErrorHandler("bet stat input validation error", false, {
        reason: betStatusValidator.response,
        service: this.constructor.name,
      });
  }

  async processBet(res: Response) {
    try {
      this.validateBetProcessInput();

      // TODO: utility payment
      // TODO: necessary business logic

      return Echo.HandleResponse(
        res,
        "Bet request processing...",
        this.input.originalUrl
      );
    } catch (error) {
      let defaultError = new ErrorHandler("error", false, error); // TODO: error message
      if (error instanceof ErrorHandler) defaultError = error;
      return Echo.HandleResponse(res, defaultError, this.input.originalUrl);
    }
  }

  async statusBet(res: Response) {
    try {
      this.validateBetStatusInput();

      // TODO: utility payment status check
      // TODO: necessary business logic

      return Echo.HandleResponse(
        res,
        "Bet request approved!",
        this.input.originalUrl
      );
    } catch (error) {
      let defaultError = new ErrorHandler("error", false, error); // TODO: error message
      if (error instanceof ErrorHandler) defaultError = error;
      return Echo.HandleResponse(res, defaultError, this.input.originalUrl);
    }
  }
}

type BetProcessInputData = { originalUrl: string; key: unknown };
const betProcessValidatorRule: {
  [k in keyof BetProcessInputData]: string;
} = {
  originalUrl: "required|string",
  key: "required",
};
const betProcessValidator = new ObjectValidator(betProcessValidatorRule);

type BetStatusInputData = { originalUrl: string; key: unknown };
const betStatusValidatorRule: {
  [k in keyof BetStatusInputData]: string;
} = {
  originalUrl: "required|string",
  key: "required",
};
const betStatusValidator = new ObjectValidator(betStatusValidatorRule);
