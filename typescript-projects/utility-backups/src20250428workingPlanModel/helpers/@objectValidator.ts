import Validator, { Rules } from "validatorjs";
import { isRulesInterface } from "../interface/rules/rules_interface";
import isJWT from "./rules/isJWT";
import isNumber from "./rules/isNumber";
import isNull from "./rules/isNull";
import isProviderId from "./rules/isProviderId";
import isAppTxStatus from "./rules/isAppTxStatus";
import isUtilityId from "./rules/isUtilityId";
import isUtilityMerchantId from "./rules/isUtilityMerchantId";
import isUtilityProductId from "./rules/isUtilityProductId";

/**
 * it uses validatorjs to compare provided data with expected data
 * @setRules set the expected data
 * @validate compare @expectedData with @providedData
 * message are logged to @response
 */

class ObjectValidator<DataType> {
  expectedData: Rules = {};
  response: unknown;

  constructor(rules: Rules) {
    this.createRule(isJWT);
    this.createRule(isNumber);
    this.createRule(isNull);
    this.createRule(isProviderId);
    this.createRule(isUtilityId);
    this.createRule(isUtilityMerchantId);
    this.createRule(isUtilityProductId);
    this.createRule(isAppTxStatus);
    this.setRules(rules);
  }

  // Method to set validation rules for the class
  setRules(rules: Rules): void {
    this.expectedData = rules;
  }

  // Method to validate data against the set rules
  validate(providedData: DataType): boolean {
    const input = new Validator(providedData, this.expectedData);

    if (input.passes()) {
      this.response = providedData;
      return true;
    } else {
      this.response = this.arrangeError(input.errors.errors);
      return false;
    }
  }

  // Method to arrange error messages in a specific format
  arrangeError(error: Validator.ValidationErrors): { [key: string]: string } {
    return Object.fromEntries(
      Object.entries(error).map(([key, value]) => [key, `${value}`])
    );
  }

  // Method to create a custom validation rule
  createRule(customRule: isRulesInterface): void {
    Validator.register(
      customRule.id,
      customRule.validator,
      customRule.errorMessage
    );
  }
}

export default ObjectValidator;
