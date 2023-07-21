export default function RemoveRelationshipCommandHandler(commandArray, relationshipEntities) {
    const relationshipName = commandArray.shift();
    const removingRelationship = relationshipEntities.find((relationshipEntity) => relationshipEntity.name === relationshipName);

    if(removingRelationship) {
        return relationshipEntities.filter((relationshipEntity) => relationshipEntity !== removingRelationship);
    } else {
        throw "error.relationship_not_found";
    }
}