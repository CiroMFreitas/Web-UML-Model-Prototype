import ILoadParameterDTO from "./ILoadParameterDTO";

/**
 * Expected method JSON format
 */
export default interface ILoadMethodDTO {
    id: string;
    name: string;
    type: string;
    visibilityname: string;
    visibilitysymbol: string;
    parameters: ILoadParameterDTO[];
}