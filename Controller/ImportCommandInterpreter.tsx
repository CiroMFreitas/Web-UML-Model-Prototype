import { parseString } from "xml2js";
import ICreateClassifierDTO from "../public/DTO/ICreateClassifierDTO";
import ICreateRelationshipDTO from "../public/DTO/ICreateRelationshipDTO";
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
        const diagramImportInstructions = {
            classifiers: [] as ICreateClassifierDTO[],
            relationships: [] as ICreateRelationshipDTO[]
        };

        parseString(xmlImport, (err, result) => {
            // Get diagram content
            const diagramContent = result.mxfile.diagram[0].mxGraphModel[0].root[0].mxCell.slice(2);
        });

        return {
            classifiersInstructions: diagramImportInstructions.classifiers,
            relationshipssInstructions: diagramImportInstructions.relationships
        };
    }
}