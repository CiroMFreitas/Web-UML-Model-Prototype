import { ERROR_CLASS_DOES_NOT_EXISTS, ERROR_INSUFFICIENT_ARGUMENTS, ERROR_INVALID_CARDINALITY, ERROR_INVALID_RELATIONSHIP_TYPE } from "../../Utils/Errors";
import { SUPPORTED_RELATIONSHIP_TYPES } from "../../Utils/SupportedKeyWords";
import { getArgumentsValueIndex, getKeyByValue } from "../UtilityHandlers/DataHandler";
import { upperCaseFirstLetter, validateNameSpace } from "../UtilityHandlers/StringHandler";

/**
 * Handles command returning an object to be used as a relationshipEntity.
 * 
 * @param {String} commandArray 
 */
export default function CreateRelationshipCommandHandler(commandArray, classEntities) {
    // Checks if a sufficient number of arguments is present
    if(commandArray.length < 3) {
        throw ERROR_INSUFFICIENT_ARGUMENTS;
    }

    // Checks if relationship type is valid
    const relationshipType = getKeyByValue(SUPPORTED_RELATIONSHIP_TYPES, commandArray.shift());
    if(!relationshipType) {
        throw ERROR_INVALID_RELATIONSHIP_TYPE;
    }

    // Validates classes names and see if they exist
    const primaryClassName = upperCaseFirstLetter(validateNameSpace(commandArray.shift().toLowerCase()))
    const primaryClassExists = classEntities.find((classEntity) => classEntity.name === primaryClassName);
    if(!primaryClassExists) {
        throw ERROR_CLASS_DOES_NOT_EXISTS;
    }

    const secondaryClassName = upperCaseFirstLetter(validateNameSpace(commandArray.shift().toLowerCase()))
    const secondaryClassExists = classEntities.find((classEntity) => classEntity.name === secondaryClassName);
    if(!secondaryClassExists) {
        throw ERROR_CLASS_DOES_NOT_EXISTS;
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
            throw ERROR_INVALID_CARDINALITY;
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