/**
 * Expects the to be altered attrbiute's name followed by the desired changes, if a field is not desired to 
 * vhange, use '-' character in it's place.
 */
export default interface IAlterAttributeDTO {
    attributeName: string;
    newVisibility: string;
    newName: string;
    newType: string;
}