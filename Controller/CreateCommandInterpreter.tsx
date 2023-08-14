import AppError from "../Models/AppError";
import Feedback from "../Models/Feedback";
import LocalizationSnippet from "../Models/LocalizationSnippet";
import ICreateAttributeDTO from "../public/DTO/ICreateAttributeDTO";
import ICreateClassifierDTO from "../public/DTO/ICreateClassifierDTO";
import IDiagramCreateRelationshipDTO from "../public/DTO/ICreateDiagramRelationshipDTO";
import ICreateMethodDTO from "../public/DTO/ICreateMethodDTO";
import CommandInterpreter from "./CommandInterpreter";

/**
 * Class responsible for handling user's create commands into DTOs.
 */
export default class CreateCommandInterpreter extends CommandInterpreter {
    /**
     * Interprets a create classifier command line into a DTO.
     * 
     * @param commandLine Command to be interpreted.
     * @returns Handled coomand line into a DTO to be executed.
     */
    public static interpretCreateClassifier(commandLine: string[], entityType: string): ICreateClassifierDTO {
        const classifierName = commandLine.shift();
        if((classifierName === undefined) || (classifierName === "")) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.missing_name_argument.part_1"));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.common.entity_type."+entityType));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.missing_name_argument.part_2"));

            throw new AppError(errorFeedback);
        } else {
            const attributes = [] as ICreateAttributeDTO[];
            const attributeArguments = this.getCommandArgumentContent(commandLine, "-a");
            attributeArguments.forEach((argument) => {
                attributes.push(this.handleCreateAttributeArgument(argument));
            });

            const methods = [] as ICreateMethodDTO[];
            const methodArguments = this.getCommandArgumentContent(commandLine, "-m");
            const handledMethodArgument = this.handleMethodArguments(methodArguments);
            handledMethodArgument.forEach((handeldArgument) => {
                methods.push(this.handleCreateMethodArgument(handeldArgument));
            });

            return {
                classifierType: entityType,
                classifierName: classifierName,
                attributes: attributes,
                methods: methods,
            };
        }
    }

    /**
     * Interprets a create relationship command line into a DTO.
     * 
     * @param commandLine Command to be interpreted.
     * @returns Handled coomand line into a DTO to be executed.
     */
    public static interpretCreateRelationship(commandLine: string[]): IDiagramCreateRelationshipDTO {
    // Checks if classifiers's names were given.
        const desiredSourceClassifierName = commandLine.shift();
        const desiredTargetClassifierName = commandLine.shift();
        if((desiredSourceClassifierName === undefined) || (desiredSourceClassifierName === "")) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.ralationship.error.source_classifier_missing"));

            throw new AppError(errorFeedback);
        } else if((desiredTargetClassifierName === undefined) || (desiredTargetClassifierName === "")) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.ralationship.error.target_classifier_missing"));

            throw new AppError(errorFeedback);
        } else {
            // Checks if name was given, if not generates a name.
            const relationshipName = this.getCommandArgumentContent(commandLine, "-n");
            const relatioshipType = this.getCommandArgumentContent(commandLine, "-t");
            const attributeArgument = this.getCommandArgumentContent(commandLine, "-a");

            return {
                relationshipName: relationshipName.length !== 0 ? relationshipName[0] : undefined,
                sourceClassifierName: desiredSourceClassifierName,
                targetClassifierName: desiredTargetClassifierName,
                relatioshipType: relatioshipType.length !== 0 ? relatioshipType[0] : undefined,
                attribute: attributeArgument.length !== 0 ? this.handleCreateAttributeArgument(attributeArgument[0]) : undefined
            }
        }
    }
}