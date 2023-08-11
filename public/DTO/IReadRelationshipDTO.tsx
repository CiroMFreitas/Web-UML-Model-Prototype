/**
 * A read relationship command expects to have the realtionship to be read name or the names of both source 
 * and target classifiers's name.
 */
export default interface IReadRelationshipDTO {
    relationshipName?: string;
    sourceClassifierName?: string;
    targetClassifierName?: string;
}