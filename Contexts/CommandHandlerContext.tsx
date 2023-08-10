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
    
                case SUPPORTED_COMMANDS.read === commandType:
                    return readEntityHandler(commandArray, entityType);
    
                case SUPPORTED_COMMANDS.remove === commandType:
                    return removeEntityHandler(commandArray, entityType);
    
                case SUPPORTED_COMMANDS.alter === commandType:
                    return alterEntityHandler(commandArray, entityType);
    
                // If command is not found
                default:
                    const errorFeedback = new Feedback();
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.unrecognized_command.part_1"));
                    errorFeedback.addSnippet(new StringSnippet(commandType ? commandType : ""));
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.unrecognized_command.part_2"));

                    throw new AppError(errorFeedback);
            }
        } catch(error) {
            if(error instanceof AppError) {
                return error.getMessage();
            }
            
            error instanceof Error ? console.log(error.message) : console.log(translate("errorunknown_error_thrown"));
            return translate("error.unhandled_error");
        }
    }

    const value = {
        getFeedBack,
    }

    function createEntityHandler(commandArray: string[], entityType: string | undefined) {
        const errorFeedback = new Feedback();

        if((entityType === undefined) || (entityType === "")) {
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.error.entity_type_missing_on_creation"));
            
            throw new AppError(errorFeedback);
        } else {
            switch(true) {
                case SUPPORTED_ENTITY_TYPES.classifier.includes(entityType):
                    const classifierCreationFeedback = diagram.createClassifierByCommand(entityType, commandArray);
                    setDiagram(diagram);
                    return classifierCreationFeedback.toString();
    
                case SUPPORTED_ENTITY_TYPES.relationship === entityType:
                    const relationshipCreationFeedback = diagram.createRelationshipByCommand(commandArray);
                    setDiagram(diagram);
                    return relationshipCreationFeedback.toString();
        
                default:
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.error.unrecognized_entity_type.part_1"));
                    errorFeedback.addSnippet(new StringSnippet(entityType));
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.error.unrecognized_entity_type.part_2"));
                    
                    throw new AppError(errorFeedback);
            }

        }
    }

    function readEntityHandler(commandArray: string[], entityType: string | undefined) {
        const errorFeedback = new Feedback();

        if((entityType === undefined) || (entityType === "")) {
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.read.error.entity_type_missing_on_read"));
            
            throw new AppError(errorFeedback);
        } else {
            switch(true) {
                case SUPPORTED_ENTITY_TYPES.diagram === entityType:
                    const diagramFeedback = diagram.readDiagram();
                    return diagramFeedback.toString();

                case SUPPORTED_ENTITY_TYPES.classifier.includes(entityType):
                    const classifierReadfeedback = diagram.readClassifierByCommand(commandArray);
                    setDiagram(diagram);
                    return classifierReadfeedback.toString();
                
                //case SUPPORTED_ENTITY_TYPES.relationship === entityType:
                //    return ReadRelationshipCommandHandler(commandArray, relationshipEntities, classEntities);
                
                default:
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.read.error.unrecognized_entity_type.part_1"));
                    errorFeedback.addSnippet(new StringSnippet(entityType));
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.read.error.unrecognized_entity_type.part_2"));
                    
                    throw new AppError(errorFeedback);
            }
        }
    }

    function removeEntityHandler(commandArray: string[], entityType: string | undefined) {
        const errorFeedback = new Feedback();

        if((entityType === undefined) || (entityType === "")) {
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.read.error.entity_type_missing_on_remove"));
            
            throw new AppError(errorFeedback);
        } else {
            switch(true) {
                case SUPPORTED_ENTITY_TYPES.classifier.includes(entityType):
                    const removeClassifierFeedback = diagram.removeClassifierByCommand(commandArray);
                    setDiagram(diagram);
                    return removeClassifierFeedback.toString();

                case SUPPORTED_ENTITY_TYPES.relationship === entityType:
                    const removeRelationshipFeedback = diagram.removeRelatioshipByCommand(commandArray);
                    setDiagram(diagram);
                    return removeRelationshipFeedback.toString();
                
                    /*const handledRelationshipEntities = RemoveRelationshipCommandHandler(commandArray, relationshipEntities);
        
                    setRelationshipEntities(handledRelationshipEntities);
        
                    return translate("command.remove.relationship.success_feedback.part1") + commandArray[0] + translate("command.remove.relationship.success_feedback.part2");*/
                    
                default:
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.remove.error.unrecognized_entity_type.part_1"));
                    errorFeedback.addSnippet(new StringSnippet(entityType));
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.remove.error.unrecognized_entity_type.part_2"));
                    
                    throw new AppError(errorFeedback);
            }
        }
    }

    function alterEntityHandler(commandArray: string[], entityType: string | undefined) {
        const errorFeedback = new Feedback();

        if((entityType === undefined) || (entityType === "")) {
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.read.error.entity_type_missing_on_alteration"));
            
            throw new AppError(errorFeedback);
        } else {
            switch(true) {
                case SUPPORTED_ENTITY_TYPES.classifier.includes(entityType):
                    const alterClassifierFeedback = diagram.alterClassifierByCommand(commandArray);
                    setDiagram(diagram);
                    return alterClassifierFeedback.toString();

                /*case SUPPORTED_ENTITY_TYPES.relationship.includes(entityType):
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
                        translate("command.alter.relationship.success_feedback.part2");*/

                default:
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.error.unrecognized_entity_type.part_1"));
                    errorFeedback.addSnippet(new StringSnippet(entityType));
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.error.unrecognized_entity_type.part_2"));
                    
                    throw new AppError(errorFeedback);
            }
        }
    }

    return (
        <CommandHandlerContext.Provider value={ value }>
            { children }
        </CommandHandlerContext.Provider>
    );
}

export default CommandHandlerContext;
