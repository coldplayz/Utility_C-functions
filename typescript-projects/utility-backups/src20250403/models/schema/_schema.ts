import Validator, {Rules} from 'validatorjs';
import {isRulesInterface} from '../../interface/rules/rules_interface';
import isNumber from '../../helpers/rules/isNumber';

export default abstract class Schema {

    data: object

    constructor() {
        /**pass in custom rules here */
        this.setCustomRules(isNumber);
        this.data = {};
    }

    abstract rules(): Rules

    validate(): boolean {
        const schema = new Validator(this.data, this.rules());
        if (schema.passes()) return true;
        else throw schema.errors;
    }

    setCustomRules(customRule: isRulesInterface) {
        Validator.register(customRule.id, customRule.validator, customRule.errorMessage);
    }

}