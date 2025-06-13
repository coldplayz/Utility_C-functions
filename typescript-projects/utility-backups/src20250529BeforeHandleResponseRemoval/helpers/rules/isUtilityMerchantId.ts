import { FieldValue } from "firebase-admin/firestore";
import { isRulesInterface } from "../../interface/rules/rules_interface";
import { UtilityMerchant } from "../../interface/enums";

class IsUtilityMerchantId {
  rule: isRulesInterface;

  constructor() {
    this.rule = {
      id: "isUtilityMerchantId",
      errorMessage: `:attribute must be one of ${Object.values(
        UtilityMerchant
      )}`,
      validator: this.validator.bind(this),
    };
  }

  /** Validator method to check if the value is a valid Firestore number set field */
  validator(value: unknown): boolean {
    const isValid =
      Object.values(UtilityMerchant).includes(value as UtilityMerchant) ||
      value instanceof FieldValue;

    return isValid;
  }
}

export default new IsUtilityMerchantId().rule;
