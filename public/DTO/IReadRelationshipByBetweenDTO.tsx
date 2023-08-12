/**
 * A read relationship command using the between expects to have the names of both source and target 
 * classifiers's name.
 */
export default interface IReadRelationshipByBetweenDTO {
    sourceClassifierName: string;
    targetClassifierName: string;
}