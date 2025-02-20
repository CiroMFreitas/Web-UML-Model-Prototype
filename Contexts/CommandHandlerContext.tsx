import { createContext, useContext, useState } from "react";
import { translate } from '../i18n'

import { SUPPORTED_COMMANDS, SUPPORTED_ENTITY_TYPES } from "../public/Utils/SupportedKeyWords";

import Diagram from "../Models/Diagram";
import AppError from "../Models/AppError";
import Feedback from "../Models/Feedback";
import LocalizationSnippet from "../Models/LocalizationSnippet";
import StringSnippet from "../Models/StringSnippet";
import ReadCommandInterpreter from "../Controller/ReadCommandInterpreter";
import AlterCommandInterpreter from "../Controller/AlterCommandInterpreter";
import CreateCommandInterpreter from "../Controller/CreateCommandInterpreter";
import RemoveCommandInterpreter from "../Controller/RemoveCommandInterpreter";
import ImportCommandInterpreter from "../Controller/ImportCommandInterpreter";
import ISaveDiagramReturnDTO from "../public/DTO/ISaveDiagramReturnDTO";
import LoadFileInterpreter from "../Controller/LoadFileInterpreter";

// Setting context up.
type commandHandlerType = {
    getFeedBack: (commandLine: string[]) => string;
    saveDiagram: () => ISaveDiagramReturnDTO;
}

