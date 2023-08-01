import { createContext, useContext, useState } from "react";
import { translate } from '../i18n'

import { SUPPORTED_COMMANDS, SUPPORTED_ENTITY_TYPES } from "../public/Utils/SupportedKeyWords";

import Diagram from "../Models/Diagram";
import AppError from "../Models/AppError";
import Feedback from "../Models/Feedback";
import LocalizationSnippet from "../Models/LocalizationSnippet";
import StringSnippet from "../Models/StringSnippet";

// Setting context up.
type commandHandlerType = {
    getFeedBack: (commandLine: string) => string;
}

const commandHandlerDefaultValues: commandHandlerType = {
    getFeedBack: () => { return ""; }
}

const CommandHandlerContext = createContext<commandHandlerType>(commandHandlerDefaultValues);

export function useCommandHandler() {
    return useContext(CommandHandlerContext);
}

interface IProps {
    children: React.ReactNode;
}

export const CommandHandlerProvider = ({ children }: IProps ) => {
    // Will hold diagram data for both feedback propouses and canvas drawing.
    const [diagram, setDiagram] = useState(new Diagram());
    const errorFeedback = new Feedback()
    
    // Sends feedback to user.
    const getFeedBack = (commandLine: string) => {
        try {
            // Breaks command line into an array.
            const commandArray = commandLine.replace("\n", "").replaceAll(",", "").split(" ");

            // Gets command type, command type will only be undefined if a blank string is sent here.
            const commandType = commandArray?.shift()?.toLowerCase();

            // Gets entity type
            const entityType = commandArray?.shift()?.toLowerCase();

            switch(true) {
                case SUPPORTED_COMMANDS.create === commandType:
                    return createEntityHandler(commandArray, entityType);
    
                //case SUPPORTED_COMMANDS.read.includes(commandType):
                //    return readEntityHandler(commandArray, entityType);
    
                //case SUPPORTED_COMMANDS.remove.includes(commandType):
                //    return removeEntityHandler(commandArray, entityType);
    
                //case SUPPORTED_COMMANDS.alter.includes(commandType):
                //    return alterEntityHandler(commandArray, entityType);
    
                default:
                    errorFeedback.addSnippet(new LocalizationSnippet("error.unrecognized_command.part_1"));
                    errorFeedback.addSnippet(new StringSnippet(commandType ? commandType : ""));
                    errorFeedback.addSnippet(new LocalizationSnippet("error.unrecognized_command.part_2"));

                    throw new AppError(errorFeedback);
            }
        } catch(error) {
            if(error instanceof AppError) {
                return error.getMessage();
            } else {
                error instanceof Error ? console.log(error.message) : console.log(translate("error.unknown_error_thrown"));
                return translate("error.unhandled_error");
            }
        }
    }

    const value = {
        getFeedBack,
    }

    function createEntityHandler(commandArray: string[], entityType: string | undefined) {
        if(typeof entityType === "undefined") {
            errorFeedback.addSnippet(new LocalizationSnippet("error.entity_type_missing_on_creation"));
            
            throw new AppError(errorFeedback);
        } else {
            switch(true) {
                case SUPPORTED_ENTITY_TYPES.classifier.includes(entityType):
                    //if(diagram.isClassifierNameInUse(commandArray[0].toLowerCase())) {
                        const classifierCreationFeedback = diagram.createClassifier(entityType, commandArray);
    
                        setDiagram(diagram);
    
                        return classifierCreationFeedback.toString();
                        //translate("command.create.class.success_feedback.part1") + "newEntity.name" + translate("command.create.class.success_feedback.part2");
                    //} else {
                    //    return commandArray[0] + translate("error.classifier_name_already_in_use");
                    //}
    
                /*case SUPPORTED_ENTITY_TYPES.relationship === entityType:
    
                    Object.assign(newEntity, CreateRelationshipCommandHandler(commandArray, classEntities));
    
                    setRelationshipEntities(prevRealtionshipEntities => {
                        return [
                            ...prevRealtionshipEntities,
                            newEntity
                        ];
                    });
    
                    const primaryClass = classEntities.find((primaryClass) => primaryClass.id === newEntity.primaryClassId);
                    const secondaryClass = classEntities.find((secondaryClassName) => secondaryClassName.id === newEntity.secondaryClassId);
    
                    return translate("command.create.relationship.success_feedback.part1") +
                    translate("entities.relationship.types." + newEntity.relationshipType) +
                    translate("command.create.relationship.success_feedback.part2") +
                    primaryClass.name +
                    translate("command.create.relationship.success_feedback.part3") +
                    secondaryClass.name +
                    translate("command.create.relationship.success_feedback.part4") +
                    newEntity.name +
                    translate("command.create.relationship.success_feedback.part5");*/
        
                default:
                    errorFeedback.addSnippet(new LocalizationSnippet("error.unrecognized_entity_type.part1"));
                    errorFeedback.addSnippet(new StringSnippet(entityType));
                    errorFeedback.addSnippet(new LocalizationSnippet("error.unrecognized_entity_type.part2"));
                    
                    throw new AppError(errorFeedback);
            }

        }
    }

    /*function readEntityHandler(commandArray, entityType) {
        var feedback = [];

        switch(true) {
            case SUPPORTED_ENTITY_TYPES.diagram === entityType:
                feedback = ReadDiagramCommandHandler(classEntities);

            case SUPPORTED_ENTITY_TYPES.class === entityType:
                feedback = ReadClassCommandHandler(commandArray, classEntities, relationshipEntities);
                
                break;
            
            case SUPPORTED_ENTITY_TYPES.relationship === entityType:
                return ReadRelationshipCommandHandler(commandArray, relationshipEntities, classEntities);
            
            default:
                throw translate("error.unrecognised_type");
        }

        const message = feedback.map((snippet) => {
            if(snippet.type === "locale") {
                return translate(snippet.content);
            } else {
                return snippet.content;
            }
        });

        return message.toString().replaceAll(",", "").replaceAll(";", ",");
    }

    function removeEntityHandler(commandArray, entityType) {
        switch(true) {
            case SUPPORTED_ENTITY_TYPES.class === entityType:
                const handledClassEntities = RemoveClassCommandHandler(commandArray, classEntities);

                setClassEntities(handledClassEntities);

                return translate("command.remove.class.success_feedback.part1") + commandArray[0] + translate("command.remove.class.success_feedback.part2");

            case SUPPORTED_ENTITY_TYPES.relationship === entityType:
                const handledRelationshipEntities = RemoveRelationshipCommandHandler(commandArray, relationshipEntities);
    
                setRelationshipEntities(handledRelationshipEntities);
    
                return translate("command.remove.relationship.success_feedback.part1") + commandArray[0] + translate("command.remove.relationship.success_feedback.part2");
                
            default:
                throw translate("error.unrecognised_type");
        }
    }

    function alterEntityHandler(commandArray, entityType) {
        switch(true) {
            case SUPPORTED_ENTITY_TYPES.class.includes(entityType):
                const alteringClass = classEntities.find((classEntity) => classEntity.name === upperCaseFirstLetter(commandArray[0]));

                if(!alteringClass) {
                    throw translate("error.class_not_found");
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
                
                return translate("command.alter.class.success_feedback.part1") + alteringClass.name + translate("command.alter.class.success_feedback.part2");

            case SUPPORTED_ENTITY_TYPES.relationship.includes(entityType):
                const relationshipName = commandArray.shiftranslate();
                const alteringRelationship = relationshipEntities.find((relationship) => relationship.name === relationshipName);

                if(!alteringRelationship) {
                    throw translate("error.relationship_not_found");
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

                return translate("command.alter.relationship.success_feedback.part1") +
                    relationshipName +
                    translate("command.alter.relationship.success_feedback.part2");

            default:
                throw translate("error.unrecognised_type");
        }
    }*/

    return (
        <CommandHandlerContext.Provider value={ value }>
            { children }
        </CommandHandlerContext.Provider>
    );
}

export default CommandHandlerContext;
