import { ERROR_RELATIONSHIP_DOES_NOT_EXISTS } from "../../Utils/Errors";
import { upperCaseFirstLetter } from "../UtilityHandlers/StringHandler";


export default function removeRelationshipCommandHandler(commandArray, relationshipEntities) {
    const relationshipName = commandArray.shift();
    const removingRelationship = relationshipEntities.find((relationshipEntity) => relationshipEntity.name === relationshipName);

    if(removingRelationship) {
        return relationshipEntities.filter((relationshipEntity) => relationshipEntity !== removingRelationship);
    } else {
        throw ERROR_RELATIONSHIP_DOES_NOT_EXISTS;
    }
}