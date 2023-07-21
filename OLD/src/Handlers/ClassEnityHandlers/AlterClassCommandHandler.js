import { SUPPORTED_ALTER_ARGUMENTS, SUPPORTED_VISIBILITY } from "../../Utils/SupportedKeyWords";
import { attributesFormatter, methodsFormatter } from "../UtilityHandlers/DataHandler";
import { upperCaseFirstLetter, validateNameSpace } from "../UtilityHandlers/StringHandler";

export default function AlterClassCommandHandler(commandArray, alteringClass, renameIndex) {
    const handledAlteringClass = alteringClass;
    
    if(renameIndex !== -1) {
        handledAlteringClass.name = alterNameHandler(commandArray[renameIndex + 1]);
    }

    const alteringAttributesIndex = commandArray.indexOf("-a");
    if(alteringAttributesIndex !== -1) {
        AlterAttributesHandler(commandArray.slice(alteringAttributesIndex), alteringClass)
    }

    const alteringMethodsIndex = commandArray.indexOf("-m");
    if(alteringMethodsIndex !== -1) {
        AlterMethodsHandler(commandArray.slice(alteringMethodsIndex), alteringClass)
    }

    return handledAlteringClass;
}

function alterNameHandler(newName) {
    return upperCaseFirstLetter(validateNameSpace(newName.toLowerCase()));
}

function AlterAttributesHandler(alteringArguments, alteringClass) {
    const formattedArguments = attributesFormatter(alteringArguments);
    
    formattedArguments.forEach((formattedArgument) => {
        const argument = formattedArgument.shift().toLowerCase();

        switch(true) {
            case SUPPORTED_ALTER_ARGUMENTS.add === argument:
                switch(formattedArgument.length) {
                    case 3:
                        if(SUPPORTED_VISIBILITY[formattedArgument[0]]) {
                            alteringClass.attributes.push({
                                visibility: formattedArgument[0],
                                type: validateNameSpace(formattedArgument[1]),
                                name: validateNameSpace(formattedArgument[2])
                            });
                        } else {
                            throw "error.unrecognized_attribute_visibility";
                        }
                        break;
        
                    case 2:
                        alteringClass.attributes.push({
                            visibility: SUPPORTED_VISIBILITY.public,
                            type: validateNameSpace(formattedArgument[0]),
                            name: validateNameSpace(formattedArgument[1])
                        });
                        break;
                    
                    default:
                        throw "error.invalid_attribute_arguments";
                }
            break

            case SUPPORTED_ALTER_ARGUMENTS.remove === argument:
                const removingAttibuteIndex = alteringClass.attributes.findIndex((attribute) => formattedArgument[0] === attribute.name);

                if(removingAttibuteIndex !== -1) {
                    alteringClass.attributes.splice(removingAttibuteIndex, 1);
                } else {
                    throw "error.removing_attribute_not_found";
                }

                break;

            case SUPPORTED_ALTER_ARGUMENTS.alter === argument:
                const alteringAttributeName = formattedArgument.shift();

                const alteringAttribute = alteringClass.attributes.find((attribute) => alteringAttributeName === attribute.name);

                if(alteringAttribute) {
                    const alteringAttributeIndex = alteringClass.attributes.indexOf(alteringAttribute);

                    if(formattedArgument[0] !== "-") {
                        if(SUPPORTED_VISIBILITY[formattedArgument[0]]) {
                            alteringAttribute.visibility = formattedArgument[0];
                        } else {
                            throw "error.unrecognized_attribute_visibility";
                        }
                    }

                    if(formattedArgument[1] !== "-") {
                        alteringAttribute.type = validateNameSpace(formattedArgument[1]);
                    }

                    if(formattedArgument[2] !== "-") {
                        alteringAttribute.name = validateNameSpace(formattedArgument[2]);
                    }

                    alteringClass.attributes.splice(alteringAttributeIndex, 1, alteringAttribute);
                } else {
                    throw "error.altering_attribute_not_found";
                }

                break;

            default:
                throw "error.unrecongnized_alter_attribute_action";
        }
    });
}

