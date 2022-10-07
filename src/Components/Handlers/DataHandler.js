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

export function isValueInArray(searchingArray, value) {
    searchingArray.forEach((index) => {
        if(index === value) {
            return true
        } else if(Array.isArray(index)) {
            if(isValueInArray(index, value)){
                return true;
            }
        } else if(JSON.constructor === index.constructor) {
            const key = getKeyByValue(index, value);
            if(key !== "") {
                return true;
            }
        }

        return false;
    });
}