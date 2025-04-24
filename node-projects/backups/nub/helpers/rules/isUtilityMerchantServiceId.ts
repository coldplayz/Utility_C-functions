import { FieldValue } from "firebase-admin/firestore";
import { isRulesInterface } from "../../interface/rules/rules_interface";
import { UtilityMerchantService } from "../../interface/types";

class IsUtilityMerchantServiceId {
  rule: isRulesInterface;

  constructor() {
    this.rule = {
      id: "isUtilityId",
      errorMessage: `:attribute must be one of ${Object.values(
        UtilityMerchantService
      )}`,
      validator: this.validator.bind(this),
    };
  }

  /** Validator method to check if the value is a valid Firestore number set field */
  validator(value: unknown): boolean {
    const isValid =
      Object.values(UtilityMerchantService).includes(
        value as UtilityMerchantService
      ) || value instanceof FieldValue;

    return isValid;
  }
}

export default new IsUtilityMerchantServiceId().rule;
