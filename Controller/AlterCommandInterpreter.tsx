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
    /**
     * Interprets a command line into a DTO.
     * 
     * @param commandLine Command to be interpreted.
     * @returns Handled coomand line to be executed.
     */
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

            const attributeArgument = this.getCommandArgumentContent(commandLine, "-a");
            const attributeAlterInstructions = this.handleAttributeChanges(attributeArgument);
    
            return {
                relationshipName: relationshipName,
                newName: newName !== undefined ? newName[0] : undefined,
                newSourceClassifierName: newSourceClassifierName !== undefined ? newSourceClassifierName[0] : undefined,
                newTargetClassifierName: newTargetClassifierName !== undefined ? newTargetClassifierName[0] : undefined,
                attributeAlterInstructions: attributeAlterInstructions
            }
        }
    }

    /**
     * Handles attribute arguments into DTOs.
     * 
     * @param attributeArguments An array arguments to be handled. 
     * @returns Handled arguments, some may be empty if no instruction of said type was given.
     */
    private static handleAttributeChanges(attributeArguments: string[]): IAttributeChangesDTO {
        const createAttributes = [] as ICreateAttributeDTO[];
        const removeAttributes = [] as IRemoveAttributeDTO[];
        const alterAttributes = [] as IAlterAttributeDTO[];

        attributeArguments.forEach((attributeArgument) => {
            const splitArgument = attributeArgument.split(":");
            const errorFeedback = new Feedback();

            switch(splitArgument[0]) {
                case "add":
                    createAttributes.push(this.handleCreateAttributeArgument(splitArgument.splice(1)))
                    break;

                case "remove":
                    if(splitArgument.length === 2) {
                        removeAttributes.push({
                            attributeName: splitArgument[1]
                        });
                    } else if(splitArgument.length === 1) {
                        removeAttributes.push({
                            attributeName: ""
                        });
                    } else {
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_remove_attribute_arguments.part_1"));
                        errorFeedback.addSnippet(new StringSnippet(attributeArgument))
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_remove_attribute_arguments.part_2"));
                    }
                    break;

                case "alter":
                    if(splitArgument.length === 5) {
                        alterAttributes.push({
                            attributeName: splitArgument[1],
                            newVisibility: splitArgument[2],
                            newName: splitArgument[3],
                            newType: splitArgument[4],
                        });
                    } else if(splitArgument.length === 4) {
                        alterAttributes.push({
                            attributeName: "",
                            newVisibility: splitArgument[1],
                            newName: splitArgument[2],
                            newType: splitArgument[3],
                        });
                    } else if(splitArgument.length < 4) {
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_alter_attribute_arguments.part_1.too_few"));
                        errorFeedback.addSnippet(new StringSnippet(attributeArgument))
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_alter_attribute_arguments.part_2"));
                    } else {
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_alter_attribute_arguments.part_1.too_few"));
                        errorFeedback.addSnippet(new StringSnippet(attributeArgument))
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_alter_attribute_arguments.part_2"));
                    }
                    break;

                case "":
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.missing_alteration_argument.part_1"));
                    errorFeedback.addSnippet(new StringSnippet(attributeArgument));
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.missing_alteration_argument.part_2"));

                    throw new AppError(errorFeedback);

                default:
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_alteration_argument.part_1"));
                    errorFeedback.addSnippet(new StringSnippet(splitArgument[0]));
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_alteration_argument.part_2"));
                    errorFeedback.addSnippet(new StringSnippet(attributeArgument));
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_alteration_argument.part_3"));

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