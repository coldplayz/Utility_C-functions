import { FieldValue } from "firebase-admin/firestore";
import { isRulesInterface } from "../../interface/rules/rules_interface";

class IsFirestoreStringField {
  rule: isRulesInterface;

  constructor() {
    this.rule = {
      id: "isFirestoreStringField",
      errorMessage: `:attribute must be a string or FieldValue`,
      validator: this.validator.bind(this),
    };
  }

  /** Validator method to check if the value is a valid Firestore number set field */
  validator(value: unknown): boolean {
    const isValid = typeof value === "string" || value instanceof FieldValue;

    return isValid;
  }
}

export default new IsFirestoreStringField().rule;
