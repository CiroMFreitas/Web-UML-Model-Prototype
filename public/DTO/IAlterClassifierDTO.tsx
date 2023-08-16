import IAttributeChangesDTO from "./IAttributeChangesDTO";
import IMethodChangesDTO from "./IMethodChangesDTO";

/**
 * Carries instructions for classifier alteraiton.
 */
export default interface IAlterClassifierDTO {
    classifierName: string;
    newClassifierType?: string;
    newClassifierName?: string;
    attributeAlterations: IAttributeChangesDTO;
    methodAlterations: IMethodChangesDTO;
}