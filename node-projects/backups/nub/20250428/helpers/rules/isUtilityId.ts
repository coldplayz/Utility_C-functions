import { FieldValue } from "firebase-admin/firestore";
import { isRulesInterface } from "../../interface/rules/rules_interface";
import { Utility } from "../../interface/types";

class IsUtilityId {
  rule: isRulesInterface;

  constructor() {
    this.rule = {
      id: "isUtilityId",
      errorMessage: `:attribute must be one of ${Object.values(Utility)}`,
      validator: this.validator.bind(this),
    };
  }

  /** Validator method to check if the value is a valid Firestore number set field */
  validator(value: unknown): boolean {
    const isValid =
      Object.values(Utility).includes(value as Utility) ||
      value instanceof FieldValue;

    return isValid;
  }
}

export default new IsUtilityId().rule;
