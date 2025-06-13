 // Checks if a string is empty or contains only whitespace and returns false if otherwise.
function isEmptyString(str: string | null | undefined): boolean {
    return !str || /^\s*$/.test(str);
}

// Checks if a string is a valid JSON, and returns false if its not
function isJson(str: string): boolean {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// Checks if an object is a plain JavaScript object (not a function or an array) and returns false if its not
function isObject(obj: any): obj is Record<string, unknown> {
    // Exclude functions and arrays
    if (typeof obj === 'function' || Array.isArray(obj)) return false;
    return obj instanceof Object;
}

export { isEmptyString, isJson, isObject };
