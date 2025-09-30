import { parseString } from "xml2js";
import ICreateClassifierDTO from "../public/DTO/ICreateClassifierDTO";
import ICreateRelationshipDTO from "../public/DTO/ICreateRelationshipDTO";
import INewDiagramDTO from "../public/DTO/INewDiagramDTO";
import CommandInterpreter from "./CommandInterpreter";
import ICreateAttributeDTO from "../public/DTO/ICreateAttributeDTO";
import ICreateMethodDTO from "../public/DTO/ICreateMethodDTO";
import { SUPPORTED_RELATIONSHIP_TYPES, SUPPORTED_VISIBILITY } from "../public/Utils/SupportedKeyWords";
import ICreateParameterDTO from "../public/DTO/ICreateParameterDTO";
import IGetRelationshipDTO from "../public/DTO/IGetRelationshipDTO";
import IGetClassifierDTO from "../public/DTO/IGetClassifierDTO";
import IGetAttributeDTO from "../public/DTO/IGetAttributeDTO";
import IGetMethodDTO from "../public/DTO/IGetMethodDTO";
import IGetDiagramDTO from "../public/DTO/IGetDiagramDTO";


/**
 * Class responsible for handling user's importContent commands into DTOs.
 */
export default class ImportCommandInterpreter extends CommandInterpreter {
    /**
     * Turns a imported xml file string into a DTO.
     * 
     * @param importContent String of a xml file.
     * @returns All classifiers and relationship imported from a xml file.
     */
    public static interpretImportXML(importContent: string): INewDiagramDTO {
        const diagramImportInstructions = {
            classifiers: [] as ICreateClassifierDTO[],
            relationships: [] as ICreateRelationshipDTO[]
        };
        
        parseString(importContent, { normalizeTags: true }, (err, result) => {
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
                        // Get relationship type
                        let relationship_type = "as"
                        if(["endArrow=block", "endFill=1", "edgeStyle=orthogonalEdgeStyle"].every((argument) => content.style.includes(argument))) {
                            relationship_type = "da"
                        } else if(content.source === content.target) {
                            relationship_type = "ra"
                        } else if(["endArrow=open", "endSize=12", "startArrow=diamondThin", "startSize=14", "startFill=0", "edgeStyle=orthogonalEdgeStyle"].every((argument) => content.style.includes(argument))) {
                            relationship_type = "ag"
                        } else if(["endArrow=open", "endSize=12", "startArrow=diamondThin", "startSize=14", "startFill=1", "edgeStyle=orthogonalEdgeStyle"].every((argument) => content.style.includes(argument))) {
                            relationship_type = "co"
                        } else if(["endArrow=block", "endSize=16", "endFill=0"].every((argument) => content.style.includes(argument))) {
                            relationship_type = "in"
                        } else if(["endArrow=block", "dashed=1", "endFill=0", "endSize=12"].every((argument) => content.style.includes(argument))) {
                            relationship_type = "re"
                        }

                        diagramImportInstructions.relationships.push({
                            id: content.id,
                            sourceClassifierId: content.source,
                            targetClassifierId: content.target,
                            relationshipName: "",
                            relationshipType: relationship_type,
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
            classifiersData: diagramImportInstructions.classifiers,
            relationshipsData: diagramImportInstructions.relationships
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

    /**
     * Turns a imported txt file string into a DTO.
     * 
     * @param importContent String of a txt file.
     * @returns All classifiers and relationship imported from a txt file.
     */
    public static interpretImportTxt(importContent: string): INewDiagramDTO {
        const classifiers = [] as ICreateClassifierDTO[];
        const atributes = [];
        const methods = [];
        const relationships = [] as ICreateRelationshipDTO[];

        const contentLines = importContent.split("\n").filter((content) => content !== "");
        contentLines.forEach((line) => {
            const lineArguments = line.split(" ");
            switch(true) {
                // Detects classifiers
                case lineArguments[0] === "class" || lineArguments[0] === "abstract" || lineArguments[0] === "interface":
                    classifiers.push({
                        name: lineArguments[1],
                        classifierType: lineArguments[0],
                        attributes: [],
                        methods: []
                    });
                    break;

                // Detects Relationships
                case SUPPORTED_RELATIONSHIP_TYPES.find((relationshipType) => relationshipType.ascii === lineArguments[1]) !== undefined ||
                SUPPORTED_RELATIONSHIP_TYPES.find((relationshipType) => relationshipType.ascii === lineArguments[2]) !== undefined:
                    const relationshipArguments = lineArguments.indexOf(":") === -1 ? lineArguments : lineArguments.slice(0, lineArguments.indexOf(":"));
                    const relationshipAttributeArguments = lineArguments.indexOf(":") === -1 ? [""] : lineArguments.slice(lineArguments.indexOf(":") + 1);

                    let relationshipAttribute;
                    if(SUPPORTED_VISIBILITY.find((visibility) => visibility.symbol == relationshipAttributeArguments[0]) !== undefined) {
                        relationshipAttribute = {
                            visibility: relationshipAttributeArguments[0],
                            name: relationshipAttributeArguments[1],
                            type: relationshipArguments[0]
                        };
                    } else if(relationshipAttributeArguments[0] !== "") {
                        relationshipAttribute = {
                            visibility: "+",
                            name: relationshipAttributeArguments[0],
                            type: relationshipArguments[0]
                        };
                    }

                    relationships.push({
                        relationshipName: "",
                        relationshipType: SUPPORTED_RELATIONSHIP_TYPES.find((relationshipType) => relationshipType.ascii === (relationshipArguments.length === 3 ? relationshipArguments[1] : relationshipArguments[2]))?.code ?? "",
                        sourceClassifierId: relationshipArguments[0],
                        targetClassifierId: relationshipArguments.length === 3 ? relationshipArguments[2] : relationshipArguments[3],
                        attribute: relationshipAttribute,
                        multiplicity: relationshipArguments.length === 4 ? relationshipArguments[1] : undefined
                    });
                    break;
                
                case lineArguments[lineArguments.length - 1].includes(")"):
                    console.log(lineArguments)
                    const hasVisibility = SUPPORTED_VISIBILITY.find((visibility) => visibility.symbol == lineArguments[2]) !== undefined ? 1 : 0
                    const method = {
                        visibility: hasVisibility !== 0 ? lineArguments[2] : "+",
                        type: lineArguments[2 + hasVisibility],
                        name: lineArguments[3 + hasVisibility].replace("()", "").split("(")[0],
                        parameters: [] as ICreateParameterDTO[]
                    } as ICreateMethodDTO

                    const parameterIndex = lineArguments.findIndex((argument) => argument.includes("("));
                    console.log(parameterIndex)
                    if(!lineArguments[parameterIndex].includes("()")) {
                        console.log(true)
                    }
                    console.log(method)
                    break;
                
                default:
                    //console.log("Following line was not identified: " + line);
                    break;
            }
        })
        return {
            classifiersData: classifiers,
            relationshipsData: relationships
        };
    }
}