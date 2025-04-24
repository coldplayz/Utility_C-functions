import { FieldValue } from "firebase-admin/firestore";
import { isRulesInterface } from "../../interface/rules/rules_interface";
import { AppTxStatus } from "../../interface/types";

class IsAppTxStatus {
  rule: isRulesInterface;

  constructor() {
    this.rule = {
      id: "isAppTxStatus",
      errorMessage: `:attribute must be one of ${Object.values(AppTxStatus)}`,
      validator: this.validator.bind(this),
    };
  }

  /** Validator method to check if the value is a valid Firestore number set field */
  validator(value: unknown): boolean {
    const isValid =
      Object.values(AppTxStatus).includes(value as AppTxStatus) ||
      value instanceof FieldValue;

    return isValid;
  }
}

export default new IsAppTxStatus().rule;
