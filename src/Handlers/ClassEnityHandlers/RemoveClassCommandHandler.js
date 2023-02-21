import { useTranslation } from 'react-i18next';

import { upperCaseFirstLetter } from "../UtilityHandlers/StringHandler";

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