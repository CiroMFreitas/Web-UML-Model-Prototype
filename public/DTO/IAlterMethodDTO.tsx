import IParameterChangesDTO from "./IParameterChangesDTO";

/**
 * Carries instructions for method alteration.
 */
export default interface IAlterMethodDTO {
    methodName: string;
    newMethodName?: string;
    newMethodType?: string;
    newMethodVisibility?: string;
    parameterAlteraions: IParameterChangesDTO;
}