import ILoadAttributeDTO from "./ILoadAttributeDTO";

/**
 * Expected relationship JSON format
 */
export default interface ILoadRelationshipDTO {
    id: string;
    relatioshipType: string;
    name: string;
    sourceClassifierId: string;
    targetClassifierId: string;
    attribute?: ILoadAttributeDTO;
    multiplicity?: string;
}