const commandHandlerDefaultValues: commandHandlerType = {
    getFeedBack: () => { return ""; },
    saveDiagram: () => {
        return {
            saveFeedback: "",
            diagramJSONFile: new Blob()
        };
    }
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
    const getFeedBack = (commandLine: string[]) => {
        try {
            // Gets command type, command type will only be undefined if a blank string is sent here.
            const commandArgument = commandLine?.shift()?.toLowerCase();

            // Gets he following argument
            const followingArgument = commandLine?.shift()?.toLowerCase();

            switch(commandArgument) {
                case SUPPORTED_COMMANDS.create:
                    return createEntityHandler(commandLine, followingArgument);
    
                case SUPPORTED_COMMANDS.read:
                    return readEntityHandler(commandLine, followingArgument);
    
                case SUPPORTED_COMMANDS.remove:
                    return removeEntityHandler(commandLine, followingArgument);
    
                case SUPPORTED_COMMANDS.alter:
                    return alterEntityHandler(commandLine, followingArgument);
    
                case SUPPORTED_COMMANDS.import:
                    return importDiagramHandler(followingArgument ? followingArgument : "");
    
                case SUPPORTED_COMMANDS.load:
                    return loadDiagramHandler(followingArgument ? followingArgument : "");
    
                // If command is not found
                default:
                    const errorFeedback = new Feedback();
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.unrecognized_command.part_1"));
                    errorFeedback.addSnippet(new StringSnippet(commandArgument ? commandArgument : ""));
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

    // Saves diagram into a JSON blob and sends feedback to user.
    const saveDiagram = () => {
        const saveFeedback = new Feedback();
        saveFeedback.addSnippet(new LocalizationSnippet("feedback.save.success"));

        return {
            saveFeedback: saveFeedback.toString(),
            diagramJSONFile: new Blob([JSON.stringify(diagram)], { type: "text/plain;charset=utf-8" })
        };
    }

    const value = {
        getFeedBack,
        saveDiagram
    }

    function createEntityHandler(commandLine: string[], entityType: string | undefined) {
        const errorFeedback = new Feedback();

        if((entityType === undefined) || (entityType === "")) {
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.error.entity_type_missing_on_creation"));
            
            throw new AppError(errorFeedback);
        } else {
            switch(true) {
                case SUPPORTED_ENTITY_TYPES.classifier.includes(entityType):
                    const createClassifierInstructions = CreateCommandInterpreter.interpretCreateClassifier(commandLine, entityType);
                    const classifierCreationFeedback = diagram.createClassifier(createClassifierInstructions);
                    setDiagram(diagram);
                    return classifierCreationFeedback.toString();
    
                case SUPPORTED_ENTITY_TYPES.relationship === entityType:
                    const createRelationshipInstructions = CreateCommandInterpreter.interpretCreateRelationship(commandLine);
                    const relationshipCreationFeedback = diagram.createRelationship(createRelationshipInstructions);
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

    function readEntityHandler(commandLine: string[], entityType: string | undefined) {
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
                    const readClassifierInstructions = ReadCommandInterpreter.interpretReadClassifier(commandLine);
                    const classifierReadfeedback = diagram.readClassifier(readClassifierInstructions);
                    return classifierReadfeedback.toString();
                
                case SUPPORTED_ENTITY_TYPES.relationship === entityType:
                    const readInstructions = ReadCommandInterpreter.interpretReadRelationship(commandLine);
                    const readFeedback = diagram.readRelationship(readInstructions);
                    return readFeedback.toString();
                
                default:
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.read.error.unrecognized_entity_type.part_1"));
                    errorFeedback.addSnippet(new StringSnippet(entityType));
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.read.error.unrecognized_entity_type.part_2"));
                    
                    throw new AppError(errorFeedback);
            }
        }
    }

    function removeEntityHandler(commandLine: string[], entityType: string | undefined) {
        const errorFeedback = new Feedback();

        if((entityType === undefined) || (entityType === "")) {
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.remove.error.entity_type_missing_on_remove"));
            
            throw new AppError(errorFeedback);
        } else {
            switch(true) {
                case SUPPORTED_ENTITY_TYPES.classifier.includes(entityType):
                    const removeClassifierInstructions = RemoveCommandInterpreter.interpretRemoveClassifier(commandLine);
                    const removeClassifierFeedback = diagram.removeClassifier(removeClassifierInstructions);
                    setDiagram(diagram);
                    return removeClassifierFeedback.toString();

                case SUPPORTED_ENTITY_TYPES.relationship === entityType:
                    const removerRelationshipInstructions = RemoveCommandInterpreter.interpretRemoveRelationship(commandLine);
                    const removeRelationshipFeedback = diagram.removeRelatioship(removerRelationshipInstructions);
                    setDiagram(diagram);
                    return removeRelationshipFeedback.toString();
                    
                default:
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.remove.error.unrecognized_entity_type.part_1"));
                    errorFeedback.addSnippet(new StringSnippet(entityType));
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.remove.error.unrecognized_entity_type.part_2"));
                    
                    throw new AppError(errorFeedback);
            }
        }
    }

    function alterEntityHandler(commandLine: string[], entityType: string | undefined) {
        const errorFeedback = new Feedback();

        if((entityType === undefined) || (entityType === "")) {
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.error.entity_type_missing_on_alteration"));
            
            throw new AppError(errorFeedback);
        } else {
            switch(true) {
                case SUPPORTED_ENTITY_TYPES.classifier.includes(entityType):
                    const alterClassifierInstructions = AlterCommandInterpreter.interpretAlterClassifier(commandLine);
                    const alterClassifierFeedback = diagram.alterClassifier(alterClassifierInstructions);
                    setDiagram(diagram);
                    return alterClassifierFeedback.toString();

                case SUPPORTED_ENTITY_TYPES.relationship.includes(entityType):
                    const alterRelationshipInstructions = AlterCommandInterpreter.interpretAlterRelationship(commandLine);
                    const alterRelationshipFeedback = diagram.alterRelationship(alterRelationshipInstructions);
                    setDiagram(diagram);
                    return alterRelationshipFeedback.toString();

                default:
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.error.unrecognized_entity_type.part_1"));
                    errorFeedback.addSnippet(new StringSnippet(entityType));
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.error.unrecognized_entity_type.part_2"));
                    
                    throw new AppError(errorFeedback);
            }
        }
    }

    function importDiagramHandler(xmlImport: string) {
        const diagramImportData = ImportCommandInterpreter.interpretImportXML(xmlImport);
        const newDiagram = new Diagram();
        newDiagram.generateDiagramFromData(diagramImportData);
        setDiagram(newDiagram);

        const importFeedback = new Feedback();
        importFeedback.addSnippet(new LocalizationSnippet("feedback.import.success"));

        return importFeedback.toString();
    }

    function loadDiagramHandler(jsonLoad: string) {
        const diagramLoadData = LoadFileInterpreter.interpretImportXML(JSON.parse(jsonLoad));
        const newDiagram = new Diagram();
        newDiagram.generateDiagramFromData(diagramLoadData);
        setDiagram(newDiagram);

        const loadFeedback = new Feedback();
        loadFeedback.addSnippet(new LocalizationSnippet("feedback.load.success"));

        return loadFeedback.toString();
    }

    return (
        <CommandHandlerContext.Provider value={ value }>
            { children }
        </CommandHandlerContext.Provider>
    );
}

export default CommandHandlerContext;