function AlterMethodsHandler(alteringArguments, alteringClass) {
    const formattedArguments = methodsFormatter(alteringArguments);
    
    formattedArguments.forEach((formattedArgument) => {
        const argument = formattedArgument.argument.shift().toLowerCase();

        switch(true) {
            case SUPPORTED_ALTER_ARGUMENTS.add === argument:
                const newMethod = {
                    visibility: "",
                    type: "",
                    name: "",
                    parameters: []
                };

                switch(formattedArgument.argument.length) {
                    case 3:
                        if(SUPPORTED_VISIBILITY[formattedArgument.argument[0]]) {
                            newMethod.visibility = formattedArgument.argument[0];
                            newMethod.type = validateNameSpace(formattedArgument.argument[1]);
                            newMethod.name = validateNameSpace(formattedArgument.argument[2]);
                        } else {
                            throw "error.unrecognized_method_visibility";
                        }
                        break;
        
                    case 2:
                        newMethod.visibility = SUPPORTED_VISIBILITY.public;
                        newMethod.type = validateNameSpace(formattedArgument.argument[0]);
                        newMethod.name = validateNameSpace(formattedArgument.argument[1]);

                        break;
                    
                    default:
                        throw "error.invalid_method_arguments";
                }

                newMethod.parameters = formattedArgument.paramenters.map((newParameter) => {
                    return {
                        type: validateNameSpace(newParameter[0]),
                        name: validateNameSpace(newParameter[1])
                    }
                });

                alteringClass.methods.push(newMethod);

                break;
            
            case SUPPORTED_ALTER_ARGUMENTS.remove === argument:
                const removingMethodIndex = alteringClass.methods.findIndex((method) => formattedArgument.argument[0] === method.name);

                alteringClass.methods.splice(removingMethodIndex, 1);

                break;

            case SUPPORTED_ALTER_ARGUMENTS.alter === argument:
                const alteringMethodName = formattedArgument.argument.shift();

                const alteringMethod = alteringClass.methods.find((method) => alteringMethodName === method.name);

                if(alteringMethod) {
                    const alteringMethodIndex = alteringClass.methods.indexOf(alteringMethod);

                    if(formattedArgument.argument[0] !== "-") {
                        alteringMethod.visibility = validateNameSpace(formattedArgument.argument[0]);
                    }

                    if(formattedArgument.argument[1] !== "-") {
                        alteringMethod.type = validateNameSpace(formattedArgument.argument[1]);
                    }

                    if(formattedArgument.argument[2] !== "-") {
                        alteringMethod.name = validateNameSpace(formattedArgument.argument[2]);
                    }

                    if(formattedArgument.paramenters.length > 0) {
                        alteringMethod.parameters = AlterMethodParametersHandler(formattedArgument.paramenters, alteringMethod.parameters);
                    }

                    alteringClass.methods.splice(alteringMethodIndex, 1, alteringMethod);
                } else {
                    throw "error.altering_method_not_found";
                }

                break;

            default:
                throw "error.unrecongnized_alter_method_action";
        }
    });
}

function AlterMethodParametersHandler(alteringParamentersArguments, methodParameters) {

    alteringParamentersArguments.forEach((alteringParamentersArgument) => {
        const argument = alteringParamentersArgument.shift();
    
        switch(true) {
            case SUPPORTED_ALTER_ARGUMENTS.add === argument:
                methodParameters.push({
                    type: validateNameSpace(alteringParamentersArgument[0]),
                    name: validateNameSpace(alteringParamentersArgument[1])
                });

                break;
            
            case SUPPORTED_ALTER_ARGUMENTS.remove === argument:
                const removingParameterIndex = methodParameters.findIndex((parameter) => alteringParamentersArgument[0] === parameter.name);

                methodParameters.splice(removingParameterIndex, 1);

                break;

            case SUPPORTED_ALTER_ARGUMENTS.alter === argument:
                const alteringParameterName = alteringParamentersArgument.shift();

                const alteringParameter = methodParameters.find((parameter) => alteringParameterName === parameter.name);

                if(alteringParameter) {
                    const alteringParameterIndex = methodParameters.indexOf(alteringParameter);

                    if(alteringParamentersArgument[0] !== "-") {
                        alteringParameter.type = validateNameSpace(alteringParamentersArgument[0]);
                    }

                    if(alteringParamentersArgument[1] !== "-") {
                        alteringParameter.name = validateNameSpace(alteringParamentersArgument[1]);
                    }

                    methodParameters.splice(alteringParameterIndex, 1, alteringParameter);
                }
                    
                break;
            
            default:
                throw "error.unrecongnized_alter_parameter_action";
        }
    });

    return methodParameters;
}