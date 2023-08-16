import IAlterMethodDTO from "./IAlterMethodDTO";
import IAttributeChangesDTO from "./IAttributeChangesDTO";
import ICreateMethodDTO from "./ICreateMethodDTO";
import IRemoveMethodDTO from "./IRemoveMethodDTO";

/**
 * Carries instructions for classifier alteraiton.
 */
export default interface IAlterClassifierDTO {
    classifierName: string;
    newClassifierType?: string;
    newClassifierName?: string;
    attributeAlterations: IAttributeChangesDTO;
    methodAlterations: {
        create: ICreateMethodDTO[];
        remove: IRemoveMethodDTO[];
        alter: IAlterMethodDTO[];
    }
}