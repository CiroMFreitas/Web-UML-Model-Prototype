// Supported Key Words
const SUPPORTED_ENTITY_TYPES = [
    "classe"
];
const SUPPORTED_VISIBILITY = [
    "public",
    "protected",
    "private"
]

// ERRORS
const UNRECOGNISED_COMMAND = "Comando não reconhecido!";
const UNRECOGNISED_ENTITY_TYPE = "Entidade não reconhecida!";
const COMMAND_SYNTAX_ERROR = "Erro de sintaxe no commando!";

export default function classDiagramCommandsHandler(commandLine) {
    const command = commandLine.replace("\n", "").split(" ");
    let handledCommandLine;

    if(!SUPPORTED_ENTITY_TYPES.includes(command[1])) {
        throw UNRECOGNISED_ENTITY_TYPE;
    }

    switch(command[0].toLowerCase()) {
        case "adicionar":
            handledCommandLine = addCommandHandler(command);
            break;

        default:
            throw UNRECOGNISED_COMMAND;
    }

    return handledCommandLine;
}

function addCommandHandler(command) {
    const handledAddCommand = {
        type: "add",
        entity: command[1],
        entityName: command[2],
        arguments: []
    }

    // Possible Arguments
    if(command.indexOf("-a") !== -1) {
        handledAddCommand.arguments.push(addArgumentsHandler(command, command.indexOf("-a")));
    }
    if(command.indexOf("-m") !== -1) {
        handledAddCommand.arguments.push(addArgumentsHandler(command, command.indexOf("-m")));
    }

    return handledAddCommand;
}

function addArgumentsHandler(command, argumentIndex) {
    const addArguments = {
        type: command[argumentIndex],
        arguments: []
    }

    for(let i = argumentIndex + 1; !command[i] && command[i].includes(":"); i++) {
        const addArgument = command[i].split(":");
        
        switch(addArgument.length) {
            case 3:
                if(SUPPORTED_VISIBILITY.includes(addArgument[0])) {
                    addArguments.arguments.push({
                        visibility: addArgument[0],
                        type: addArgument[1],
                        name: addArgument[2]
                    });
                } else {
                    throw COMMAND_SYNTAX_ERROR;
                }
                break;

            case 2:
                addArguments.arguments.push({
                    visibility: "public",
                    type: addArgument[0],
                    name: addArgument[1]
                });
                break;
            
            default:
                throw COMMAND_SYNTAX_ERROR;
        }
    }

    return addArguments;
}