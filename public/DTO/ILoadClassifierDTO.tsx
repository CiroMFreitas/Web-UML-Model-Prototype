import ILoadAttributeDTO from "./ILoadAttributeDTO";
import ILoadMethodDTO from "./ILoadMethodDTO";

/**
 * Expected classifier JSON format
 */
export default interface ILoadClassifierDTO {
    id: string;
    classifierType: string;
    name: string;
    attributes: ILoadAttributeDTO[];
    methods: ILoadMethodDTO[];
}