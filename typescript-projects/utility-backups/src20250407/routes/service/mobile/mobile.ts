import { Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
import ObjectValidator from "../../../helpers/@objectValidator";

type ServiceInputData =
  | AirtimeProcessInputData
  | InternetProcessInputData
  | AirtimeStatusInputData
  | InternetStatusInputData;

export default class Mobile {
  input;

  constructor(input: ServiceInputData) {
    this.input = input;
  }

  validateAirtimeProcessInput() {
    if (!airtimeProcessValidator.validate(this.input))
      throw new ErrorHandler("airtime process input validation error", false, {
        reason: airtimeProcessValidator.response,
        service: this.constructor.name,
      });
  }

  validateInternetProcessInput() {
    if (!internetProcessValidator.validate(this.input))
      throw new ErrorHandler("internet process input validation error", false, {
        reason: internetProcessValidator.response,
        service: this.constructor.name,
      });
  }

  validateAirtimeStatusInput() {
    if (!airtimeStatusValidator.validate(this.input))
      throw new ErrorHandler("airtime status input validation error", false, {
        reason: airtimeStatusValidator.response,
        service: this.constructor.name,
      });
  }

  validateInternetStatusInput() {
    if (!internetStatusValidator.validate(this.input))
      throw new ErrorHandler("internet status input validation error", false, {
        reason: internetStatusValidator.response,
        service: this.constructor.name,
      });
  }

  async processAirtime(res: Response) {
    try {
      this.validateAirtimeProcessInput();

      // TODO: utility payment
      // TODO: necessary business logic

      return Echo.HandleResponse(
        res,
        "Airtime request processing...",
        this.input.originalUrl
      );
    } catch (error) {
      let defaultError = new ErrorHandler("error", false, error); // TODO: error message
      if (error instanceof ErrorHandler) defaultError = error;
      return Echo.HandleResponse(res, defaultError, this.input.originalUrl);
    }
  }

  async processInternet(res: Response) {
    try {
      this.validateInternetProcessInput();

      // TODO: utility payment
      // TODO: necessary business logic

      return Echo.HandleResponse(
        res,
        "Airtime request processing...",
        this.input.originalUrl
      );
    } catch (error) {
      let defaultError = new ErrorHandler("error", false, error); // TODO: error message
      if (error instanceof ErrorHandler) defaultError = error;
      return Echo.HandleResponse(res, defaultError, this.input.originalUrl);
    }
  }

  async statusAirtime(res: Response) {
    try {
      this.validateAirtimeStatusInput();

      // TODO: utility payment status check
      // TODO: necessary business logic

      return Echo.HandleResponse(
        res,
        "Airtime request processing...",
        this.input.originalUrl
      );
    } catch (error) {
      let defaultError = new ErrorHandler("error", false, error); // TODO: error message
      if (error instanceof ErrorHandler) defaultError = error;
      return Echo.HandleResponse(res, defaultError, this.input.originalUrl);
    }
  }

  async statusInternet(res: Response) {
    try {
      this.validateInternetStatusInput();

      // TODO: utility payment status check
      // TODO: necessary business logic

      return Echo.HandleResponse(
        res,
        "Airtime request processing...",
        this.input.originalUrl
      );
    } catch (error) {
      let defaultError = new ErrorHandler("error", false, error); // TODO: error message
      if (error instanceof ErrorHandler) defaultError = error;
      return Echo.HandleResponse(res, defaultError, this.input.originalUrl);
    }
  }
}

type AirtimeProcessInputData = { originalUrl: string; key: unknown };
const airtimeProcessValidatorRule: {
  [k in keyof AirtimeProcessInputData]: string;
} = {
  originalUrl: "required|string",
  key: "required",
};
const airtimeProcessValidator = new ObjectValidator(
  airtimeProcessValidatorRule
);

type InternetProcessInputData = { originalUrl: string; key: unknown };
const internetProcessValidatorRule: {
  [k in keyof InternetProcessInputData]: string;
} = {
  originalUrl: "required|string",
  key: "required",
};
const internetProcessValidator = new ObjectValidator(
  internetProcessValidatorRule
);

type AirtimeStatusInputData = { originalUrl: string; key: unknown };
const airtimeStatusValidatorRule: {
  [k in keyof AirtimeStatusInputData]: string;
} = {
  originalUrl: "required|string",
  key: "required",
};
const airtimeStatusValidator = new ObjectValidator(airtimeStatusValidatorRule);

type InternetStatusInputData = { originalUrl: string; key: unknown };
const internetStatusValidatorRule: {
  [k in keyof InternetStatusInputData]: string;
} = {
  originalUrl: "required|string",
  key: "required",
};
const internetStatusValidator = new ObjectValidator(
  internetStatusValidatorRule
);
