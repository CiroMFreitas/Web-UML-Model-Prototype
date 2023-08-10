export default interface ICreateRelationshipDTO {
    name: string,
    sourceClassifierId: string;
    targetClassifierId: string;
    relatioshipType?: string;
    attribute?: string;
}