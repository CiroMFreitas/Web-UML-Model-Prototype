import { parseString } from "xml2js";
import ICreateClassifierDTO from "../public/DTO/ICreateClassifierDTO";
import ICreateRelationshipDTO from "../public/DTO/ICreateRelationshipDTO";
import IImportDiagramDTO from "../public/DTO/IImportDiagramDTO";
import CommandInterpreter from "./CommandInterpreter";
import ICreateAttributeDTO from "../public/DTO/ICreateAttributeDTO";
import ICreateMethodDTO from "../public/DTO/ICreateMethodDTO";


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
            const diagramContent = result.mxfile.diagram[0].mxgraphmodel[0].root[0].mxcell.slice(2);

            // Handles diagram content into a JSON Object
            for(const basicContent of diagramContent) {
                const content = basicContent.$;
                const contentParentId = content.parent;
                    
                switch(true) {
                    // Classifiers have parent id 1 nad have no source or target
                    case contentParentId === "1":
                        console.log(content);
                        const [classifierType, name] = this.handleClassifierTypeAndName(content.value);
                        diagramImportInstructions.classifiers.push({
                            id: content.id,
                            name: name,
                            classifierType: classifierType,
                            attributes: [] as ICreateAttributeDTO[],
                            methods: [] as ICreateMethodDTO[]
                        });
                        break;
                }
            }
        });

        return {
            classifiersInstructions: diagramImportInstructions.classifiers,
            relationshipssInstructions: diagramImportInstructions.relationships
        };
    }

    private static handleClassifierTypeAndName(classifierValue: string): string[] {
        const classifierTypes = {
            interface: `<i style="border-color: var(--border-color); font-weight: 400;">&lt;&lt;interface&gt;&gt;<br></i>`,
            abstract: `<i style="border-color: var(--border-color); font-weight: 400;">&lt;&lt;abstract&gt;&gt;</i><br>`,
        }
    
        for(const [type, value] of Object.entries(classifierTypes)) {
            if(classifierValue.includes(value)) {
                return [type, classifierValue.replace(value, "")];
            }
        }
    
        return ["class", classifierValue];
    }
}