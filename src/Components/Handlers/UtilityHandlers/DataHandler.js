/**
 * Returns top most key which has the searched value, the search will go deep if object contains another object within, but will use includes function on arrays.
 * 
 * If no key is found a boolean false will be returned.
 * 
 * @param {Object} object 
 * @param {String} value 
 */
export function getKeyByValue(object, value) {
    Object.keys(object).forEach((key) => {
        if(key === value) {
            return key;
        } else if(Array.isArray(key)) {
            if(object[key].includes(value)) {
                return key;
            }
        } else if(JSON.constructor === object.constructor) {
            const keyInObject = getKeyByValue(object[key], value);
            if(keyInObject) {
                return key;
            }
        }
    })

    return false
}