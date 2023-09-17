import ICreateClassifierDTO from "./ICreateClassifierDTO";
import ICreateRelationshipDTO from "./ICreateRelationshipDTO";

/**
 * Expects multiple classifiers and relationships create intrusctions.
 */
export default interface INewDiagramDTO {
    classifiersData: ICreateClassifierDTO[];
    relationshipsData: ICreateRelationshipDTO[];
}