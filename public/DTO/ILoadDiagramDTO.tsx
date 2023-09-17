import ILoadClassifierDTO from "./ILoadClassifierDTO";
import ILoadRelationshipDTO from "./ILoadRelationshipDTO";

/**
 * Expected format of an JSON file
 */
export default interface ILoadDiagramDTO {
    classifiers: ILoadClassifierDTO[];
    relationships: ILoadRelationshipDTO[];
}