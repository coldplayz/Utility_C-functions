import { FieldValue } from "firebase-admin/firestore";
import { isRulesInterface } from "../../interface/rules/rules_interface";
import { PlanType } from "../../interface/enums";

class IsPlanType {
  rule: isRulesInterface;

  constructor() {
    this.rule = {
      id: "isPlanType",
      errorMessage: `:attribute must be one of ${Object.values(PlanType)}`,
      validator: this.validator.bind(this),
    };
  }

  /** Validator method to check if the value is a valid Firestore number set field */
  validator(value: unknown): boolean {
    const isValid =
      Object.values(PlanType).includes(value as PlanType) ||
      value instanceof FieldValue;

    return isValid;
  }
}

export default new IsPlanType().rule;
