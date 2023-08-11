import IAlterAttributeDTO from "./IAlterAttributeDTO";

/**
 * Alterates the relaionship if the given name, with the optinal date if given.
 */
export default interface IAlterRelationshipDTO {
    relationshipName: string;
    newName?: string;
    newSourceClassifierName?: string;
    newTargetClassifierName?: string;
    attributeAlterInstructions?: IAlterAttributeDTO;
}