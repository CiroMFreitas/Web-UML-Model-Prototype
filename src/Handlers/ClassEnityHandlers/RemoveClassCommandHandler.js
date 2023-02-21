import { upperCaseFirstLetter } from "../UtilityHandlers/StringHandler";

import { useTranslation } from 'react-i18next'


export default function RemoveClassCommandHandler(commandArray, classEntities) {
    const className = upperCaseFirstLetter(commandArray[0].toLowerCase());
    const removingClass = classEntities.find((classEntity) => classEntity.name === className);
    const { t } = useTranslation();

    if(removingClass) {
        return classEntities.filter((classEntity) => classEntity !== removingClass);
    } else {
        throw t("error.class_not_found");
    }
}