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
 * Checks if string's characthers are alphanumeric only, if not throws error.
 * 
 * @param {String} nameSpace
 */
export function validateNameSpace(nameSpace) {
    if(!(/^[a-z0-9]+$/i.test(nameSpace))) {
        throw "Nome ou tipo com carácter inválido!"
    }
}