import { ERROR_CLASS_ALREADY_EXISTS } from "../../Utils/Errors";

export function nameAlreadyInUse(entities, nameSpace) {
    entities.forEach((entity) => {
        if(entity.name === nameSpace) {
            throw ERROR_CLASS_ALREADY_EXISTS;
        }
    });
}