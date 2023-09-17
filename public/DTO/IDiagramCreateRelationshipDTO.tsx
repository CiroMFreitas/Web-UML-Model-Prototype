import ICreateAssociativeAttributeDTO from "./ICreateAssociativeAttributeDTO";

/**
 * Instructions for diagram to execute by diagram
 */
export default interface IDiagramCreateRelationshipDTO {
    relationshipName?: string,
    sourceClassifierName: string;
    targetClassifierName: string;
    relationshipType?: string;
    attribute?: ICreateAssociativeAttributeDTO;
    multiplicity?: string;
}