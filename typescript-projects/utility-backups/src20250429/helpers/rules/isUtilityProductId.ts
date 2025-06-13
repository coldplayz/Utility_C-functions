import { FieldValue } from "firebase-admin/firestore";
import { isRulesInterface } from "../../interface/rules/rules_interface";
import { UtilityProduct } from "../../interface/types";

class IsUtilityProductId {
  rule: isRulesInterface;

  constructor() {
    this.rule = {
      id: "isUtilityProductId",
      errorMessage: `:attribute must be one of ${Object.values(
        UtilityProduct
      )}`,
      validator: this.validator.bind(this),
    };
  }

  /** Validator method to check if the value is a valid Firestore number set field */
  validator(value: unknown): boolean {
    const isValid =
      Object.values(UtilityProduct).includes(value as UtilityProduct) ||
      value instanceof FieldValue;

    return isValid;
  }
}

export default new IsUtilityProductId().rule;
