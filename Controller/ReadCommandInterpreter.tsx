import AppError from "../Models/AppError";
import Feedback from "../Models/Feedback";
import LocalizationSnippet from "../Models/LocalizationSnippet";
import StringSnippet from "../Models/StringSnippet";
import IReadRelationshipByBetweenDTO from "../public/DTO/IReadRelationshipByBetweenDTO";
import IReadRelationshipByNamedDTO from "../public/DTO/IReadRelationshipByNamedDTO";
import CommandInterpreter from "./CommandInterpreter";

/**
 * Class responsible for handling user's read commands into DTOs.
 */
export default class ReadCommandInterpreter extends CommandInterpreter {
    /**
     * Handles a read relationship command line.
     * 
     * @param commandLine To be interpreted
     * @returns A DTO depending on whenever the 'named' or 'between' arguments were used.
     */
    public static interpretReadRelationship(commandLine: string[]): IReadRelationshipByNamedDTO | IReadRelationshipByBetweenDTO {
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