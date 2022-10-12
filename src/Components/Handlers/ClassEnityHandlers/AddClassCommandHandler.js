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

    return addMethods;
}