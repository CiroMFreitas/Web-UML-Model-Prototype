import { v4 as uuidv4 } from "uuid";
import { upperCaseFirstLetter } from "./StringHandler";

// Supported Key Words
const SUPPORTED_ENTITY_TYPES = {
    classType: "classe"
};

const SUPPORTED_VISIBILITY = [
    "pública",
    "protegida",
    "privada"
];

// ERRORS
const ERROR_UNRECOGNISED_COMMAND = "Comando não reconhecido!";
const ERROR_UNRECOGNISED_ENTITY_TYPE = "Entidade não reconhecida!";
const ERROR_COMMAND_SYNTAX = "Erro de sintaxe no commando!";

export default function classDiagramCommandsHandler(commandLine) {
    const command = commandLine.replace("\n", "").split(" ");
    let handledCommandLine;

    if(!SUPPORTED_ENTITY_TYPES.classType === command[1]) {
        throw ERROR_UNRECOGNISED_ENTITY_TYPE;
    }

    switch(command[0].toLowerCase()) {
        case "adicionar":
            handledCommandLine = addCommandHandler(command);
            break;

        default:
            throw ERROR_UNRECOGNISED_COMMAND;
    }

    return handledCommandLine;
}

function addCommandHandler(command) {
    const handledAddCommand = {
        id: uuidv4(),
        type: "add",
        entityType: upperCaseFirstLetter(command[1])
    }

    switch(command[1].toLowerCase()) {
        case SUPPORTED_ENTITY_TYPES.classType:
            handledAddCommand["entityName"] = upperCaseFirstLetter(command[2]);

            // Possible Arguments
            handledAddCommand["attributes"] = [];
            if(command.indexOf("-a") !== -1) {
                handledAddCommand.attributes = addArgumentsHandler(command, command.indexOf("-a"));
            }
            handledAddCommand["methods"] = [];
            if(command.indexOf("-m") !== -1) {
                handledAddCommand.methods = addArgumentsHandler(command, command.indexOf("-m"));
            }
            break;
            
        default:
            throw ERROR_COMMAND_SYNTAX;
    }

    return handledAddCommand;
}

function addArgumentsHandler(command, argumentIndex) {
    const addArguments = []

    for(let i = argumentIndex + 1; command[i] && command[i].includes(":"); i++) {
        const addArgument = command[i].split(":");
        
        switch(addArgument.length) {
            case 3:
                if(SUPPORTED_VISIBILITY.includes(addArgument[0])) {
                    addArguments.push({
                        visibility: addArgument[0],
                        type: addArgument[1],
                        name: addArgument[2]
                    });
                } else {
                    throw ERROR_COMMAND_SYNTAX;
                }
                break;

            case 2:
                addArguments.arguments.push({
                    visibility: SUPPORTED_VISIBILITY[0],
                    type: addArgument[0],
                    name: addArgument[1]
                });
                break;
            
            default:
                throw ERROR_COMMAND_SYNTAX;
        }
    }

    return addArguments;
}