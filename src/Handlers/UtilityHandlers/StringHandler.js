import { ERROR_INVALID_CHARACTER } from "../../../Utils/Errors";

/**
 * Receives a string and returns the same string with it's first letter upper cased.
 * 
 * @param {String} upperCaseString
 */
export function upperCaseFirstLetter(upperCaseString) {
    const firstLetter = upperCaseString.charAt(0).toUpperCase();

    return firstLetter + upperCaseString.substring(1)
}

/**
 * Checks if string's characthers are alphanumeric only, if true returns namespace, else throws error.
 * 
 * @param {String} nameSpace
 */
export function validateNameSpace(nameSpace) {
    if(!(/^[a-z0-9]+$/i.test(nameSpace))) {
        throw ERROR_INVALID_CHARACTER;
    } else {
        return nameSpace;
    }
}