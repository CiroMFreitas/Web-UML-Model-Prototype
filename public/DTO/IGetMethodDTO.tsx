import IGetParameterDTO from "./IGetParameterDTO";

/**
 * Has method data to be rendered at Diagram canvas.
 */
export default interface IGetMethodDTO {
    visibility: string;
    name: string;
    type: string;
    parameters: IGetParameterDTO[];
}