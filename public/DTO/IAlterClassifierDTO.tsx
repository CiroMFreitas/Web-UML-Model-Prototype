import IAlterAttributeDTO from "./IAlterAttributeDTO";
import IAlterMethodDTO from "./IAlterMethodDTO";
import ICreateAttributeDTO from "./ICreateAttributeDTO";
import ICreateMethodDTO from "./ICreateMethodDTO";
import IRemoveAttributeDTO from "./IRemoveAttributeDTO";
import IRemoveMethodDTO from "./IRemoveMethodDTO";

/**
 * Carries instructions for classifier alteraiton.
 */
export default interface IAlterClassifierDTO {
    classifierName: string;
    newClassifierType?: string;
    newClassifierName?: string;
    attributeAlterations: {
        create: ICreateAttributeDTO[];
        remove: IRemoveAttributeDTO[];
        alter: IAlterAttributeDTO[];
    };
    methodAlterations: {
        create: ICreateMethodDTO[];
        remove: IRemoveMethodDTO[];
        alter: IAlterMethodDTO[];
    }
}