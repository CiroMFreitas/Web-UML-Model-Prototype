import { ERROR_CLASS_DOES_NOT_EXISTS, ERROR_INSUFFICIENT_ARGUMENTS, ERROR_INVALID_CARDINALITY, ERROR_INVALID_RELATIONSHIP_TYPE } from "../../Utils/Errors";
import { SUPPORTED_RELATIONSHIP_TYPES } from "../../Utils/SupportedKeyWords";
import { getKeyByValue } from "../UtilityHandlers/DataHandler";
import { upperCaseFirstLetter, validateNameSpace } from "../UtilityHandlers/StringHandler";

/**
 * Handles command returning an object to be used as a relationshipEntity.
 * 
 * @param {String} commandArray 
 */
export default function createRelationshipCommandHandler(commandArray, classEntities) {
    console.log(commandArray)
    console.log(classEntities)
    // Checks if a sufficient number of arguments is present
    if(commandArray.length < 3) {
        throw ERROR_INSUFFICIENT_ARGUMENTS;
    }

    // Checks if relationship type is valid
    const relationshipType = getKeyByValue(SUPPORTED_RELATIONSHIP_TYPES, commandArray[0]);
    if(!relationshipType) {
        throw ERROR_INVALID_RELATIONSHIP_TYPE;
    }

    // Validates classes names and see if they exist
    const primaryClassName = upperCaseFirstLetter(validateNameSpace(commandArray[1].toLowerCase()))
    const primaryClassExists = classEntities.find((classEntity) => classEntity.entityName === primaryClassName);
    if(!primaryClassExists) {
        throw ERROR_CLASS_DOES_NOT_EXISTS;
    }

    const secondaryClassName = upperCaseFirstLetter(validateNameSpace(commandArray[2].toLowerCase()))
    const secondaryClassExists = classEntities.find((classEntity) => classEntity.entityName === secondaryClassName);
    if(!secondaryClassExists) {
        throw ERROR_CLASS_DOES_NOT_EXISTS;
    }
    
    let cardinality = [];
    if(commandArray.length > 3) {
        cardinality = commandArray[3].split(":");

        if(cardinality.length !== 2) {
            throw ERROR_INVALID_CARDINALITY;
        }
    } else {
        cardinality = ["", ""];
    }

    return {
        relationshipType,
        primaryClassName,
        secondaryClassName,
        primaryCardinality: cardinality[0],
        secondaryCardinality: cardinality[1]
    }
}