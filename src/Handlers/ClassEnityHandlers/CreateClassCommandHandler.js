import { ERROR_COMMAND_SYNTAX } from "../../Utils/Errors";
import { SUPPORTED_ENTITY_TYPES, SUPPORTED_VISIBILITY } from "../../Utils/SupportedKeyWords";
import { getKeyByValue, getLastArgumentIndexHandler } from "../UtilityHandlers/DataHandler";
import { upperCaseFirstLetter, validateNameSpace } from "../UtilityHandlers/StringHandler";

/**
 * Handles command returning an object to be used as a classEntity.
 * 
 * @param {String} commandArray 
 */
export default function createClassCommandHandler(commandArray) {
    const handledCreateEntity = {
        entityType: upperCaseFirstLetter(SUPPORTED_ENTITY_TYPES.class[1]),
        entityName: upperCaseFirstLetter(validateNameSpace(commandArray[0].toLowerCase())),
        attributes: [],
        methods: []
    }

    // Get attributes and methods
    if(commandArray.indexOf("-a") !== -1) {
        const firstAttributeArgumentIndex = commandArray.indexOf("-a") + 1;

        handledCreateEntity.attributes = createAttributesHandler(commandArray.slice(firstAttributeArgumentIndex));
    }
    
    if(commandArray.indexOf("-m") !== -1) {
        const firstMethodArgumentIndex = commandArray.indexOf("-m") + 1;

        handledCreateEntity.methods = createMethodsHandler(commandArray.slice(firstMethodArgumentIndex));
    }

    return handledCreateEntity;
}

// Handles possible attributes
function createAttributesHandler(attributesArguments) {
    const createAttributes = []
    const lastAttributeArgumentIndex = getLastArgumentIndexHandler(attributesArguments, "}");
    
    // Checks if attributes are sorrounded by [] and removes it
    if(!attributesArguments[0].includes("{") ||
    !attributesArguments[lastAttributeArgumentIndex].includes("}")) {
        throw ERROR_COMMAND_SYNTAX;
    }
    attributesArguments[0] = attributesArguments[0].replace("{", "");
    attributesArguments[lastAttributeArgumentIndex] = attributesArguments[lastAttributeArgumentIndex].replace("}", "");

    // Get and split attributes arguments
    for(let i = 0; i <= lastAttributeArgumentIndex; i++) {
        const createAttribute = attributesArguments[i].split(":");

        // Create attribute depending on the number of arguments and supported visibility
        switch(createAttribute.length) {
            case 3:
                if(getKeyByValue(SUPPORTED_VISIBILITY, createAttribute[0])) {
                    createAttributes.push({
                        visibility: createAttribute[0],
                        type: validateNameSpace(createAttribute[1]),
                        name: validateNameSpace(createAttribute[2])
                    });
                } else {
                    throw ERROR_COMMAND_SYNTAX;
                }
                break;

            case 2:
                createAttributes.push({
                    visibility: SUPPORTED_VISIBILITY.public[1],
                    type: validateNameSpace(createAttribute[0]),
                    name: validateNameSpace(createAttribute[1])
                });
                break;
            
            default:
                throw ERROR_COMMAND_SYNTAX;
        }
    }

    return createAttributes;
}

// Handles possible methods
function createMethodsHandler(methodsArguments) {
    const createMethods = [];
    const lastMethodArgumentIndex = getLastArgumentIndexHandler(methodsArguments, "}");
    
    // Checks if methods are sorrounded by [] and removes it
    if(!methodsArguments[0].includes("{") ||
    !methodsArguments[lastMethodArgumentIndex].includes("}")) {
        throw ERROR_COMMAND_SYNTAX;
    }
    methodsArguments[0] = methodsArguments[0].replace("{", "");
    methodsArguments[lastMethodArgumentIndex] = methodsArguments[lastMethodArgumentIndex].replace("}", "");

    // Get and split methods arguments
    for(let i = 0; i <= lastMethodArgumentIndex;) {
        const methodArgument = methodsArguments[i].split("(");
        const createMethodArguments = methodArgument[0].split(":");
        let createMethod;

        // Create methdod depending on the number of arguments and supported visibility
        switch(createMethodArguments.length) {
            case 3:
                if(getKeyByValue(SUPPORTED_VISIBILITY, createMethodArguments[0])) {
                    createMethod = {
                        visibility: createMethodArguments[0],
                        type: validateNameSpace(createMethodArguments[1]),
                        name: validateNameSpace(createMethodArguments[2]),
                        parameters: []
                    };
                } else {
                    throw ERROR_COMMAND_SYNTAX;
                }
                break;

            case 2:
                createMethod =  {
                    visibility: SUPPORTED_VISIBILITY.public[1],
                    type: validateNameSpace(createMethodArguments[0]),
                    name: validateNameSpace(createMethodArguments[1]),
                    parameters: []
                };
                break;
            
            default:
                throw ERROR_COMMAND_SYNTAX;
        }
        
        // Checks if next argument is a method parameter
        let k = i + 1;
        const addMethodParameters = [];

        if(methodArgument[1] !== ")") {
            const firstMethodParamanter = methodArgument[1].replace(")", "").split(":");
            addMethodParameters.push({
                type: firstMethodParamanter[0],
                name: firstMethodParamanter[1]
            });
            
            while(!methodsArguments[k - 1].includes(")")) {
                const parameter = methodsArguments[k].replace(")", "").split(":");

                if(parameter.length === 2) {
                    addMethodParameters.push({
                        type: parameter[0],
                        name: parameter[1]
                    });
                } else {
                    throw ERROR_COMMAND_SYNTAX;
                }

                k++;
            }
        }
        createMethod.parameters = addMethodParameters;
        i = k;

        createMethods.push(createMethod);
    }

    return createMethods;
}