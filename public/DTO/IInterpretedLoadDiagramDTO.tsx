import ICreateClassifierDTO from "./ICreateClassifierDTO";
import ICreateRelationshipDTO from "./ICreateRelationshipDTO";

/**
 * Loadded diagram creation instructions
 */
export default interface IInterpretedLoadDiagramDTO {
    classifiers: ICreateClassifierDTO[];
    relationships: ICreateRelationshipDTO[];
}