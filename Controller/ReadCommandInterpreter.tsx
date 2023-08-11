import IReadRelationshipDTO from "../public/DTO/IReadRelationshipDTO";

/**
 * Class responsible for handling user's read commands into DTOs.
 */
export default class ReadCommandInterpreter {
    public static interpretReadRelationship(commandLine: string[]): IReadRelationshipDTO {
        return { };
    }
}