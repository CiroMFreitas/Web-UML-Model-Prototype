import IMethodChangesDTO from "./IMethodChangesDTO";

/**
 * Carries instructions for method alteration.
 */
export default interface IAlterMethodDTO {
    methodName: string;
    newMethodName?: string;
    newMethodType?: string;
    newMethodVisibility?: string;
    parameterAlteraions: IMethodChangesDTO;
}