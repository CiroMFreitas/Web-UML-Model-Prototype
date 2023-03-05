import { v4 as uuidv4 } from "uuid";
import { createContext, useState } from "react";
import { useTranslation } from 'react-i18next';

import { SUPPORTED_COMMANDS, SUPPORTED_ENTITY_TYPES, SUPPORTED_RELATIONSHIP_TYPES } from "../Utils/SupportedKeyWords";
import { upperCaseFirstLetter } from "../Handlers/UtilityHandlers/StringHandler";
import { nameAlreadyInUse } from "../Handlers/UtilityHandlers/EntityHandler";

import CreateClassCommandHandler from "../Handlers/ClassEnityHandlers/CreateClassCommandHandler";
import ReadClassCommandHandler from "../Handlers/ClassEnityHandlers/ReadClassCommandHandler";
import alterClassCommandHandler from "../Handlers/ClassEnityHandlers/AlterClassCommandHandler";
import RemoveClassCommandHandler from "../Handlers/ClassEnityHandlers/RemoveClassCommandHandler";

import CreateRelationshipCommandHandler from "../Handlers/RelationshipEntityHandlers/CreateRelaionshipCommandHandler";
import AlterRelationshipCommandHandler from "../Handlers/RelationshipEntityHandlers/AlterRelationshipCommandHandler";
import ReadRelationshipCommandHandler from "../Handlers/RelationshipEntityHandlers/ReadRelationshipCommandHandler";
import RemoveRelationshipCommandHandler from "../Handlers/RelationshipEntityHandlers/RemoveRelationshipCommandHandler";

const CommandHandlerContext = createContext();

export function CommandHandlerProvider({ children }) {
    const [classEntities, setClassEntities] = useState([]);
    const [relationshipEntities, setRelationshipEntities] = useState([]);
    const { t } = useTranslation();

    const commandHandler = (commandLine) => {
        const commandArray = commandLine.replace("\n", "").replaceAll(",", "").split(" ");

        const commandType = commandArray.shift().toLowerCase();
        const entityType = commandArray.shift().toLowerCase();
        
        try {
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
                    throw "error.unrecognized_command";
            }
        } catch(error) {
            throw t(error)
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
                
                return t("command.create.class.success_feedback.part1") + newEntity.name + t("command.create.class.success_feedback.part2");

            case SUPPORTED_ENTITY_TYPES.relationship.includes(entityType):

                Object.assign(newEntity, CreateRelationshipCommandHandler(commandArray, classEntities));

                setRelationshipEntities(prevRealtionshipEntities => {
                    return [
                        ...prevRealtionshipEntities,
                        newEntity
                    ];
                });

                return t("command.create.relationship.success_feedback.part1") +
                SUPPORTED_RELATIONSHIP_TYPES[newEntity.relationshipType][1] +
                t("command.create.relationship.success_feedback.part2") +
                newEntity.primaryClassName +
                t("command.create.relationship.success_feedback.part3") +
                newEntity.secondaryClassName +
                t("command.create.relationship.success_feedback.part4") +
                newEntity.name +
                t("command.create.relationship.success_feedback.part5");
    
            default:
                throw "error.unrecognized_type";
        }
    }

    function readEntityHandler(commandArray, entityType) {
        switch(true) {
            case SUPPORTED_ENTITY_TYPES.class.includes(entityType):
                return ReadClassCommandHandler(commandArray, classEntities);

            case SUPPORTED_ENTITY_TYPES.relationship.includes(entityType):
                return ReadRelationshipCommandHandler(commandArray, relationshipEntities, classEntities);
                
            default:
                throw t("error.unrecognised_type");
        }
    }

    function removeEntityHandler(commandArray, entityType) {
        switch(true) {
            case SUPPORTED_ENTITY_TYPES.class.includes(entityType):
                const handledClassEntities = RemoveClassCommandHandler(commandArray, classEntities);

                setClassEntities(handledClassEntities);

                return t("command.remove.class.success_feedback.part1") + commandArray[0] + t("command.remove.class.success_feedback.part2");

            case SUPPORTED_ENTITY_TYPES.relationship.includes(entityType):
                const handledRelationshipEntities = RemoveRelationshipCommandHandler(commandArray, relationshipEntities);
    
                setRelationshipEntities(handledRelationshipEntities);
    
                return t("command.remove.relationship.success_feedback.part1") + commandArray[0] + t("command.remove.relationship.success_feedback.part2");
                
            default:
                throw t("error.unrecognised_type");
        }
    }

    function alterEntityHandler(commandArray, entityType) {
        switch(true) {
            case SUPPORTED_ENTITY_TYPES.class.includes(entityType):
                const alteringClass = classEntities.find((classEntity) => classEntity.name === upperCaseFirstLetter(commandArray[0]));

                if(!alteringClass) {
                    throw t("error.class_not_found");
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
                
                return t("command.alter.class.success_feedback.part1") + alteringClass.name + t("command.alter.class.success_feedback.part2");

            case SUPPORTED_ENTITY_TYPES.relationship.includes(entityType):
                const relationshipName = commandArray.shift();
                const alteringRelationship = relationshipEntities.find((relationship) => relationship.name === relationshipName);

                if(!alteringRelationship) {
                    throw t("error.relationship_not_found");
                }

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

                return t("command.alter.relationship.success_feedback.part1") +
                    relationshipName +
                    t("command.alter.relationship.success_feedback.part2");

            default:
                throw t("error.unrecognised_type");
        }
    }

    return (
        <CommandHandlerContext.Provider value={{ commandHandler, classEntities, relationshipEntities }}>
            { children }
        </CommandHandlerContext.Provider>
    );
}

export default CommandHandlerContext;
