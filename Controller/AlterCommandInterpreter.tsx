import IAlterRelationshipDTO from "../public/DTO/IAlterRelationshipDTO";

/**
 * Class responsible for handling user's alter commands into DTOs.
 */
export default class ReadCommandInterpreter {
    public static interpretAlterRelationship(commandLine: string[]): IAlterRelationshipDTO {
        
        return { relationshipName: "" }
    }
}