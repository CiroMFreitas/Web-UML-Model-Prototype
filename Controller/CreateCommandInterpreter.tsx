import AppError from "../Models/AppError";
import Feedback from "../Models/Feedback";
import LocalizationSnippet from "../Models/LocalizationSnippet";
import ICreateClassifierDTO from "../public/DTO/ICreateClassifierDTO";
import IDiagramCreateRelationshipDTO from "../public/DTO/IDiagramCreateRelationshipDTO";
import ICreateMethodDTO from "../public/DTO/ICreateMethodDTO";
import CommandInterpreter from "./CommandInterpreter";
import ICreateAttributeDTO from "../public/DTO/ICreateAttributeDTO";

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
        const name = commandLine.shift();
        if((name === undefined) || (name === "")) {
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
                name: name,
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
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.relationship.error.source_classifier_missing"));

            throw new AppError(errorFeedback);
        } else if((desiredTargetClassifierName === undefined) || (desiredTargetClassifierName === "")) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.relationship.error.target_classifier_missing"));

            throw new AppError(errorFeedback);
        } else {
            // Checks if name was given, if not generates a name.
            const relationshipName = this.getCommandArgumentContent(commandLine, "-n");
            const relationshipType = this.getCommandArgumentContent(commandLine, "-t");

            // Gets associative attribute and multiplicity
            const attributeArgument = this.getCommandArgumentContent(commandLine, "-a");
            const associativeAttribute = attributeArgument.length !== 0 ? this.handleCreateAssociativeAttribute(attributeArgument[0]) : undefined;
            let multiplicity;
            const multiplicityArgument = this.getCommandArgumentContent(commandLine, "-m");
            if((multiplicityArgument.length > 0) && (associativeAttribute !== undefined)) {
                multiplicity = multiplicityArgument[0];
            }

            return {
                relationshipName: relationshipName.length !== 0 ? relationshipName[0] : undefined,
                sourceClassifierName: desiredSourceClassifierName,
                targetClassifierName: desiredTargetClassifierName,
                relationshipType: relationshipType.length !== 0 ? relationshipType[0] : undefined,
                attribute: associativeAttribute,
                multiplicity: multiplicity
            }
        }
    }
}