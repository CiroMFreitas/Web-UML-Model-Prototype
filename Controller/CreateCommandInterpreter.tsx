import AppError from "../Models/AppError";
import Feedback from "../Models/Feedback";
import LocalizationSnippet from "../Models/LocalizationSnippet";
import ICreateAttributeDTO from "../public/DTO/ICreateAttributeDTO";
import ICreateClassifierDTO from "../public/DTO/ICreateClassifierDTO";
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
            });

            return {
                classifierType: entityType,
                classifierName: classifierName,
                attributes: attributes,
                methods: [],
            }
        }
    }
}