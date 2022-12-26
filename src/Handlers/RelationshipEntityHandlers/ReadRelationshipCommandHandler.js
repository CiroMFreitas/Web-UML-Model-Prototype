import { SUPPORTED_RELATIONSHIP_TYPES } from "../../Utils/SupportedKeyWords";

export default function readRelationshipCommandHandler(commandArray, relationshipEntities, classEntities) {
    const relationshipName = commandArray.shift();
    
    const relationship = relationshipEntities.find((relationship) => relationship.name = relationshipName)

    if(!relationship) {
        return "A relação " + relationship + " não existe no projeto!";
    }

    let feedback = "A relação " +
    SUPPORTED_RELATIONSHIP_TYPES[relationship.relationshipType][1] +
    " nomeada " +
    relationship.name;

    if(relationship.primaryClassId === relationship.secondaryClassId) {
        feedback += " da classe " + classEntities.find((classEntity) => classEntity.id === relationship.primaryClassId).name;
    } else {
        feedback += " entre as classes " +
        classEntities.find((classEntity) => classEntity.id === relationship.primaryClassId).name +
        " " +
        classEntities.find((classEntity) => classEntity.id === relationship.secondaryClassId).name;
    }

    if((relationship.primaryCardinality === "") && (relationship.secondaryCardinality === "")) {
        feedback += " sem cardinalidade";
    } else {
        feedback += " com cardinalidade ";

        if(relationship.primaryCardinality === "") {
            feedback += " de origem não especificada ";
        } else {
            feedback += relationship.primaryCardinality;
        }

        feedback += " para ";

        if(relationship.secondaryCardinality === "") {
            feedback += "cardinalidade de destino não especificada";
        } else {
            feedback += relationship.secondaryCardinality;
        }
    }

    return feedback;
}