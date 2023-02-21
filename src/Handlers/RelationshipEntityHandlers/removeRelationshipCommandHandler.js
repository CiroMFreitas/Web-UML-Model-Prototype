import { useTranslation } from 'react-i18next'


export default function RemoveRelationshipCommandHandler(commandArray, relationshipEntities) {
    const relationshipName = commandArray.shift();
    const removingRelationship = relationshipEntities.find((relationshipEntity) => relationshipEntity.name === relationshipName);
    const { t } = useTranslation();

    if(removingRelationship) {
        return relationshipEntities.filter((relationshipEntity) => relationshipEntity !== removingRelationship);
    } else {
        throw t("error.relationship_not_found");
    }
}