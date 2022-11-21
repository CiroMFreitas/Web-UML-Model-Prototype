import { ERROR_COMMAND_SYNTAX } from "../../Utils/Errors";
import { SUPPORTED_ALTER_ARGUMENTS, SUPPORTED_VISIBILITY } from "../../Utils/SupportedKeyWords";
import { attributesFormatter, getKeyByValue } from "../UtilityHandlers/DataHandler";
import { upperCaseFirstLetter, validateNameSpace } from "../UtilityHandlers/StringHandler";

export default function alterClassCommandHandler(commandArray, alteringClass, renameIndex) {
    const handledAlteringClass = alteringClass;
    
    if(renameIndex !== -1) {
        handledAlteringClass.entityName = alterNameHandler(commandArray[renameIndex + 1]);
    }

    const alteringAttributesIndex = commandArray.indexOf("-a");
    if(alteringAttributesIndex !== -1) {
        alterAttributesHandler(commandArray.splice(alteringAttributesIndex), alteringClass)
    }

    return handledAlteringClass;
}

function alterNameHandler(newName) {
    return upperCaseFirstLetter(validateNameSpace(newName.toLowerCase()));
}

function alterAttributesHandler(alteringArguments, alteringClass) {
    const alteringAttributes = attributesFormatter(alteringArguments);
    
    alteringAttributes.forEach((alteringAttribute) => {
        const argument = alteringAttribute.shift().toLowerCase();

        switch(true) {
            case SUPPORTED_ALTER_ARGUMENTS.add.includes(argument):
                switch(alteringAttribute.length) {
                    case 3:
                        if(getKeyByValue(SUPPORTED_VISIBILITY, alteringAttribute[0])) {
                            alteringClass.attributes.push({
                                visibility: alteringAttribute[0],
                                type: validateNameSpace(alteringAttribute[1]),
                                name: validateNameSpace(alteringAttribute[2])
                            });
                        } else {
                            throw ERROR_COMMAND_SYNTAX;
                        }
                        break;
        
                    case 2:
                        alteringClass.attributes.push({
                            visibility: SUPPORTED_VISIBILITY.public[1],
                            type: validateNameSpace(alteringAttribute[0]),
                            name: validateNameSpace(alteringAttribute[1])
                        });
                        break;
                    
                    default:
                        throw ERROR_COMMAND_SYNTAX;
                }
            break

            case SUPPORTED_ALTER_ARGUMENTS.remove.includes(argument):
                const removingAttibuteIndex = alteringClass.attributes.findIndex((attribute) => alteringAttribute[0] === attribute.name);

                if(removingAttibuteIndex !== -1) {
                    alteringClass.attributes.splice(removingAttibuteIndex, 1);
                } else {
                    throw ERROR_COMMAND_SYNTAX;
                }

                break;

            case SUPPORTED_ALTER_ARGUMENTS.alter.includes(argument):
                const alteringAttributename = alteringAttribute.shift();

                const alteringAttibute = alteringClass.attributes.find((attribute) => alteringAttributename === attribute.name);

                if(alteringAttibute) {
                    const alteringAttibuteIndex = alteringClass.attributes.indexOf(alteringAttibute);

                    if(alteringAttribute[0] !== "-") {
                        if(getKeyByValue(SUPPORTED_VISIBILITY, alteringAttribute[0])) {
                            alteringAttibute.visibility = alteringAttribute[0];
                        } else {
                            throw ERROR_COMMAND_SYNTAX;
                        }
                    }

                    if(alteringAttribute[1] !== "-") {
                        if(validateNameSpace(alteringAttribute[1])) {
                            alteringAttibute.type = alteringAttribute[1];
                        } else {
                            throw ERROR_COMMAND_SYNTAX;
                        }
                    }

                    if(alteringAttribute[2] !== "-") {
                        if(validateNameSpace(alteringAttribute[2])) {
                            alteringAttibute.name = alteringAttribute[2];
                        } else {
                            throw ERROR_COMMAND_SYNTAX;
                        }
                    }

                    alteringClass.attributes.splice(alteringAttibuteIndex, 1, alteringAttibute);
                } else {
                    throw ERROR_COMMAND_SYNTAX;
                }

                break;

            default:
                throw ERROR_COMMAND_SYNTAX;
        }
    });
}