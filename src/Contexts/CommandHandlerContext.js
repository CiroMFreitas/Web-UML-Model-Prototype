import { v4 as uuidv4 } from "uuid";
import { createContext, useState } from "react";
import { SUPPORTED_COMMANDS, SUPPORTED_ENTITY_TYPES } from "../Utils/SupportedKeyWords";
import { ERROR_CLASS_DOES_NOT_EXISTS, ERROR_COMMAND_SYNTAX, ERROR_UNRECOGNISED_ENTITY_TYPE } from "../Utils/Errors";
import createClassCommandHandler from "../Handlers/ClassEnityHandlers/CreateClassCommandHandler";
import readClassCommandHandler from "../Handlers/ClassEnityHandlers/ReadClassCommandHandler";
import alterClassCommandHandler from "../Handlers/ClassEnityHandlers/AlterClassCommandHandler";
import { upperCaseFirstLetter } from "../Handlers/UtilityHandlers/StringHandler";
import { entityNameAlreadyInUse } from "../Handlers/UtilityHandlers/EntityHandler";

const CommandHandlerContext = createContext();

export function CommandHandlerProvider({ children }) {
    const [classEntities, setClassEntities] = useState([])

    const commandHandler = (commandLine) => {
        const commandArray = commandLine.replace("\n", "").replaceAll(",", "").split(" ");

        if(commandArray.length < 3) {
            throw ERROR_COMMAND_SYNTAX;
        }

        const commandType = commandArray.shift().toLowerCase();
        const entityType = commandArray.shift().toLowerCase();
        
        switch(true) {
            case SUPPORTED_COMMANDS.create.includes(commandType):
                return createEntityHandler(commandArray, entityType);

            case SUPPORTED_COMMANDS.read.includes(commandType):
                return readEntityHandler(commandArray, entityType);

            case SUPPORTED_COMMANDS.alter.includes(commandType):
                return alterEntityHandler(commandArray, entityType)

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
                entityNameAlreadyInUse(classEntities, upperCaseFirstLetter(commandArray[0].toLowerCase()));

                Object.assign(newEntity, createClassCommandHandler(commandArray));

                setClassEntities(prevClassEntities => {
                    return [
                        ...prevClassEntities,
                        newEntity
                    ];
                });
                
                return "A classe " + newEntity.entityName + " foi criada com sucesso";
    
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

    function alterEntityHandler(commandArray, entityType) {
        switch(true) {
            case SUPPORTED_ENTITY_TYPES.class.includes(entityType):
                const alteringClass = classEntities.find((classEntity) => classEntity.entityName === upperCaseFirstLetter(commandArray[0]));

                if(!alteringClass) {
                    throw ERROR_CLASS_DOES_NOT_EXISTS;
                }

                const renameIndex = commandArray.indexOf("-n");
                entityNameAlreadyInUse(classEntities, upperCaseFirstLetter(commandArray[renameIndex + 1].toLowerCase()));

                const alteredEntity = alterClassCommandHandler(commandArray, alteringClass, renameIndex);

                setClassEntities(prevClassEntities => {
                    const newClassEntities = prevClassEntities.map((prevClassEntity) => {
                        if(prevClassEntity === alteringClass) {
                            prevClassEntity = alteredEntity;
                        }

                        return prevClassEntity;
                    })

                    return newClassEntities;
                });

                
                
                return "A classe " + alteringClass.entityName + " foi alterada com sucesso";
                
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
