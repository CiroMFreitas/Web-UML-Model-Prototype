import IRemoveClassifierDTO from "../public/DTO/IRemoveClassifierDTO";
import CommandInterpreter from "./CommandInterpreter";

/**
 * Class responsible for handling user's remove commands into DTOs.
 */
export default class RemoveCommandInterpreter extends CommandInterpreter {
    public static interpretRemoveClassifier(commandLine: string[]): IRemoveClassifierDTO {
        return {
            classifierName: ""
        };
    }
}