import IReadRelationshipByBetweenDTO from "../public/DTO/IReadRelationshipByBetweenDTO";
import IReadRelationshipByNamed from "../public/DTO/IReadRelationshipByNamed";

/**
 * Class responsible for handling user's read commands into DTOs.
 */
export default class ReadCommandInterpreter {
    public static interpretReadRelationship(commandLine: string[]): IReadRelationshipByNamed | IReadRelationshipByBetweenDTO {


        return { relationshipName: "" };
    }
}