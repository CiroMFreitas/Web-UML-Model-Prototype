/**
 * A read relationship command using the 'named' argument expects to have a realtionship's name.
 */
export default interface IReadRelationshipByNamed {
    relationshipName: string;
}