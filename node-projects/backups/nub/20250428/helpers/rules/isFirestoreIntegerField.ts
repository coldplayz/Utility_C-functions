import { FieldValue } from "firebase-admin/firestore";
import { isRulesInterface } from "../../interface/rules/rules_interface";

class IsFirestoreIntegerField {
  rule: isRulesInterface;

  constructor() {
    this.rule = {
      id: "isFirestoreIntegerField",
      errorMessage: `:attribute must be an integer or FieldValue)`,
      validator: this.validator.bind(this),
    };
  }

  /** Validator method to check if the value is a valid Firestore number set field */
  validator(value: unknown): boolean {
    const isValid =
      Number.isInteger(Number(value)) || value instanceof FieldValue;

    return isValid;
  }
}

export default new IsFirestoreIntegerField().rule;
