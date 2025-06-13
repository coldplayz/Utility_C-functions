import { FieldValue } from "firebase-admin/firestore";
import { isRulesInterface } from "../../interface/rules/rules_interface";

class IsFirestoreArrayField {
  rule: isRulesInterface;

  constructor() {
    this.rule = {
      id: "isFirestoreStringArrayField",
      errorMessage: `:attribute must be an array or FieldValue)`,
      validator: this.validator.bind(this),
    };
  }

  /** Validator method to check if the value is a valid Firestore string array */
  validator(value: unknown): boolean {
    const isValid =
      (Array.isArray(value) && value.every((v) => typeof v === "string")) ||
      value instanceof FieldValue;

    return isValid;
  }
}

export default new IsFirestoreArrayField().rule;
