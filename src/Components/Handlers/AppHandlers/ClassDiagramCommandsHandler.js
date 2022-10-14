import { v4 as uuidv4 } from "uuid";
import { upperCaseFirstLetter } from "../UtilityHandlers/StringHandler";
import createClassCommandHandler from "../ClassEnityHandlers/CreateClassCommandHandler";
import { SUPPORTED_COMMANDS, SUPPORTED_ENTITY_TYPES } from "../../../Utils/SupportedKeyWords";
import { ERROR_UNRECOGNISED_COMMAND, ERROR_UNRECOGNISED_ENTITY_TYPE } from "../../../Utils/Errors";
import { getKeyByValue } from "../UtilityHandlers/DataHandler";
import readClassCommandHandler from "../ClassEnityHandlers/ReadClassCommandHandler";

/**
 * Receives a command line and handles it into an object to be stored and rendered on application.
 * 
 * @param {String} commandLine
 */
export default function classDiagramCommandsHandler(commandLine) {
    const command = commandLine.replace("\n", "").replaceAll(",", "").split(" ");
    const handledObjectEntity = {
        id: uuidv4(),
        command: getKeyByValue(SUPPORTED_COMMANDS, command[0].toLowerCase())
    };

    switch(handledObjectEntity.command) {
        case SUPPORTED_COMMANDS.create[0]:
            Object.assign(handledObjectEntity, addCommandHandler(command));

            break;

            case SUPPORTED_COMMANDS.read[0]:
                Object.assign(handledObjectEntity, readCommandHandler(command));
    
            break;

        default:
            throw ERROR_UNRECOGNISED_COMMAND;
    }

    return handledObjectEntity;
}

// Following functions checks which type is to be handled according to command
function addCommandHandler(command) {
    const handledCreateEntity = {
        entityType: upperCaseFirstLetter(command[1].toLowerCase())
    }
    
    switch(true) {
        case SUPPORTED_ENTITY_TYPES.class.includes(handledCreateEntity.entityType.toLowerCase()):
            Object.assign(handledCreateEntity, createClassCommandHandler(command));

            break;
            
        default:
            throw ERROR_UNRECOGNISED_ENTITY_TYPE;
    }

    return handledCreateEntity;
}

function readCommandHandler(command) {
    const handledReadEntity = {
        entityType: upperCaseFirstLetter(command[1].toLowerCase())
    }
    
    switch(true) {
        case SUPPORTED_ENTITY_TYPES.class.includes(handledReadEntity.entityType.toLowerCase()):
            Object.assign(handledReadEntity, readClassCommandHandler(command));

            break;
            
        default:
            throw ERROR_UNRECOGNISED_ENTITY_TYPE;
    }

    return handledReadEntity;
}