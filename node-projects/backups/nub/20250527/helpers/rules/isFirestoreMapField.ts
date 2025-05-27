import { isRulesInterface } from "../../interface/rules/rules_interface";
import { isObject } from "../@isType";

class IsFirestoreMapField {
  rule: isRulesInterface;

  constructor() {
    this.rule = {
      id: "isFirestoreMapField",
      errorMessage: `:attribute must be a map/object)`,
      validator: this.validator.bind(this),
    };
  }

  /** Validator method to check if the value is a valid Firestore number set field */
  validator(value: unknown): boolean {
    const isValid = isObject(value);

    return isValid;
  }
}

export default new IsFirestoreMapField().rule;
