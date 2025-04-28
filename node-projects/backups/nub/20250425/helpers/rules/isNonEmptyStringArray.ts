import { isRulesInterface } from "../../interface/rules/rules_interface";

class IsNonEmptyStringArray {
  rule: isRulesInterface;

  constructor() {
    this.rule = {
      id: "isNonEmptyStringArray",
      errorMessage: `:attribute must be a non-empty string array`,
      validator: this.validator.bind(this),
    };
  }

  /** Validator method to check if the value is a valid Firestore string array */
  validator(value: unknown): boolean {
    const isValid =
      Array.isArray(value) &&
      value.length > 0 &&
      value.every((v) => typeof v === "string");

    return isValid;
  }
}

export default new IsNonEmptyStringArray().rule;
