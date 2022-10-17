import { ERROR_CLASS_ALREADY_EXISTS } from "../../Utils/Errors";

export function entityNameAlreadyInUse(entities, nameSpace) {
    entities.forEach((entity) => {
        if(entity.entityName === nameSpace) {
            throw ERROR_CLASS_ALREADY_EXISTS;
        }
    });
}