import ICreateAttributeDTO from "./ICreateAttributeDTO";

/**
 * Instructions for diagram to execute by diagram
 */
export default interface IDiagramCreateRelationshipDTO {
    relationshipName?: string,
    sourceClassifierName: string;
    targetClassifierName: string;
    relatioshipType?: string;
    attribute?: ICreateAttributeDTO;
}