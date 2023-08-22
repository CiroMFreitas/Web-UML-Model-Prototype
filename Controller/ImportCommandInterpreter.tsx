import { parseString } from "xml2js";
import ICreateClassifierDTO from "../public/DTO/ICreateClassifierDTO";
import ICreateRelationshipDTO from "../public/DTO/ICreateRelationshipDTO";
import IImportDiagramDTO from "../public/DTO/IImportDiagramDTO";
import CommandInterpreter from "./CommandInterpreter";
import ICreateAttributeDTO from "../public/DTO/ICreateAttributeDTO";
import ICreateMethodDTO from "../public/DTO/ICreateMethodDTO";
import { SUPPORTED_VISIBILITY } from "../public/Utils/SupportedKeyWords";
import ICreateParameterDTO from "../public/DTO/ICreateParameterDTO";


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
                    // Checks if content parent is not the diagram
                    case contentParentId !== "1":
                        // Gets parent classifier
                        const parentClassifier = diagramImportInstructions.classifiers.find((classifier) => classifier.id === contentParentId);
                        const parentRelationship = diagramImportInstructions.relationships.find((relationship) => relationship.id === contentParentId);
                        
                        // Checks if content is an attribute, method or associative attribute
                        switch(true) {
                            case parentRelationship !== undefined:
                                if(parentRelationship !== undefined) {
                                    // Gets sourceClaasifier for type
                                    const sourceClassifier = diagramImportInstructions.classifiers.find((classifier) => classifier.id === parentRelationship.sourceClassifierId);

                                    if(sourceClassifier !== undefined) {
                                        parentRelationship.attribute = this.handleAttributes(content.value + " " + sourceClassifier.name);
                                        parentRelationship.multiplicity = content;
                                    }
                                }
                                break;

                            case!content.value.includes("(") &&
                                content.style.includes("text"):
                                if(parentClassifier !== undefined) {
                                    const classifierAttributes = content.value.split("<br>").map((attribute: string) => {
                                        if((attribute !== undefined) || (attribute !== "")) {
                                            return this.handleAttributes(attribute.replace(":", ""));
                                        }
                                    });

                                    parentClassifier.attributes = classifierAttributes !== undefined ? classifierAttributes as ICreateAttributeDTO[] : [] as ICreateAttributeDTO[];
                                }
                                break;

                            case parentClassifier !== undefined &&
                                content.value.includes("(") &&
                                content.style.includes("text"):
                                if(parentClassifier !== undefined) {
                                    const classifierMethods = content.value.split("<br>").map((method: string) => {
                                        if((method !== undefined) || (method !== "")) {
                                            return this.handleMethods(method);
                                        }
                                    });
                                    parentClassifier.methods = classifierMethods !== undefined ? classifierMethods as ICreateMethodDTO[] : [] as ICreateMethodDTO[];
                                }
                                break;
                        }
                        break;

                    // Relationships have a source and target
                    case content.source !== undefined && content.target !== undefined:
                        diagramImportInstructions.relationships.push({
                            id: content.id,
                            sourceClassifierId: content.source,
                            targetClassifierId: content.target,
                            relationshipName: "",
                            multiplicity: content.value
                        });
                        break;

                    // Classifiers have parent id 1 nad have no source or target
                    case contentParentId === "1":
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

    private static handleAttributes(attribute: string): ICreateAttributeDTO {
        const attributeData = attribute.replace(":", "").split(" ");
        const validVisibility = SUPPORTED_VISIBILITY.find((visibility) => visibility.symbol === attributeData[0]);
    
        return {
            visibility: validVisibility?.name,
            name: attributeData[1],
            type: attributeData[2],
        };
    }

    private static handleMethods(method: string): ICreateMethodDTO {
        const methodData = method.split("(");
        const [methodVisibility, methodName] = methodData[0].split(" ");
        const [methodParameters, methodType] = methodData[1].split(")");
        
        const handledParameters = methodParameters.split(", ").map((parameter: string) => {
            if((parameter !== undefined) && (parameter !== "")) {
                return this.handleParameter(parameter);
            }
        });
        const validVisibility = SUPPORTED_VISIBILITY.find((visibility) => visibility.symbol === methodVisibility);
    
        return {
            visibility: validVisibility?.name,
            name: methodName,
            type: methodType ? methodType.replace(": ", "") : "constructor",
            parameters: handledParameters.length > 1 ? handledParameters as ICreateParameterDTO[] : [] as ICreateParameterDTO[]
        };
    }
    
    private static handleParameter(parameter: string): ICreateParameterDTO {
        const parameterData = parameter.split(": ");
    
        return {
            name: parameterData[0],
            type: parameterData[1],
        };
    }
}