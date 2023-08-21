import ICreateAssociativeAttributeDTO from "./ICreateAssociativeAttributeDTO";

/**
 * Instructions for diagram to execute by diagram
 */
export default interface IDiagramCreateRelationshipDTO {
    relationshipName?: string,
    sourceClassifierName: string;
    targetClassifierName: string;
    relatioshipType?: string;
    attribute?: ICreateAssociativeAttributeDTO;
}