import AppError from "../Models/AppError";
import Feedback from "../Models/Feedback";
import LocalizationSnippet from "../Models/LocalizationSnippet";
import IRemoveClassifierDTO from "../public/DTO/IRemoveClassifierDTO";
import CommandInterpreter from "./CommandInterpreter";

/**
 * Class responsible for handling user's remove commands into DTOs.
 */
export default class RemoveCommandInterpreter extends CommandInterpreter {
    public static interpretRemoveClassifier(commandLine: string[]): IRemoveClassifierDTO {
        const classifierName = commandLine.shift();

        // Checks if classifier name is present.
        if((classifierName === undefined) || (classifierName === "")) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.remove.classifier.error.missing_name_for_removal"));

            throw new AppError(errorFeedback);
        } else {
            return {
                classifierName: classifierName
            };
        }
    }
}