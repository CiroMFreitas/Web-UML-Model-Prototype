import IGetAttributeDTO from "./IGetAttributeDTO";
import IGetClassifierRelationshipDTO from "./IGetClassifierRelationshipDTO";
import IGetMethodDTO from "./IGetMethodDTO";

/**
 * Has classifier data to be rendered at Diagram canvas.
 */
export default interface IGetClassifierDTO {
    classifierType: string;
    name: string;
    attributes: IGetAttributeDTO[];
    methods: IGetMethodDTO[];
    relationships: IGetClassifierRelationshipDTO[];
}