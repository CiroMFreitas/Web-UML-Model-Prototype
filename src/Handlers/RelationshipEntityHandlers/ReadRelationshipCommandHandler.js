import { SUPPORTED_RELATIONSHIP_TYPES } from "../../Utils/SupportedKeyWords";

export default function ReadRelationshipCommandHandler(commandArray, relationshipEntities, classEntities) {
    const feedback = [];
    const relationshipName = commandArray.shift();
                
    const relationship = relationshipEntities.find((relationship) => relationship.name = relationshipName)

    if(!relationship) {
        feedback.push({
            type: "locale",
            content: "command.read.relatioship.not_found.part1"
        });
        feedback.push({
            type: "string",
            content: relationship
        });
        feedback.push({
            type: "locale",
            content: "command.read.relatioship.not_found.part2"
        });

        return feeedback;
    }
    
    feedback.push({
        type: "locale",
        content: "command.read.relatioship.feedback.start"
    });
    feedback.push({
        type: "string",
        content: SUPPORTED_RELATIONSHIP_TYPES[relationship.relationshipType][1]
    });
    feedback.push({
        type: "locale",
        content: "command.read.relatioship.not_found.part1"
    });
    feedback.push({
        type: "string",
        content: relationship.name
    });

    if(relationship.primaryClassId === relationship.secondaryClassId) {
        feedback.push({
            type: "locale",
            content: "command.read.relatioship.feedback.reflexive"
        });
        feedback.push({
            type: "string",
            content: classEntities.find((classEntity) => classEntity.id === relationship.primaryClassId).name
        });
    } else {
        feedback.push({
            type: "locale",
            content: "command.read.relatioship.feedback.between"
        });
        feedback.push({
            type: "string",
            content:  classEntities.find((classEntity) => classEntity.id === relationship.primaryClassId).name + " " + classEntities.find((classEntity) => classEntity.id === relationship.secondaryClassId).name
        });
    }

    if((relationship.primaryCardinality === "") && (relationship.secondaryCardinality === "")) {
        feedback.push({
            type: "locale",
            content: "command.read.relatioship.feedback.cardinality.no"
        });
    } else {
        feedback.push({
            type: "locale",
            content: "command.read.relatioship.feedback.cardinality.yes"
        });

        if(relationship.primaryCardinality === "") {
            feedback.push({
                type: "locale",
                content: "command.read.relatioship.feedback.cardinality.no_origin"
            });
        } else {
            feedback.push({
                type: "string",
                content:  relationship.primaryCardinality
            });
        }

        if(relationship.primaryCardinality === "") {
            feedback.push({
                type: "locale",
                content: "command.read.relatioship.feedback.cardinality.to"
            });

            if(relationship.secondaryCardinality === "") {
                feedback.push({
                    type: "locale",
                    content: "command.read.relatioship.feedback.cardinality.no_destination"
                });
            } else {
                feedback.push({
                    type: "string",
                    content:  relationship.secondaryCardinality
                });
            }
        }
    }

    return feedback;
}