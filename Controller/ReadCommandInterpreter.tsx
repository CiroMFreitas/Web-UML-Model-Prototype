import AppError from "../Models/AppError";
import Feedback from "../Models/Feedback";
import LocalizationSnippet from "../Models/LocalizationSnippet";
import StringSnippet from "../Models/StringSnippet";
import IReadClassifierDTO from "../public/DTO/IReadClassifierDTO";
import IReadRelationshipByBetweenDTO from "../public/DTO/IReadRelationshipDTO";
import CommandInterpreter from "./CommandInterpreter";
import IReadRelationshipDTO from "../public/DTO/IReadRelationshipDTO";

/**
 * Class responsible for handling user's read commands into DTOs.
 */
export default class ReadCommandInterpreter extends CommandInterpreter {
    /**
     * Handles read classifier command into a DTO.
     * 
     * @param commandLine Command line to be handled.
     * @returns DTO containing read classifier instructions.
     */
    public static interpretReadClassifier(commandLine: string[]): IReadClassifierDTO {
        const name = commandLine.shift();

        // Checks if classifier name is present.
        if((name === undefined) || (name === "")) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.read.error.missing_name_for_reading"));

            throw new AppError(errorFeedback);
        } else {
            const readAttributes = commandLine.find((snippet) => snippet === "-a");
            const readMethods = commandLine.find((snippet) => snippet === "-m");

            return {
                name: name,
                readAttributes: readAttributes ? true : false,
                readMethods: readMethods ? true : false
            };
        }
    }

    /**
     * Handles a read relationship command line.
     * 
     * @param commandLine To be interpreted
     * @returns A DTO depending on whenever the 'named' or 'between' arguments were used.
     */
    public static interpretReadRelationship(commandLine: string[]): IReadRelationshipDTO | IReadRelationshipByBetweenDTO {
        const readForm = commandLine.shift();

        // Checks if read form is present.
        if((readForm === undefined) || (readForm === "")) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.error.missing_read_form_argument"));

            throw new AppError(errorFeedback);
        } else {
            switch(readForm) {
                case "named":
                    const relationshipName = commandLine.shift();

                    if((relationshipName === undefined) || (relationshipName === "")) {
                        const errorFeedback = new Feedback();
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.error.missing_relationship_name"));
                        
                        throw new AppError(errorFeedback)
                    } else {
                        return {
                            relationshipName: relationshipName
                        };
                    }

                case "between":
                    const sourceClassifierName = commandLine.shift();
                    const targetClassifierName = commandLine.shift();

                    if((sourceClassifierName === undefined) || (sourceClassifierName === "")) {
                        const errorFeedback = new Feedback();
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.error.missing_source_classifier_relationship_name"));
                        
                        throw new AppError(errorFeedback)
                    } else if((targetClassifierName === undefined) || (targetClassifierName === "")) {
                        const errorFeedback = new Feedback();
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.error.missing_target_classifier_relationship_name"));
                        
                        throw new AppError(errorFeedback)
                    } else {
                        return {
                            sourceClassifierName: sourceClassifierName,
                            targetClassifierName: targetClassifierName
                        };
                    }

                default:
                    const errorFeedback = new Feedback();
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.error.invalid_read_form_argument.part_1"));
                    errorFeedback.addSnippet(new StringSnippet(readForm));
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.error.invalid_read_form_argument.part_2"));
                    
                    throw new AppError(errorFeedback);
            }
        }
    }
}