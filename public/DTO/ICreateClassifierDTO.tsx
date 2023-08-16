import ICreateAttributeDTO from "./ICreateAttributeDTO";
import ICreateMethodDTO from "./ICreateMethodDTO";

/**
 * Expects at least a classifier type and name, but may hold attribute and method creation instructions,
 * accepts empty arrays if none of said instructions are present.
 */
export default interface ICreateClassifierDTO {
    classifierType: string;
    classifierName: string;
    attributes: ICreateAttributeDTO[];
    methods: ICreateMethodDTO[];
}