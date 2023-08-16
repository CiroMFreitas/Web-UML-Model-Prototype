import IAlterMethodDTO from "./IAlterMethodDTO";
import ICreateMethodDTO from "./ICreateMethodDTO";
import IRemoveMethodDTO from "./IRemoveMethodDTO";

/**
 * Carries all methods changes in a alter command.
 */
export default interface IMethodChangesDTO {
    create: ICreateMethodDTO[];
    remove: IRemoveMethodDTO[];
    alter: IAlterMethodDTO[];
}