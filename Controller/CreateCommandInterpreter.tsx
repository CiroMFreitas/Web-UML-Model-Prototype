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
        return {
            classifierType: "",
            classifierName: "",
            attributes: [],
            methods: [],
        }
    }
}