import { ERROR_INVALID_CHARACTER } from "../../Utils/Errors";

/**
 * Receives a string and returns the same string with it's first letter upper cased.
 * 
 * @param {string} toUpperCaseString
 * 
 * @return {string} upperCasedString
 */
export function upperCaseFirstLetter(toUpperCaseString) {
    const firstLetter = toUpperCaseString.charAt(0).toUpperCase();

    return firstLetter + toUpperCaseString.substring(1)
}

/**
 * Checks if string's characthers are alphanumeric only, if true returns namespace, else throws error.
 * 
 * @param {string} nameSpace
 * 
 * @return {string} nameSpace
 */
export function validateNameSpace(nameSpace) {
    if(!(/^[a-z0-9]+$/i.test(nameSpace))) {
        throw ERROR_INVALID_CHARACTER;
    } else {
        return nameSpace;
    }
}
