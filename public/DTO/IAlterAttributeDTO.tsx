/**
 * Necessaru fields are dependent on instruction typas as following:
 * 
 * add -> At least one of the new attributes.
 * 
 * remove -> Attribute name only.
 * 
 * alter -> Attribute Name and at least one of the others.
 */
export default interface IAlterAttributeDTO {
    instruction: string;
    attributeName?: string;
    newVisibility?: string;
    newName?: string;
    newType?: string;
}