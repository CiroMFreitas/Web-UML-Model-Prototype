import { SUPPORTED_RELATIONSHIP_TYPES } from "../../Utils/SupportedKeyWords";

import { useTranslation } from 'react-i18next'

export default function ReadRelationshipCommandHandler(commandArray, relationshipEntities, classEntities) {
    const relationshipName = commandArray.shift();
    const { t } = useTranslation();
    
    const relationship = relationshipEntities.find((relationship) => relationship.name = relationshipName)

    if(!relationship) {
        return t("command.read.relatioship.not_found.part1") + relationship + t("command.read.relatioship.not_found.part2");
    }

    let feedback = t("command.read.relatioship.feedback.start") +
        SUPPORTED_RELATIONSHIP_TYPES[relationship.relationshipType][1] +
        t("command.read.relatioship.feedback.named") +
        relationship.name;

    if(relationship.primaryClassId === relationship.secondaryClassId) {
        feedback += t("command.read.relatioship.feedback.reflexive") + classEntities.find((classEntity) => classEntity.id === relationship.primaryClassId).name;
    } else {
        feedback += t("command.read.relatioship.feedback.between") +
        classEntities.find((classEntity) => classEntity.id === relationship.primaryClassId).name +
        " " +
        classEntities.find((classEntity) => classEntity.id === relationship.secondaryClassId).name;
    }

    if((relationship.primaryCardinality === "") && (relationship.secondaryCardinality === "")) {
        feedback += t("command.read.relatioship.feedback.cardinality.no");
    } else {
        feedback += t("command.read.relatioship.feedback.cardinality.yes");

        if(relationship.primaryCardinality === "") {
            feedback += t("command.read.relatioship.feedback.cardinality.no_origin");
        } else {
            feedback += relationship.primaryCardinality;
        }

        feedback += t("command.read.relatioship.feedback.cardinality.to");

        if(relationship.secondaryCardinality === "") {
            feedback += t("command.read.relatioship.feedback.cardinality.no_destination");
        } else {
            feedback += relationship.secondaryCardinality;
        }
    }

    return feedback;
}