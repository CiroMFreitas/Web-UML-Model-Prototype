import IAlterParameterDTO from "./IAlterParamenterDTO";
import ICreateParameterDTO from "./ICreateParameterDTO";
import IRemoveParameterDTO from "./IRemoveParamenterDTO";

/**
 * Carries instructions for method alteration.
 */
export default interface IAlterMethodDTO {
    methodName: string;
    newMethodName?: string;
    newMethodType?: string;
    newMethodVisibility?: string;
    parameterAlteraions: {
        create: ICreateParameterDTO[];
        remove: IRemoveParameterDTO[];
        alter: IAlterParameterDTO[];
    };
}