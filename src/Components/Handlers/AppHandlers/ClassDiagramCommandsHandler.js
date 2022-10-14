import { v4 as uuidv4 } from "uuid";
import { upperCaseFirstLetter } from "../UtilityHandlers/StringHandler";
import createClassCommandHandler from "../ClassEnityHandlers/CreateClassCommandHandler";
import { SUPPORTED_COMMANDS, SUPPORTED_ENTITY_TYPES } from "../../../Utils/SupportedKeyWords";
import { ERROR_UNRECOGNISED_COMMAND, ERROR_UNRECOGNISED_ENTITY_TYPE } from "../../../Utils/Errors";
import { getKeyByValue } from "../UtilityHandlers/DataHandler";

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

        default:
            throw ERROR_UNRECOGNISED_COMMAND;
    }

    return handledObjectEntity;
}

// Check which type is to be handled
function addCommandHandler(command) {
    const handledAddEntity = {
        entityType: upperCaseFirstLetter(command[1].toLowerCase())
    }
    
    switch(true) {
        case SUPPORTED_ENTITY_TYPES.class.includes(handledAddEntity.entityType.toLowerCase()):
            Object.assign(handledAddEntity, createClassCommandHandler(command));

            break;
            
        default:
            throw ERROR_UNRECOGNISED_ENTITY_TYPE;
    }

    return handledAddEntity;
}