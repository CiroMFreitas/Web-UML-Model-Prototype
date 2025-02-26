import IGetAttributeDTO from "./IGetAttributeDTO";

/**
 * Instructions for relationship creation.
 */
export default interface IGetClassifierRelationshipDTO {
    relationshipName: string;
    sourceClassifierId: string;
    targetClassifierId: string;
    relationshipType: string;
    attribute: IGetAttributeDTO | null;
    multiplicity: string;
}