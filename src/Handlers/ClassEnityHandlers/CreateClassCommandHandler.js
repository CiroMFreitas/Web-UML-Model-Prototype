import { ERROR_COMMAND_SYNTAX } from "../../Utils/Errors";
import { SUPPORTED_ENTITY_TYPES, SUPPORTED_VISIBILITY } from "../../Utils/SupportedKeyWords";
import { attributesFormatter, getKeyByValue, methodsFormatter } from "../UtilityHandlers/DataHandler";
import { upperCaseFirstLetter, validateNameSpace } from "../UtilityHandlers/StringHandler";

/**
 * Handles command returning an object to be used as a classEntity.
 * 
 * @param {String} commandArray 
 */
export default function CreateClassCommandHandler(commandArray) {
    const handledCreateEntity = {
        entityType: upperCaseFirstLetter(SUPPORTED_ENTITY_TYPES.class[1]),
        name: upperCaseFirstLetter(validateNameSpace(commandArray[0].toLowerCase())),
        attributes: [],
        methods: []
    }

    // Get attributes and methods
    const firstAttributeArgumentIndex = commandArray.indexOf("-a");
    if(firstAttributeArgumentIndex !== -1) {
        handledCreateEntity.attributes = createAttributesHandler(commandArray.slice(firstAttributeArgumentIndex));
    }
    
    const firstMethodArgumentIndex = commandArray.indexOf("-m");
    if(firstMethodArgumentIndex !== -1) {
        handledCreateEntity.methods = createMethodsHandler(commandArray.slice(firstMethodArgumentIndex));
    }

    return handledCreateEntity;
}

// Handles possible attributes
function createAttributesHandler(argumentsArray) {
    const attributesArguments = attributesFormatter(argumentsArray);
    const createAttributes = []

    // Get and split attributes arguments
    attributesArguments.forEach((attributeArgument) => {
        // Create attribute depending on the number of arguments and supported visibility
        switch(attributeArgument.length) {
            case 3:
                if(getKeyByValue(SUPPORTED_VISIBILITY, attributeArgument[0])) {
                    createAttributes.push({
                        visibility: attributeArgument[0],
                        type: validateNameSpace(attributeArgument[1]),
                        name: validateNameSpace(attributeArgument[2])
                    });
                } else {
                    throw ERROR_COMMAND_SYNTAX;
                }
                break;

            case 2:
                createAttributes.push({
                    visibility: SUPPORTED_VISIBILITY.public[1],
                    type: validateNameSpace(attributeArgument[0]),
                    name: validateNameSpace(attributeArgument[1])
                });
                break;
            
            default:
                throw ERROR_COMMAND_SYNTAX;
        }
    });

    return createAttributes;
}

// Handles possible methods
function createMethodsHandler(argumentsArray) {
    const methodsArguments = methodsFormatter(argumentsArray);
    
    const newMethods = methodsArguments.map((newMethod) => {
        const newParameters = newMethod.paramenters.map((newMethodParameter) => {
            return {
                type: validateNameSpace(newMethodParameter[0]),
                name: validateNameSpace(newMethodParameter[1])
            };
        })

        // Create methdod depending on the number of arguments and supported visibility
        switch(newMethod.argument.length) {
            case 3:
                if(getKeyByValue(SUPPORTED_VISIBILITY, newMethod.argument[0])) {
                    return {
                        visibility: newMethod.argument[0],
                        type: validateNameSpace(newMethod.argument[1]),
                        name: validateNameSpace(newMethod.argument[2]),
                        parameters: newParameters
                    };
                } else {
                    throw ERROR_COMMAND_SYNTAX;
                }

            case 2:
                return  {
                    visibility: SUPPORTED_VISIBILITY.public[1],
                    type: validateNameSpace(newMethod.argument[0]),
                    name: validateNameSpace(newMethod.argument[1]),
                    parameters: newParameters
                };
            
            default:
                throw ERROR_COMMAND_SYNTAX;
        }
    });
    
    return newMethods;
}