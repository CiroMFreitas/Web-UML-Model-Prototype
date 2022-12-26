import { ERROR_COMMAND_SYNTAX } from "../../Utils/Errors";
import { SUPPORTED_ALTER_ARGUMENTS, SUPPORTED_VISIBILITY } from "../../Utils/SupportedKeyWords";
import { attributesFormatter, getArgumentsValueIndex, getKeyByValue, methodsFormatter } from "../UtilityHandlers/DataHandler";
import { upperCaseFirstLetter, validateNameSpace } from "../UtilityHandlers/StringHandler";

export default function AlterRelationshipCommandHandler(commandArray, alteringRelationship, classEntities) {
    const handledAlteringRelationship = alteringRelationship;
    
    const renameIndex = getArgumentsValueIndex(commandArray, "-n");
    if(renameIndex !== 0) {
        handledAlteringRelationship.name = commandArray[renameIndex];
    }

    const primaryClassIndex = getArgumentsValueIndex(commandArray, "-pc");
    if(primaryClassIndex !== 0) {
        handledAlteringRelationship.primaryClassId = classEntities.find((classEntity) => classEntity.name === commandArray[primaryClassIndex]).id
    }

    const secondaryClassIndex = getArgumentsValueIndex(commandArray, "-sc");
    if(secondaryClassIndex !== 0) {
        handledAlteringRelationship.secondaryClassId = classEntities.find((classEntity) => classEntity.name === commandArray[secondaryClassIndex]).id
    }

    const cardinalityIndex = getArgumentsValueIndex(commandArray, "-c");
    if(cardinalityIndex !== 0) {
        const cardinality = commandArray[cardinalityIndex].split(":");
        handledAlteringRelationship.primaryCardinality = cardinality[0];
        handledAlteringRelationship.secondaryCardinality = cardinality[1];
    }

    return handledAlteringRelationship;
}
