import Validator, { Rules } from "validatorjs";

import { isRulesInterface } from "../../interface/rules/rules_interface";
import isFirestoreStringArrayField from "../../helpers/rules/isFirestoreStringArrayField";
import isFirestoreIntegerField from "../../helpers/rules/isFirestoreIntegerField";
import isFirestoreStringField from "../../helpers/rules/isFirestoreStringField";
import isFirestoreMapField from "../../helpers/rules/isFirestoreMapField";
import isProviderId from "../../helpers/rules/isProviderId";
import isAppTxStatus from "../../helpers/rules/isAppTxStatus";

export default abstract class Schema<DataType> {
  constructor(public data: DataType) {
    // Set custom rules
    this.setCustomRules(isFirestoreStringArrayField);
    this.setCustomRules(isFirestoreIntegerField);
    this.setCustomRules(isFirestoreStringField);
    this.setCustomRules(isFirestoreMapField);
    this.setCustomRules(isProviderId);
    this.setCustomRules(isAppTxStatus);
  }

  abstract rules(): Rules;

  validate(): boolean {
    const schema = new Validator(this.data, this.rules());
    if (schema.passes()) return true;
    else throw schema.errors;
  }

  setCustomRules(customRule: isRulesInterface) {
    Validator.register(
      customRule.id,
      customRule.validator,
      customRule.errorMessage
    );
  }
}
