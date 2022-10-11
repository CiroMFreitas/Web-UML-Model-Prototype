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
        handledAddEntity.methods = addMethodsHandler(command, command.indexOf("-m") + 1);
    }

    return handledAddEntity;
}

// Handles possible attributes
function addAttributesHandler(attributesArguments) {
    const addAttributes = []

    return addAttributes;
}
// Handles possible methods
function addMethodsHandler(methodsArguments) {
    const addMethods = [];

    return addMethods;
}