import ICreateAttributeDTO from "./ICreateAttributeDTO";

/**
 * Instructions for relationship creation.
 */
export default interface ICreateRelationshipDTO {
    id?: string;
    relationshipName?: string,
    sourceClassifierId: string;
    targetClassifierId: string;
    relatioshipType?: string;
    attribute?: ICreateAttributeDTO;
}