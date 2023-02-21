import { useTranslation } from 'react-i18next';

import { SUPPORTED_RELATIONSHIP_TYPES } from "../../Utils/SupportedKeyWords";
import { getArgumentsValueIndex, getKeyByValue } from "../UtilityHandlers/DataHandler";
import { upperCaseFirstLetter, validateNameSpace } from "../UtilityHandlers/StringHandler";

/**
 * Handles command returning an object to be used as a relationshipEntity.
 * 
 * @param {String} commandArray 
 */
export default function CreateRelationshipCommandHandler(commandArray, classEntities) {
    const { t } = useTranslation();

    // Checks if a sufficient number of arguments is present
    if(commandArray.length < 3) {
        throw t("error.insufficient_arguments");
    }

    // Checks if relationship type is valid
    const relationshipType = getKeyByValue(SUPPORTED_RELATIONSHIP_TYPES, commandArray.shift());
    if(!relationshipType) {
        throw t("error.not_supported_relationship_type");
    }

    // Validates classes names and see if they exist
    const primaryClassName = upperCaseFirstLetter(validateNameSpace(commandArray.shift().toLowerCase()))
    const primaryClassExists = classEntities.find((classEntity) => classEntity.name === primaryClassName);
    if(!primaryClassExists) {
        throw t("error.class_not_found");
    }

    const secondaryClassName = upperCaseFirstLetter(validateNameSpace(commandArray.shift().toLowerCase()))
    const secondaryClassExists = classEntities.find((classEntity) => classEntity.name === secondaryClassName);
    if(!secondaryClassExists) {
        throw t("error.class_not_found");
    }

    // Gets relationship or generates one if none is given
    const nameIndex = getArgumentsValueIndex(commandArray, "-n");
    let relationshipName;
    if(nameIndex === 0) {
        relationshipName = primaryClassName + relationshipType + secondaryClassName;
    } else {
        relationshipName = commandArray[nameIndex];
    }
    
    const cardinalityIndex = getArgumentsValueIndex(commandArray, "-c");
    let cardinality;
    if(cardinalityIndex !== 0) {
        cardinality = commandArray[cardinalityIndex].split(":");

        if(cardinality.length !== 2) {
            throw t("error.invalid_cadinality");
        }
    } else {
        cardinality = ["", ""];
    }

    return {
        name: relationshipName,
        relationshipType,
        primaryClassId: primaryClassExists.id,
        secondaryClassId: secondaryClassExists.id,
        primaryCardinality: cardinality[0],
        secondaryCardinality: cardinality[1]
    }
}