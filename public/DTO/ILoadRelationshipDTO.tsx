import ILoadAttributeDTO from "./ILoadAttributeDTO";

/**
 * Expected relationship JSON format
 */
export default interface ILoadRelationshipDTO {
    id: string;
    relatioshiptype: string;
    name: string;
    sourceclassifierid: string;
    targetclassifierid: string;
    attribute?: ILoadAttributeDTO;
    multiplicity?: string;
}