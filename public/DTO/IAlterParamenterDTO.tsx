/**
 * Carries instructions for parameter alteration.
 */
export default interface IAlterParameterDTO {
    parameterName: string;
    newParameterName: string;
    newParameterType: string;
}