import { v4 as uuidv4 } from "uuid";
import { createContext, useState } from "react";
import createClassCommandHandler from "../Components/Handlers/ClassEnityHandlers/CreateClassCommandHandler";
import { SUPPORTED_COMMANDS, SUPPORTED_ENTITY_TYPES } from "../Utils/SupportedKeyWords";
import { ERROR_CLASS_ALREADY_EXISTS, ERROR_COMMAND_SYNTAX, ERROR_UNRECOGNISED_ENTITY_TYPE } from "../Utils/Errors";
import readClassCommandHandler from "../Components/Handlers/ClassEnityHandlers/ReadClassCommandHandler";
import { upperCaseFirstLetter } from "../Components/Handlers/UtilityHandlers/StringHandler";

const CommandHandlerContext = createContext();

export function CommandHandlerProvider({ children }) {
    const [classEntities, setClassEntities] = useState([])

    const commandHandler = (commandLine) => {
        const commandArray = commandLine.replace("\n", "").replaceAll(",", "").split(" ");
        const commandType = commandArray.shift().toLowerCase();
        const entityType = commandArray.shift().toLowerCase();
        
        switch(true) {
            case SUPPORTED_COMMANDS.create.includes(commandType):
                return createEntityHandler(commandArray, entityType);

            case SUPPORTED_COMMANDS.read.includes(commandType, entityType):
                return readEntityHandler(commandArray);

            default:
                throw ERROR_COMMAND_SYNTAX;
        }
        
    };

    function createEntityHandler(commandArray, entityType) {
        const newEntity = {
            id: uuidv4()
        };

        switch(true) {
            case SUPPORTED_ENTITY_TYPES.class.includes(entityType):
                const classAlreadyExists = classEntities.find((classEntity) => classEntity.entityName === upperCaseFirstLetter(commandArray[0]));

                if(classAlreadyExists) {
                    throw ERROR_CLASS_ALREADY_EXISTS;
                }

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

    function readEntityHandler(commandArray, entityType) {
        switch(true) {
            case SUPPORTED_ENTITY_TYPES.class.includes(entityType):
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
