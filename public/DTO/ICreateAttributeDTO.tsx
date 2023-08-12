/**
 * Expects at least a name and type, visibility can be omitted.
 */
export default interface ICreateAttributeDTO {
    visibility?: string;
    name: string;
    type: string;
}