import AppError from "../Models/AppError";
import Feedback from "../Models/Feedback";
import LocalizationSnippet from "../Models/LocalizationSnippet";
import StringSnippet from "../Models/StringSnippet";
import IAlterAttributeDTO from "../public/DTO/IAlterAttributeDTO";
import IAlterRelationshipDTO from "../public/DTO/IAlterRelationshipDTO";
import IAttributeChangesDTO from "../public/DTO/IAttributeChangesDTO";
import ICreateAttributeDTO from "../public/DTO/ICreateAttributeDTO";
import IRemoveAttributeDTO from "../public/DTO/IRemoveAttributeDTO";
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
            const newName = this.getCommandArgumentContent(commandLine, "-n");
            const newSourceClassifierName = this.getCommandArgumentContent(commandLine, "-sc");
            const newTargetClassifierName = this.getCommandArgumentContent(commandLine, "-tc");
    
            return {
                relationshipName: relationshipName,
                newName: newName !== undefined ? newName[0] : undefined,
                newSourceClassifierName: newSourceClassifierName !== undefined ? newSourceClassifierName[0] : undefined,
                newTargetClassifierName: newTargetClassifierName !== undefined ? newTargetClassifierName[0] : undefined,
            }
        }
    }

    private static handleAttributeChanges(attributeArguments: string[]): IAttributeChangesDTO {
        const createAttributes = [] as ICreateAttributeDTO[];
        const removeAttributes = [] as IRemoveAttributeDTO[];
        const alterAttributes = [] as IAlterAttributeDTO[];

        attributeArguments.forEach((attributeArgument) => {
            const splitArgument = attributeArgument.split(":");

            switch(splitArgument[0]) {
                default:
                    const errorFeedback = new Feedback();
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_alteration_argument.part_1"));
                    errorFeedback.addSnippet(new StringSnippet(attributeArgument));
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_alteration_argument.part_2"));

                    throw new AppError(errorFeedback);
            }
        });

        return {
            createAttributes: createAttributes,
            removeAttributes: removeAttributes,
            alterAttributes: alterAttributes
        };
    }
}