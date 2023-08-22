/**
 * Expects.
 */
export default interface IAlterAssociativeAttributeDTO {
    alterationCommand: string;
    newVisibility: string;
    newName: string;
    newType: string;
    newMultiplicity?: string;
    attributeName?: string;
}