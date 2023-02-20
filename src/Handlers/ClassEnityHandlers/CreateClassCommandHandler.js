import { SUPPORTED_ENTITY_TYPES, SUPPORTED_VISIBILITY } from "../../Utils/SupportedKeyWords";
import { attributesFormatter, getKeyByValue, methodsFormatter } from "../UtilityHandlers/DataHandler";
import { upperCaseFirstLetter, validateNameSpace } from "../UtilityHandlers/StringHandler";

import { useTranslation } from 'react-i18next'

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
        handledCreateEntity.attributes = CreateAttributesHandler(commandArray.slice(firstAttributeArgumentIndex));
    }
    
    const firstMethodArgumentIndex = commandArray.indexOf("-m");
    if(firstMethodArgumentIndex !== -1) {
        handledCreateEntity.methods = CreateMethodsHandler(commandArray.slice(firstMethodArgumentIndex));
    }

    return handledCreateEntity;
}

// Handles possible attributes
function CreateAttributesHandler(argumentsArray) {
    const attributesArguments = attributesFormatter(argumentsArray);
    const createAttributes = []
    const { t } = useTranslation();

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
                    throw t("error.command_syntax");
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
                throw t("error.command_syntax");
        }
    });

    return createAttributes;
}

// Handles possible methods
function CreateMethodsHandler(argumentsArray) {
    const methodsArguments = methodsFormatter(argumentsArray);
    const { t } = useTranslation();
    
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
                    throw t("error.command_syntax");
                }

            case 2:
                return  {
                    visibility: SUPPORTED_VISIBILITY.public[1],
                    type: validateNameSpace(newMethod.argument[0]),
                    name: validateNameSpace(newMethod.argument[1]),
                    parameters: newParameters
                };
            
            default:
                throw t("error.command_syntax");
        }
    });
    
    return newMethods;
}