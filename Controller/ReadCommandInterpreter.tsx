import IReadRelationshipByBetweenDTO from "../public/DTO/IReadRelationshipByBetweenDTO";
import IReadRelationshipByNamed from "../public/DTO/IReadRelationshipByNamed";

/**
 * Class responsible for handling user's read commands into DTOs.
 */
export default class ReadCommandInterpreter {
    /**
     * Handles a read relationship command line.
     * 
     * @param commandLine To be interpreted
     * @returns A DTO depending on whenever the 'named' or 'between' arguments were used.
     */
    public static interpretReadRelationship(commandLine: string[]): IReadRelationshipByNamed | IReadRelationshipByBetweenDTO {


        return { relationshipName: "" };
    }
}