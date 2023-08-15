/**
 * Expects a direction and it's respectives arguments.
 */
export default interface IRemoveRelationshipDTO {
    direction: string;
    relationshipName?: string;
    sourceClassifierName?: string;
    targetClassifierName?: string;
}