import ICreateParameterDTO from "./ICreateParameterDTO";

/**
 * Expects at least a name and type, visibility can be omitted, parameters expects to at least receivea empty
 * array.
 */
export default interface ICreateMethodDTO {
    id?: string;
    visibility?: string;
    name: string;
    type: string;
    parameters: ICreateParameterDTO[];
}