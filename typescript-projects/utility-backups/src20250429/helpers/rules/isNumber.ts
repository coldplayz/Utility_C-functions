import { isRulesInterface } from "../../interface/rules/rules_interface";


class isNumber {
    rule: isRulesInterface

    constructor() {
        this.rule = {
            id: "isNumber",
            errorMessage: "must be of type number",
            validator: this.validator.bind(this)
        };
    }
    validator(value: any): boolean {
        return value === Number(value);
    }
}

export default new isNumber().rule;