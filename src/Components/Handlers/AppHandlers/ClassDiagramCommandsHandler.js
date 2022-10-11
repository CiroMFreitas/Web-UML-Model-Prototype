import { v4 as uuidv4 } from "uuid";
import { upperCaseFirstLetter } from "../UtilityHandlers/StringHandler";
import addClassCommandHandler from "../ClassEnityHandlers/AddClassCommandHandler";

// Supported Key Words
const SUPPORTED_COMMANDS = {
    add: [
        "add",
        "adicionar"
    ]
}

const SUPPORTED_ENTITY_TYPES = {
    classType: [
        "class",
        "classe"
    ]
};

// ERRORS
const ERROR_UNRECOGNISED_COMMAND = "Comando não reconhecido!";
const ERROR_UNRECOGNISED_ENTITY_TYPE = "Entidade não reconhecida!";

/**
 * Receives a command line and handles it into an object to be stored and rendered on application.
 * 
 * @param {String} commandLine
 */
export default function classDiagramCommandsHandler(commandLine) {
    const command = commandLine.replace("\n", "").split(" ");
    const handledObjectEntity = {
        id: uuidv4()
    };

    switch(true) {
        case SUPPORTED_COMMANDS.add.includes(command[0].toLowerCase()):
            Object.assign(handledObjectEntity, addCommandHandler(command));
            break;

        default:
            throw ERROR_UNRECOGNISED_COMMAND;
    }

    return handledObjectEntity;
}

// Check which type is to be handled
function addCommandHandler(command) {
    const handledAddEntity = {
        type: "add",
        entityType: upperCaseFirstLetter(command[1])
    }
    
    switch(true) {
        case SUPPORTED_ENTITY_TYPES.classType.includes(handledAddEntity.entityType.toLowerCase()):
            Object.assign(handledAddEntity, addClassCommandHandler(command));
            break;
            
        default:
            throw ERROR_UNRECOGNISED_ENTITY_TYPE;
    }

    return handledAddEntity;
}