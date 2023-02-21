import { useTranslation } from 'react-i18next';

/**
 * Returns top most key which has the searched value, the search will go deep if object contains another object within, but will use includes function on arrays.
 * 
 * If no key is found a boolean false will be returned.
 * 
 * @param {Object} object 
 * @param {String} value 
 */
export function getKeyByValue(object, value) {
    const keys = Object.keys(object);
    
    for(let i = 0; i < keys.length; i++) {
        switch(true) {
            case keys[i] === value:
                return keys[i];

            case Array.isArray(object[keys[i]]):
                if(object[keys[i]].includes(value)) {
                    return keys[i];
                }

                break;

            case JSON.constructor === object[keys[i]].constructor:
                const keyInObject = getKeyByValue(object[keys[i]], value);

                if(keyInObject) {
                    return keys[i];
                }

                break;
            
            default:
        }
    }

    return false;
}

/**
 * Returns the index of a arguments array which it's last charcther is the expressed symbol, if smbol is missing a error is thrown.
 * 
 * @param {String[]} argumentsArray 
 * @param {String} endSymbol 
 */
export function GetLastArgumentIndexHandler(argumentsArray, endSymbol) {
    const lastArgument = argumentsArray.find((argument) => argument.includes(endSymbol))
    const { t } = useTranslation();
    
    if(lastArgument) {
        return argumentsArray.indexOf(lastArgument);
    } else {
        throw t("error.missing_end_pointer");
    }
}

/**
 * Receives an array of arguments with "-a" as first position, returning them properly formated for command handling.
 * 
 * @param {string[]} argumentsArray 
 * 
 * @returns {string[]} formatedAttributesArray
 */
export function attributesFormatter(argumentsArray) {
    const formatedAttributesArray = [];
    
    for(let i = 1; !argumentsArray[i - 1].includes("}"); i++) {
        formatedAttributesArray.push(
            argumentsArray[i]
                .replace("{", "")
                .replace("}", "")
                .split(":")
        );
    }

    return formatedAttributesArray;
}

export function methodsFormatter(argumentsArray) {
    const formatedMethodsArray = [];
    
    for(let i = 1; !argumentsArray[i - 1].includes("}");) {
        const [method, firstParameter] = argumentsArray[i].split("(");
        let methodArgument = {
            argument: method.replace("{", "").split(":"),
            paramenters: []
        };
        
        // Checks if next argument is a method parameter
        let k = i + 1;

        if((firstParameter !== ")") && (firstParameter !== ")}")) {
            methodArgument.paramenters.push(firstParameter
                .replace(")", "")
                .replace("}", "")
                .split(":"));
            
            while(!argumentsArray[k - 1].includes(")")) {
                methodArgument.paramenters.push(argumentsArray[k]
                    .replace(")", "")
                    .replace("}", "")
                    .split(":"));

                k++;
            }
        }
        i = k;

        formatedMethodsArray.push(methodArgument);
    }
    
    return formatedMethodsArray;
}

export function GetArgumentsValueIndex(commandArray, argument) {
    const index = commandArray.indexOf(argument) + 1;
    const { t } = useTranslation();

    if(index >= commandArray.length) {
        throw t("error.command_syntax");
    }

    return index;
}