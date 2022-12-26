import { ERROR_CLASS_DOES_NOT_EXISTS } from "../../Utils/Errors";
import { upperCaseFirstLetter } from "../UtilityHandlers/StringHandler";


export default function removeClassCommandHandler(commandArray, classEntities) {
    const className = upperCaseFirstLetter(commandArray[0].toLowerCase());
    const removingClass = classEntities.find((classEntity) => classEntity.name === className);

    if(removingClass) {
        return classEntities.filter((classEntity) => classEntity !== removingClass);
    } else {
        throw ERROR_CLASS_DOES_NOT_EXISTS;
    }
}