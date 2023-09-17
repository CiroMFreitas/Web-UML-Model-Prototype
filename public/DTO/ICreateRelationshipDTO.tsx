import ICreateAssociativeAttributeDTO from "./ICreateAssociativeAttributeDTO";

/**
 * Instructions for relationship creation.
 */
export default interface ICreateRelationshipDTO {
    id?: string;
    relationshipName: string,
    sourceClassifierId: string;
    targetClassifierId: string;
    relationshipType?: string;
    attribute?: ICreateAssociativeAttributeDTO;
    multiplicity?: string;
}