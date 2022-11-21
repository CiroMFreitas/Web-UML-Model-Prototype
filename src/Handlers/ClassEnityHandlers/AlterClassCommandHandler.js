import { ERROR_COMMAND_SYNTAX } from "../../Utils/Errors";
import { SUPPORTED_ALTER_ARGUMENTS, SUPPORTED_VISIBILITY } from "../../Utils/SupportedKeyWords";
import { attributesFormatter, getKeyByValue, methodsFormatter } from "../UtilityHandlers/DataHandler";
import { upperCaseFirstLetter, validateNameSpace } from "../UtilityHandlers/StringHandler";

export default function alterClassCommandHandler(commandArray, alteringClass, renameIndex) {
    const handledAlteringClass = alteringClass;
    
    if(renameIndex !== -1) {
        handledAlteringClass.entityName = alterNameHandler(commandArray[renameIndex + 1]);
    }

    const alteringAttributesIndex = commandArray.indexOf("-a");
    if(alteringAttributesIndex !== -1) {
        alterAttributesHandler(commandArray.slice(alteringAttributesIndex), alteringClass)
    }

    const alteringMethodsIndex = commandArray.indexOf("-m");
    if(alteringMethodsIndex !== -1) {
        alterMethodsHandler(commandArray.slice(alteringMethodsIndex), alteringClass)
    }

    return handledAlteringClass;
}

function alterNameHandler(newName) {
    return upperCaseFirstLetter(validateNameSpace(newName.toLowerCase()));
}

function alterAttributesHandler(alteringArguments, alteringClass) {
    const formattedArguments = attributesFormatter(alteringArguments);
    
    formattedArguments.forEach((formattedArgument) => {
        const argument = formattedArgument.shift().toLowerCase();

        switch(true) {
            case SUPPORTED_ALTER_ARGUMENTS.add.includes(argument):
                switch(formattedArgument.length) {
                    case 3:
                        if(getKeyByValue(SUPPORTED_VISIBILITY, formattedArgument[0])) {
                            alteringClass.attributes.push({
                                visibility: formattedArgument[0],
                                type: validateNameSpace(formattedArgument[1]),
                                name: validateNameSpace(formattedArgument[2])
                            });
                        } else {
                            throw ERROR_COMMAND_SYNTAX;
                        }
                        break;
        
                    case 2:
                        alteringClass.attributes.push({
                            visibility: SUPPORTED_VISIBILITY.public[1],
                            type: validateNameSpace(formattedArgument[0]),
                            name: validateNameSpace(formattedArgument[1])
                        });
                        break;
                    
                    default:
                        throw ERROR_COMMAND_SYNTAX;
                }
            break

            case SUPPORTED_ALTER_ARGUMENTS.remove.includes(argument):
                const removingAttibuteIndex = alteringClass.attributes.findIndex((attribute) => formattedArgument[0] === attribute.name);

                if(removingAttibuteIndex !== -1) {
                    alteringClass.attributes.splice(removingAttibuteIndex, 1);
                } else {
                    throw ERROR_COMMAND_SYNTAX;
                }

                break;

            case SUPPORTED_ALTER_ARGUMENTS.alter.includes(argument):
                const alteringAttributeName = formattedArgument.shift();

                const alteringAttribute = alteringClass.attributes.find((attribute) => alteringAttributeName === attribute.name);

                if(alteringAttribute) {
                    const alteringAttibuteIndex = alteringClass.attributes.indexOf(alteringAttribute);

                    if(formattedArgument[0] !== "-") {
                        if(getKeyByValue(SUPPORTED_VISIBILITY, formattedArgument[0])) {
                            alteringAttribute.visibility = formattedArgument[0];
                        } else {
                            throw ERROR_COMMAND_SYNTAX;
                        }
                    }

                    if(formattedArgument[1] !== "-") {
                        if(validateNameSpace(formattedArgument[1])) {
                            alteringAttribute.type = formattedArgument[1];
                        } else {
                            throw ERROR_COMMAND_SYNTAX;
                        }
                    }

                    if(formattedArgument[2] !== "-") {
                        if(validateNameSpace(formattedArgument[2])) {
                            alteringAttribute.name = formattedArgument[2];
                        } else {
                            throw ERROR_COMMAND_SYNTAX;
                        }
                    }

                    alteringClass.attributes.splice(alteringAttibuteIndex, 1, alteringAttribute);
                } else {
                    throw ERROR_COMMAND_SYNTAX;
                }

                break;

            default:
                throw ERROR_COMMAND_SYNTAX;
        }
    });
}
            default:
                throw ERROR_COMMAND_SYNTAX;
        }
    });
}