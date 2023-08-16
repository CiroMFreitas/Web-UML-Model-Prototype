import IAlterParameterDTO from "./IAlterParamenterDTO";
import ICreateParameterDTO from "./ICreateParameterDTO";
import IRemoveParameterDTO from "./IRemoveParamenterDTO";

/**
 * Carries all parameters changes in a alter command.
 */
export default interface IParameterChangesDTO {
    create: ICreateParameterDTO[];
    remove: IRemoveParameterDTO[];
    alter: IAlterParameterDTO[];
}