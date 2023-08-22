/**
 * Expects at least a name.
 */
export default interface ICreateAssociativeAttributeDTO {
    id?: string;
    visibility?: string;
    name: string;
    type: string;
}