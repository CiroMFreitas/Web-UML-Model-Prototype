import { upperCaseFirstLetter, validateNameSpace } from "../UtilityHandlers/StringHandler";

export default function alterClassCommandHandler(commandArray, alteringClass) {
    console.log(commandArray);
    console.log(alteringClass);

    const handledAlteringClass = alteringClass;

    const renameIndex = commandArray.indexOf("-n");
    if(renameIndex) {
        handledAlteringClass.entityName = alterNameHandler(commandArray[renameIndex + 1]);
    }

    return handledAlteringClass;
}

function alterNameHandler(oldName) {
    const newName = upperCaseFirstLetter(validateNameSpace(oldName.toLowerCase()));

    return newName;
}