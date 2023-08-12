import IAlterAttributeDTO from "./IAlterAttributeDTO";
import ICreateAttributeDTO from "./ICreateAttributeDTO";
import IRemoveAttributeDTO from "./IRemoveAttributeDTO";

/**
 * Holds all attributes changes in a alter command.
 */
export default interface IAttributeChangesDTO {
    createAttributes: ICreateAttributeDTO[];
    removeAttributes: IRemoveAttributeDTO[];
    alterAttributes: IAlterAttributeDTO[];
}