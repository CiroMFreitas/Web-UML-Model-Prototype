import IAlterRelationshipDTO from "../public/DTO/IAlterRelationshipDTO";
import CommandInterpreter from "./CommandInterpreter";

/**
 * Class responsible for handling user's alter commands into DTOs.
 */
export default class ReadCommandInterpreter extends CommandInterpreter {
    public static interpretAlterRelationship(commandLine: string[]): IAlterRelationshipDTO {
        
        return { relationshipName: "" }
    }
}