import AppError from "../Models/AppError";
import Feedback from "../Models/Feedback";
import LocalizationSnippet from "../Models/LocalizationSnippet";
import StringSnippet from "../Models/StringSnippet";
import IReadRelationshipByBetweenDTO from "../public/DTO/IReadRelationshipByBetweenDTO";
import IReadRelationshipByNamed from "../public/DTO/IReadRelationshipByNamed";

/**
 * Class responsible for handling user's read commands into DTOs.
 */
export default class ReadCommandInterpreter {
    /**
     * Handles a read relationship command line.
     * 
     * @param commandLine To be interpreted
     * @returns A DTO depending on whenever the 'named' or 'between' arguments were used.
     */
    public static interpretReadRelationship(commandLine: string[]): IReadRelationshipByNamed | IReadRelationshipByBetweenDTO {
        const readForm = commandLine.shift();

        // Checks if read form is present.
        if((readForm === undefined) || (readForm === "")) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.error.missing_read_form_argument"));

            throw new AppError(errorFeedback);
        }
        } else {
            switch(readForm) {
                case "named":
                        return {
                            relationshipName: ""
                        };

                case "between":
                    return {
                        sourceClassifierName: "",
                        targetClassifierName: ""
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