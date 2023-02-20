import { v4 as uuidv4 } from "uuid";
import { createContext, useState } from "react";
import { SUPPORTED_COMMANDS, SUPPORTED_ENTITY_TYPES, SUPPORTED_RELATIONSHIP_TYPES } from "../Utils/SupportedKeyWords";
import readClassCommandHandler from "../Handlers/ClassEnityHandlers/ReadClassCommandHandler";
import { ERROR_CLASS_DOES_NOT_EXISTS, ERROR_UNRECOGNISED_ENTITY_TYPE } from "../Utils/Errors";
import CreateClassCommandHandler from "../Handlers/ClassEnityHandlers/CreateClassCommandHandler";
import alterClassCommandHandler from "../Handlers/ClassEnityHandlers/AlterClassCommandHandler";
import { upperCaseFirstLetter } from "../Handlers/UtilityHandlers/StringHandler";
import { nameAlreadyInUse } from "../Handlers/UtilityHandlers/EntityHandler";
import removeClassCommandHandler from "../Handlers/ClassEnityHandlers/RemoveClassCommandHandler";
import CreateRelationshipCommandHandler from "../Handlers/RelationshipEntityHandlers/CreateRelaionshipCommandHandler";
import AlterRelationshipCommandHandler from "../Handlers/RelationshipEntityHandlers/AlterRelationshipCommandHandler";
import readRelationshipCommandHandler from "../Handlers/RelationshipEntityHandlers/ReadRelationshipCommandHandler";
import removeRelationshipCommandHandler from "../Handlers/RelationshipEntityHandlers/removeRelationshipCommandHandler";

import { useTranslation } from 'react-i18next'

const CommandHandlerContext = createContext();

export function CommandHandlerProvider({ children }) {
    const [classEntities, setClassEntities] = useState([])
    const [relationshipEntities, setRelationshipEntities] = useState([])
    const { t } = useTranslation();

    const commandHandler = (commandLine) => {
        const commandArray = commandLine.replace("\n", "").replaceAll(",", "").split(" ");

        if(commandArray.length < 3) {
            throw t("error.command_syntax");
        }

        const commandType = commandArray.shift().toLowerCase();
        const entityType = commandArray.shift().toLowerCase();
        
        switch(true) {
            case SUPPORTED_COMMANDS.create.includes(commandType):
                return createEntityHandler(commandArray, entityType);

            case SUPPORTED_COMMANDS.read.includes(commandType):
                return readEntityHandler(commandArray, entityType);

            case SUPPORTED_COMMANDS.remove.includes(commandType):
                return removeEntityHandler(commandArray, entityType);

            case SUPPORTED_COMMANDS.alter.includes(commandType):
                return alterEntityHandler(commandArray, entityType);

            default:
                throw t("error.command_syntax");
        }
        
    };

    function createEntityHandler(commandArray, entityType) {
        const newEntity = {
            id: uuidv4()
        };

        switch(true) {
            case SUPPORTED_ENTITY_TYPES.class.includes(entityType):
                nameAlreadyInUse(classEntities, upperCaseFirstLetter(commandArray[0].toLowerCase()));

                Object.assign(newEntity, CreateClassCommandHandler(commandArray));

                setClassEntities(prevClassEntities => {
                    return [
                        ...prevClassEntities,
                        newEntity
                    ];
                });
                
                return t("commad.create.class.success_feedback.part1") + newEntity.name + t("commad.create.class.success_feedback.part2");

            case SUPPORTED_ENTITY_TYPES.relationship.includes(entityType):

                Object.assign(newEntity, CreateRelationshipCommandHandler(commandArray, classEntities));

                setRelationshipEntities(prevRealtionshipEntities => {
                    return [
                        ...prevRealtionshipEntities,
                        newEntity
                    ];
                });

                return t("commad.create.relationship.success_feedback.part1") +
                SUPPORTED_RELATIONSHIP_TYPES[newEntity.relationshipType][1] +
                t("commad.create.relationship.success_feedback.part2") +
                newEntity.primaryClassName +
                t("commad.create.relationship.success_feedback.part3") +
                newEntity.secondaryClassName +
                t("commad.create.relationship.success_feedback.part4") +
                newEntity.name +
                t("commad.create.relationship.success_feedback.part5");
    
            default:
                throw t("error.unrecognised_type");
        }
    }

    function readEntityHandler(commandArray, entityType) {
        switch(true) {
            case SUPPORTED_ENTITY_TYPES.class.includes(entityType):
                return readClassCommandHandler(commandArray, classEntities);

            case SUPPORTED_ENTITY_TYPES.relationship.includes(entityType):
                return readRelationshipCommandHandler(commandArray, relationshipEntities, classEntities);
                
            default:
                throw ERROR_UNRECOGNISED_ENTITY_TYPE;
        }
    }

    function removeEntityHandler(commandArray, entityType) {
        switch(true) {
            case SUPPORTED_ENTITY_TYPES.class.includes(entityType):
                const handledClassEntities = removeClassCommandHandler(commandArray, classEntities);

                setClassEntities(handledClassEntities);

                return "A classe " + commandArray[0] + " foi removida com sucesso!";

            case SUPPORTED_ENTITY_TYPES.relationship.includes(entityType):
                const handledRelationshipEntities = removeRelationshipCommandHandler(commandArray, relationshipEntities);
    
                setRelationshipEntities(handledRelationshipEntities);
    
                return "A relação " + commandArray[0] + " foi removida com sucesso!";
                
            default:
                throw ERROR_UNRECOGNISED_ENTITY_TYPE;
        }
    }

    function alterEntityHandler(commandArray, entityType) {
        switch(true) {
            case SUPPORTED_ENTITY_TYPES.class.includes(entityType):
                const alteringClass = classEntities.find((classEntity) => classEntity.name === upperCaseFirstLetter(commandArray[0]));

                if(!alteringClass) {
                    throw ERROR_CLASS_DOES_NOT_EXISTS;
                }

                const renameIndex = commandArray.indexOf("-n");
                if(renameIndex !== -1) {
                    nameAlreadyInUse(classEntities, upperCaseFirstLetter(commandArray[renameIndex + 1].toLowerCase()));
                }

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
                
                return "A classe " + alteringClass.name + " foi alterada com sucesso";

            case SUPPORTED_ENTITY_TYPES.relationship.includes(entityType):
                const relationshipName = commandArray.shift();
                const alteringRelationship = relationshipEntities.find((relationship) => relationship.name === relationshipName);

                const alteredRelationship = AlterRelationshipCommandHandler(commandArray, alteringRelationship, classEntities);

                setRelationshipEntities(prevRelationshipEntities => {
                    const newRelationshipEntities = prevRelationshipEntities.map((prevRelationshipEntity) => {
                        if(prevRelationshipEntity === alteringRelationship) {
                            prevRelationshipEntity = alteredRelationship;
                        }

                        return prevRelationshipEntity;
                    })

                    return newRelationshipEntities;
                });

                return "A relação " +
                    relationshipName +
                    " for alterada com sucesso!";

            default:
                throw ERROR_UNRECOGNISED_ENTITY_TYPE;
        }
    }

    return (
        <CommandHandlerContext.Provider value={{ commandHandler, classEntities, relationshipEntities }}>
            { children }
        </CommandHandlerContext.Provider>
    );
}

export default CommandHandlerContext;
