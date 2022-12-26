import { ERROR_COMMAND_SYNTAX } from "../../Utils/Errors";
import { SUPPORTED_ALTER_ARGUMENTS, SUPPORTED_VISIBILITY } from "../../Utils/SupportedKeyWords";
import { attributesFormatter, getKeyByValue, methodsFormatter } from "../UtilityHandlers/DataHandler";
import { upperCaseFirstLetter, validateNameSpace } from "../UtilityHandlers/StringHandler";

export default function alterClassCommandHandler(commandArray, alteringClass, renameIndex) {
    const handledAlteringClass = alteringClass;
    
    if(renameIndex !== -1) {
        handledAlteringClass.name = alterNameHandler(commandArray[renameIndex + 1]);
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
                    const alteringAttributeIndex = alteringClass.attributes.indexOf(alteringAttribute);

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

                    alteringClass.attributes.splice(alteringAttributeIndex, 1, alteringAttribute);
                } else {
                    throw ERROR_COMMAND_SYNTAX;
                }

                break;

            default:
                throw ERROR_COMMAND_SYNTAX;
        }
    });
}

function alterMethodsHandler(alteringArguments, alteringClass) {
    const formattedArguments = methodsFormatter(alteringArguments);
    
    formattedArguments.forEach((formattedArgument) => {
        const argument = formattedArgument.argument.shift().toLowerCase();

        switch(true) {
            case SUPPORTED_ALTER_ARGUMENTS.add.includes(argument):
                const newMethod = {
                    visibility: "",
                    type: "",
                    name: "",
                    parameters: []
                }

                switch(formattedArgument.argument.length) {
                    case 3:
                        if(getKeyByValue(SUPPORTED_VISIBILITY, formattedArgument.argument[0])) {
                            newMethod.visibility = formattedArgument.argument[0];
                            newMethod.type = validateNameSpace(formattedArgument.argument[1]);
                            newMethod.name = validateNameSpace(formattedArgument.argument[2]);
                        } else {
                            throw ERROR_COMMAND_SYNTAX;
                        }
                        break;
        
                    case 2:
                        newMethod.visibility = SUPPORTED_VISIBILITY.public[1];
                        newMethod.type = validateNameSpace(formattedArgument.argument[0]);
                        newMethod.name = validateNameSpace(formattedArgument.argument[1]);

                        break;
                    
                    default:
                        throw ERROR_COMMAND_SYNTAX;
                }

                newMethod.parameters = formattedArgument.paramenters.map((newParameter) => {
                    return {
                        type: validateNameSpace(newParameter[0]),
                        name: validateNameSpace(newParameter[1])
                    }
                });

                alteringClass.methods.push(newMethod);

                break;
            
            case SUPPORTED_ALTER_ARGUMENTS.remove.includes(argument):
                const removingMethodIndex = alteringClass.methods.findIndex((method) => formattedArgument.argument[0] === method.name);

                alteringClass.methods.splice(removingMethodIndex, 1);

                break;

            case SUPPORTED_ALTER_ARGUMENTS.alter.includes(argument):
                const alteringMethodName = formattedArgument.argument.shift();

                const alteringMethod = alteringClass.methods.find((method) => alteringMethodName === method.name);

                if(alteringMethod) {
                    const alteringMethodIndex = alteringClass.methods.indexOf(alteringMethod);

                    if(formattedArgument.argument[0] !== "-") {
                        if(getKeyByValue(SUPPORTED_VISIBILITY, formattedArgument.argument[0])) {
                            alteringMethod.visibility = formattedArgument.argument[0];
                        } else {
                            throw ERROR_COMMAND_SYNTAX;
                        }
                    }

                    if(formattedArgument.argument[1] !== "-") {
                        if(validateNameSpace(formattedArgument.argument[1])) {
                            alteringMethod.type = formattedArgument.argument[1];
                        } else {
                            throw ERROR_COMMAND_SYNTAX;
                        }
                    }

                    if(formattedArgument.argument[2] !== "-") {
                        if(validateNameSpace(formattedArgument.argument[2])) {
                            alteringMethod.name = formattedArgument.argument[2];
                        } else {
                            throw ERROR_COMMAND_SYNTAX;
                        }
                    }

                    if(formattedArgument.paramenters.length > 0) {
                        alteringMethod.parameters = alterMethodParametersHandler(formattedArgument.paramenters, alteringMethod.parameters);
                    }

                    alteringClass.methods.splice(alteringMethodIndex, 1, alteringMethod);
                } else {
                    throw ERROR_COMMAND_SYNTAX;
                }

                break;

            default:
                throw ERROR_COMMAND_SYNTAX;
        }
    });
}

function alterMethodParametersHandler(alteringParamentersArguments, methodParameters) {
    alteringParamentersArguments.forEach((alteringParamentersArgument) => {
        const argument = alteringParamentersArgument.shift();
    
        switch(true) {
            case SUPPORTED_ALTER_ARGUMENTS.add.includes(argument):
                methodParameters.push({
                    type: validateNameSpace(alteringParamentersArgument[0]),
                    name: validateNameSpace(alteringParamentersArgument[1])
                });

                break;
            
            case SUPPORTED_ALTER_ARGUMENTS.remove.includes(argument):
                const removingParameterIndex = methodParameters.findIndex((parameter) => alteringParamentersArgument[0] === parameter.name);

                methodParameters.splice(removingParameterIndex, 1);

                break;

            case SUPPORTED_ALTER_ARGUMENTS.alter.includes(argument):
                const alteringParameterName = alteringParamentersArgument.shift();

                const alteringParameter = methodParameters.find((parameter) => alteringParameterName === parameter.name);

                if(alteringParameter) {
                    const alteringParameterIndex = methodParameters.indexOf(alteringParameter);

                    if(alteringParamentersArgument[0] !== "-") {
                        if(validateNameSpace(alteringParamentersArgument[0])) {
                            alteringParameter.type = alteringParamentersArgument[0];
                        } else {
                            throw ERROR_COMMAND_SYNTAX;
                        }
                    }

                    if(alteringParamentersArgument[1] !== "-") {
                        if(validateNameSpace(alteringParamentersArgument[1])) {
                            alteringParameter.name = alteringParamentersArgument[1];
                        } else {
                            throw ERROR_COMMAND_SYNTAX;
                        }
                    }

                    methodParameters.splice(alteringParameterIndex, 1, alteringParameter);
                }
                    
                break;
            
            default:
                throw ERROR_COMMAND_SYNTAX;
        }
    });

    return methodParameters;
}