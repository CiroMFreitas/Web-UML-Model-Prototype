import IGetAttributeDTO from "./IGetAttributeDTO";
import IGetRelationshipDTO from "./IGetRelationshipDTO";
import IGetMethodDTO from "./IGetMethodDTO";

/**
 * Has classifier data to be rendered at Diagram canvas.
 */
export default interface IGetClassifierDTO {
    classifierType: string;
    name: string;
    attributes: IGetAttributeDTO[];
    methods: IGetMethodDTO[];
    relationships: IGetRelationshipDTO[];
}