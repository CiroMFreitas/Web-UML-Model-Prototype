import { v4 as uuidv4 } from "uuid";
import { createContext, useState } from "react";
import createClassCommandHandler from "../Components/Handlers/ClassEnityHandlers/CreateClassCommandHandler";
import { SUPPORTED_COMMANDS, SUPPORTED_ENTITY_TYPES } from "../Utils/SupportedKeyWords";
import { ERROR_COMMAND_SYNTAX, ERROR_UNRECOGNISED_ENTITY_TYPE } from "../Utils/Errors";
import readClassCommandHandler from "../Components/Handlers/ClassEnityHandlers/ReadClassCommandHandler";

const CommandHandlerContext = createContext();

export function CommandHandlerProvider({ children }) {
    const [classEntities, setClassEntities] = useState([])

    const commandHandler = (commandLine) => {
        const commandArray = commandLine.replace("\n", "").replaceAll(",", "").split(" ");
        
        switch(true) {
            case SUPPORTED_COMMANDS.create.includes(commandArray[0].toLowerCase()):
                return createEntityHandler(commandArray);

            case SUPPORTED_COMMANDS.read.includes(commandArray[0].toLowerCase()):
                return readEntityHandler(commandArray);

            default:
                throw ERROR_COMMAND_SYNTAX;
        }
        
    };

    function createEntityHandler(commandArray) {
        const newEntity = {
            id: uuidv4()
        };

        switch(true) {
            case SUPPORTED_ENTITY_TYPES.class.includes(commandArray[1].toLowerCase()):
                Object.assign(newEntity, createClassCommandHandler(commandArray));

                setClassEntities(prevClassEntities => {
                    return [
                        ...prevClassEntities,
                        newEntity
                    ];
                });
                
                return "A classe " + newEntity.entityName + " foi criada com sucesso!";
    
            default:
                throw ERROR_UNRECOGNISED_ENTITY_TYPE;
        }
    }

    function readEntityHandler(commandArray) {        
        switch(true) {
            case SUPPORTED_ENTITY_TYPES.class.includes(commandArray[1].toLowerCase()):
                return readClassCommandHandler(commandArray, classEntities);
                
            default:
                throw ERROR_UNRECOGNISED_ENTITY_TYPE;
        }
    }

    return (
        <CommandHandlerContext.Provider value={{ classEntities, commandHandler }}>
            { children }
        </CommandHandlerContext.Provider>
    );
}

export default CommandHandlerContext;
