import { getKeyByValue, getLastArgumentIndexHandler } from "../UtilityHandlers/DataHandler";
import { upperCaseFirstLetter, validateNameSpace } from "../UtilityHandlers/StringHandler";

// Supported Key Words
const SUPPORTED_VISIBILITY = {
    public: [
        "public",
        "pública"
    ],
    protected: [
        "protected",
        "protegida"
    ],
    private: [
        "private",
        "privada"
    ]
};

// Errors
const ERROR_COMMAND_SYNTAX = "Erro na sintaxe do comando!"

/**
 * Handles command returning an object to be used as a classEntity.
 * 
 * @param {String} command 
 */
export default function addClassCommandHandler(command) {
    const handledAddEntity = {
        entityName: upperCaseFirstLetter(validateNameSpace(command[2])),
        attributes: [],
        methods: []
    }

    // Get attributes and methods
    if(command.indexOf("-a") !== -1) {
        const firstAttributeArgumentIndex = command.indexOf("-a") + 1;

        handledAddEntity.attributes = addAttributesHandler(command.slice(firstAttributeArgumentIndex));
    }
    
    if(command.indexOf("-m") !== -1) {
        const firstMethodArgumentIndex = command.indexOf("-m") + 1;

        handledAddEntity.methods = addMethodsHandler(command.slice(firstMethodArgumentIndex));
    }

    return handledAddEntity;
}

// Handles possible attributes
function addAttributesHandler(attributesArguments) {
    const addAttributes = []
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
        const addAttribute = attributesArguments[i].split(":");

        // Create attribute depending on the number of arguments and supported visibility
        switch(addAttribute.length) {
            case 3:
                if(getKeyByValue(SUPPORTED_VISIBILITY, addAttribute[0])) {
                    addAttributes.push({
                        visibility: addAttribute[0],
                        type: validateNameSpace(addAttribute[1]),
                        name: validateNameSpace(addAttribute[2])
                    });
                } else {
                    throw ERROR_COMMAND_SYNTAX;
                }
                break;

            case 2:
                addAttributes.push({
                    visibility: SUPPORTED_VISIBILITY.public[1],
                    type: validateNameSpace(addAttribute[0]),
                    name: validateNameSpace(addAttribute[1])
                });
                break;
            
            default:
                throw ERROR_COMMAND_SYNTAX;
        }
    }

    return addAttributes;
}

// Handles possible methods
function addMethodsHandler(methodsArguments) {
    const addMethods = [];
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
        const addMethodArguments = methodArgument[0].split(":");
        let addMethod;

        // Create methdod depending on the number of arguments and supported visibility
        switch(addMethodArguments.length) {
            case 3:
                if(getKeyByValue(SUPPORTED_VISIBILITY, addMethodArguments[0])) {
                    addMethod = {
                        visibility: addMethodArguments[0],
                        type: validateNameSpace(addMethodArguments[1]),
                        name: validateNameSpace(addMethodArguments[2]),
                        parameters: []
                    };
                } else {
                    throw ERROR_COMMAND_SYNTAX;
                }
                break;

            case 2:
                addMethod =  {
                    visibility: SUPPORTED_VISIBILITY.public[1],
                    type: validateNameSpace(addMethodArguments[0]),
                    name: validateNameSpace(addMethodArguments[1]),
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
        addMethod.parameters = addMethodParameters;
        i = k;

        addMethods.push(addMethod);
    }

    return addMethods;
}