import AppError from "../Models/AppError";
import Feedback from "../Models/Feedback";
import LocalizationSnippet from "../Models/LocalizationSnippet";
import IAlterRelationshipDTO from "../public/DTO/IAlterRelationshipDTO";
import CommandInterpreter from "./CommandInterpreter";

/**
 * Class responsible for handling user's alter commands into DTOs.
 */
export default class AlterCommandInterpreter extends CommandInterpreter {
    public static interpretAlterRelationship(commandLine: string[]): IAlterRelationshipDTO {
        const relationshipName = commandLine.shift();
        if((relationshipName === undefined) || (relationshipName === "")) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.relationship.error.missing_relationship_name"));

            throw new AppError(errorFeedback);
        } else {        
    
            return {
                relationshipName: relationshipName
            }
        }
    }
}