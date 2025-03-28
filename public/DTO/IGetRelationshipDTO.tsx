import IGetAttributeDTO from "./IGetAttributeDTO";

/**
 * Instructions for relationship creation.
 */
export default interface IGetRelationshipDTO {
    relationshipName: string;
    sourceClassifierName: string;
    targetClassifierName: string;
    relationshipType: string;
    attribute: IGetAttributeDTO | null;
    multiplicity: string;
}