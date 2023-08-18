import ICreateAttributeDTO from "./ICreateAttributeDTO";

/**
 * Instructions for relationship creation.
 */
export default interface ICreateRelationshipDTO {
    Id?: string;
    relationshipName: string,
    sourceClassifierId: string;
    targetClassifierId: string;
    relatioshipType?: string;
    attribute?: ICreateAttributeDTO;
}