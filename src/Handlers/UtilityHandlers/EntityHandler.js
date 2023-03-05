export function nameAlreadyInUse(entities, nameSpace) {
    entities.forEach((entity) => {
        if(entity.name === nameSpace) {
            throw "error.class_already_exists";
        }
    });
}