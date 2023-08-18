/**
 * Expects at least a name and type, visibility can be omitted.
 */
export default interface ICreateAttributeDTO {
    id?: string;
    visibility?: string;
    name: string;
    type: string;
}