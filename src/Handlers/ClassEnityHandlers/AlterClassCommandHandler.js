import { upperCaseFirstLetter, validateNameSpace } from "../UtilityHandlers/StringHandler";

export default function alterClassCommandHandler(commandArray, alteringClass, renameIndex) {
    console.log(commandArray);
    console.log(alteringClass);

    const handledAlteringClass = alteringClass;
    
    if(renameIndex !== -1) {
        handledAlteringClass.entityName = alterNameHandler(commandArray[renameIndex + 1]);
    }

    return handledAlteringClass;
}

function alterNameHandler(oldName) {
    const newName = upperCaseFirstLetter(validateNameSpace(oldName.toLowerCase()));

    return newName;
}