/**
 * Receives a string and returns the same string with it's first letter upper cased.
 * 
 * @param {String} upperCaseString
 */
export function upperCaseFirstLetter(upperCaseString) {
    const firstLetter = upperCaseString.charAt(0).toUpperCase();

    return firstLetter + upperCaseString.substring(1)
}