import {isRulesInterface} from "../../interface/rules/rules_interface";

class isNull {
    rule: isRulesInterface;

    constructor() {
        this.rule = {
            id: "isNull",
            errorMessage: "invalid null field",
            validator: this.validator.bind(this)
        };
    }

    // Validator method to check if the token is a valid JWT
    validator(value: any): boolean {
        if (value !== null) return false;
        else return true;
    }
}

export default new isNull().rule;

