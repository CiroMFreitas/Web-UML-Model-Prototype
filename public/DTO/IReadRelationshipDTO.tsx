/**
 * A read relationship command may accept two classes names or rallationship name.
 */
export default interface IReadRelationshipDTO {
    relationshipName?: string;
    sourceClassifierName?: string;
    targetClassifierName?: string;
}