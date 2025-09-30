import IGetClassifierDTO from "./IGetClassifierDTO";
import IGetRelationshipDTO from "./IGetRelationshipDTO";

/**
 * Has diagram classifiers and relationships data.
 */
export default interface IGetDiagramDTO {
    classifiers: IGetClassifierDTO[]
    relationships: IGetRelationshipDTO[]
}