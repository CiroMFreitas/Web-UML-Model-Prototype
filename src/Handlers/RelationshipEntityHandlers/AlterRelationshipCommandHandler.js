import { useTranslation } from 'react-i18next';

import { GetArgumentsValueIndex } from "../UtilityHandlers/DataHandler";

export default function AlterRelationshipCommandHandler(commandArray, alteringRelationship, classEntities) {
    const handledAlteringRelationship = alteringRelationship;
    const { t } = useTranslation();
    
    const renameIndex = GetArgumentsValueIndex(commandArray, "-n");
    if(renameIndex !== 0) {
        handledAlteringRelationship.name = commandArray[renameIndex];
    }

    const primaryClassIndex = GetArgumentsValueIndex(commandArray, "-pc");
    if(primaryClassIndex !== 0) {
        const newPrimaryClass = classEntities.find((classEntity) => classEntity.name === commandArray[primaryClassIndex]).id;

        if(newPrimaryClass) {
            handledAlteringRelationship.primaryClassId = newPrimaryClass;
        } else {
            throw t("error.class_not_found");
        }
    }

    const secondaryClassIndex = GetArgumentsValueIndex(commandArray, "-sc");
    if(secondaryClassIndex !== 0) {
        const newSecondaruClass = classEntities.find((classEntity) => classEntity.name === commandArray[secondaryClassIndex]).id;
        if(newSecondaruClass) {
            handledAlteringRelationship.secondaryClassId = newSecondaruClass;
        } else {
            throw t("error.class_not_found");
        }
    }

    const cardinalityIndex = GetArgumentsValueIndex(commandArray, "-c");
    if(cardinalityIndex !== 0) {
        const cardinality = commandArray[cardinalityIndex].split(":");

        if(cardinality.length === 2) {
            handledAlteringRelationship.primaryCardinality = cardinality[0];
            handledAlteringRelationship.secondaryCardinality = cardinality[1];
        } else {
            throw t("error.invalid_cadinality");
        }
    }

    return handledAlteringRelationship;
}
