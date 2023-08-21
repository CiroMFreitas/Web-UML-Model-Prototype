import ICreateAssociativeAttributeDTO from "./ICreateAssociativeAttributeDTO";

/**
 * Instructions for relationship creation.
 */
export default interface ICreateRelationshipDTO {
    id?: string;
    relationshipName: string,
    sourceClassifierId: string;
    targetClassifierId: string;
    relatioshipType?: string;
    attribute?: ICreateAssociativeAttributeDTO;
}