import IImportDiagramDTO from "../public/DTO/IImportDiagramDTO";
import CommandInterpreter from "./CommandInterpreter";


/**
 * Class responsible for handling user's import commands into DTOs.
 */
export default class ImportCommandInterpreter extends CommandInterpreter {
    /**
     * Turns a imported xml file string into a DTO.
     * 
     * @param xmlImport String of a xml file.
     * @returns All classifiers and relationship imported from a xml file.
     */
    public static interpretImportXML(xmlImport: string): IImportDiagramDTO {
        return {
            classifiersInstructions: [],
            relationshipssInstructions: []
        };
    }
}