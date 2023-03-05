//import { useTranslation } from 'react-i18next';

import { SUPPORTED_RELATIONSHIP_TYPES } from "../../Utils/SupportedKeyWords";
import { GetArgumentsValueIndex, getKeyByValue } from "../UtilityHandlers/DataHandler";
import { upperCaseFirstLetter, validateNameSpace } from "../UtilityHandlers/StringHandler";

/**
 * Handles command returning an object to be used as a relationshipEntity.
 * 
 * @param {String} commandArray 
 */
export default function CreateRelationshipCommandHandler(commandArray, classEntities) {

    // Checks if a sufficient number of arguments is present
    if(commandArray.length < 3) {
        throw "error.invalid_relationship_arguments";
    }

    // Checks if relationship type is valid
    const relationshipType = SUPPORTED_RELATIONSHIP_TYPES[commandArray.shift()];
    if(!relationshipType) {
        throw "error.unrecognized_relationship_type";
    }

    // Validates classes names and see if they exist
    const primaryClassName = upperCaseFirstLetter(validateNameSpace(commandArray.shift().toLowerCase()))
    const primaryClassExists = classEntities.find((classEntity) => classEntity.name === primaryClassName);
    if(!primaryClassExists) {
        throw "error.primary_class_not_found";
    }

    const secondaryClassName = upperCaseFirstLetter(validateNameSpace(commandArray.shift().toLowerCase()))
    const secondaryClassExists = classEntities.find((classEntity) => classEntity.name === secondaryClassName);
    if(!secondaryClassExists) {
        throw "error.secondary_class_not_found";
    }

    // Gets relationship or generates one if none is given
    const nameIndex = GetArgumentsValueIndex(commandArray, "-n");
    let relationshipName;
    if(nameIndex === 0) {
        relationshipName = primaryClassName + relationshipType + secondaryClassName;
    } else {
        relationshipName = commandArray[nameIndex];
    }
    
    const cardinalityIndex = GetArgumentsValueIndex(commandArray, "-c");
    const cardinality = {
        primary: "",
        secondary: ""
    };
    if(cardinalityIndex !== 0) {
        const cardinalityArgument = commandArray[cardinalityIndex].split(":");

        if(cardinality.length !== 2) {
            throw "error.invalid_cadinality";
        }
        const cardinality = {
            primary: cardinalityArgument[0],
            secondary:  cardinalityArgument[1]
        };
    }

    return {
        name: relationshipName,
        relationshipType,
        primaryClassId: primaryClassExists.id,
        secondaryClassId: secondaryClassExists.id,
        cardinality: cardinality
    }
}