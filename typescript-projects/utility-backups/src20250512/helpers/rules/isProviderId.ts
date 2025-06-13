import { FieldValue } from "firebase-admin/firestore";
import { isRulesInterface } from "../../interface/rules/rules_interface";
import { ProviderId } from "../../interface/enums";

class IsProviderId {
  rule: isRulesInterface;

  constructor() {
    this.rule = {
      id: "isProviderId",
      errorMessage: `:attribute must be one of ${Object.values(ProviderId)}`,
      validator: this.validator.bind(this),
    };
  }

  /** Validator method to check if the value is a valid Firestore number set field */
  validator(value: unknown): boolean {
    const isValid =
      Object.values(ProviderId).includes(value as ProviderId) ||
      value instanceof FieldValue;

    return isValid;
  }
}

export default new IsProviderId().rule;
