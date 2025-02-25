import ICreateAttributeDTO from "./ICreateAttributeDTO";

/**
 * Instructions for diagram to execute by diagram
 */
export default interface IDiagramCreateRelationshipDTO {
    relationshipName?: string,
    sourceClassifierName: string;
    targetClassifierName: string;
    relationshipType?: string;
    attribute?: ICreateAttributeDTO;
    multiplicity?: string;
}