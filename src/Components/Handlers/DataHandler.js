export function getKeyByValue(jsonObject, value) {
    let lookUpKey = "";

    Object.keys(jsonObject).forEach((key) => {
        if(key === value) {
            lookUpKey = key;
        } else if(Array.isArray(key)) {
            if(isValueInArray(jsonObject[key], value)) {
                lookUpKey = key;
            }
        } else if(JSON.constructor === jsonObject.constructor) {
            const keyInObject = getKeyByValue(jsonObject[key], value);
            if(keyInObject !== "") {
                lookUpKey = key;
            }
        }
    })

    return lookUpKey;
}

}