import { isRulesInterface } from "../../interface/rules/rules_interface";
import jwt from "jsonwebtoken";

class isJWT {
    rule: isRulesInterface;

    constructor() {
        this.rule = {
            id: "isJWT",
            errorMessage: "must be a valid JWT",
            validator: this.validator.bind(this)
        };
    }

    // Validator method to check if the token is a valid JWT
    validator(token: any): boolean {
        if (typeof token !== 'string') return false;

        const parts = token.split('.');

        // A valid JWT should have exactly three parts
        if (parts.length !== 3) return false;

        try {
            const decoded = jwt.decode(token, { complete: true });
            if (decoded?.header && decoded?.payload) return true;
            else return false;
        } catch (error) {
            return false;
        }
    }
}

export default new isJWT().rule;
