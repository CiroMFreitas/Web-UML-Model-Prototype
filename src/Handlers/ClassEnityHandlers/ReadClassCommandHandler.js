import { upperCaseFirstLetter } from "../UtilityHandlers/StringHandler";

export default function ReadClassCommandHandler(commandArray, classEntities, relationshipEntities) {
    const feedback = [];
    const classname = upperCaseFirstLetter(commandArray[0].toLowerCase());
    const classEntity = classEntities.find((classEntity) => classname === classEntity.name);

    if(!classEntity) {
        feedback.push({
            type: "locale",
            content: "command.read.class.not_found.part1"
        });
        feedback.push({
            type: "string",
            content: upperCaseFirstLetter(classname.toLowerCase())
        }); 
        feedback.push({
            type: "locale",
            content: "command.read.class.not_found.part2"
        });

        return feedback;
    }

    feedback.push({
        type: "locale",
        content: "command.read.class.feedback.start"
    });
    feedback.push({
        type: "string",
        content: classEntity.name
    }); 

    if(commandArray.length === 1) {
        feedback.push({
            type: "locale",
            content: "command.read.class.feedback.exists"
        });
    }

   if(commandArray.includes("-a")) {
        if(classEntity.attributes.length === 0) {
            feedback.push({
                type: "locale",
                content: "command.read.class.feedback.attribute.none"
            });
        } else {
            if(classEntity.attributes.length > 1) {
                feedback.push({
                    type: "locale",
                    content: "command.read.class.feedback.attribute.plural"
                });
            } else {
                feedback.push({
                    type: "locale",
                    content: "command.read.class.feedback.attribute.singular"
                });
            }
    
            classEntity.attributes.forEach((attribute) => {
                feedback.push({
                    type: "string",
                    content: "; " + attribute.visibility
                });
                feedback.push({
                    type: "string",
                    content: " " + attribute.name
                });
                feedback.push({
                    type: "string",
                    content: " " + attribute.type
                });
            });
        }
    }

    if(commandArray.includes("-m")) {
        if(classEntity.methods.length === 0) {
            feedback.push({
                type: "locale",
                content: "command.read.class.feedback.method.none"
            });
        } else {
            if(classEntity.methods.length > 1) {
                feedback.push({
                    type: "locale",
                    content: "command.read.class.feedback.method.plural"
                });
            } else {
                feedback.push({
                    type: "locale",
                    content: "command.read.class.feedback.method.singular"
                });
            }
    
            classEntity.methods.forEach((method) => {
                feedback.push({
                    type: "string",
                    content: "; " + method.visibility
                });
                feedback.push({
                    type: "string",
                    content: " " + method.name
                });
                feedback.push({
                    type: "string",
                    content: " " + method.type
                });
    
                if(method.parameters.length === 0) {
                    feedback.push({
                        type: "locale",
                        content: "command.read.class.feedback.parameter.none"
                    });
                } else {
                    if(method.parameters.length > 1) {
                        feedback.push({
                            type: "locale",
                            content: "command.read.class.feedback.parameter.plural"
                        });
                    } else {
                        feedback.push({
                            type: "locale",
                            content: "command.read.class.feedback.parameter.singular"
                        });
                    }

                    method.parameters.forEach((parameter) => {
                        feedback.push({
                            type: "string",
                            content: "; " + parameter.name
                        });
                        feedback.push({
                            type: "string",
                            content: " " + parameter.type
                        });
                    });

                    if(method.parameters.length > 1) {
                        feedback.push({
                            type: "locale",
                            content: "command.read.class.feedback.parameter.last"
                        });
                    }
                }
            });
        }
    }

    if(commandArray.includes("-r")) {
        const classId = classEntity.id;
        const classRelationships = relationshipEntities.map((relationship) => {
            if((relationship.primaryClassId === classId) || (relationship.secondaryClassId === classId)) {
                return relationship;
            }
        });

        const relationshipAmount = classRelationships.length;
        if(relationshipAmount < 1) {
            feedback.push({
                type: "locale",
                content: "command.read.class.feedback.relationship.empty"
            });
        } else {
            classRelationships.forEach((relationship) => {
                feedback.push({
                    type: "locale",
                    content: "command.read.class.feedback.relationship.found"
                });
                feedback.push({
                    type: "string",
                    content: relationship.name
                });
                feedback.push({
                    type: "locale",
                    content: "command.read.class.feedback.relationship.with"
                });

                let classRelationship;
                if(relationship.primaryClassId === classId) {
                    classRelationship = classEntities.find((classEntity) => classEntity.id === relationship.secondaryClassId);
                } else {
                    classRelationship = classEntities.find((classEntity) => classEntity.id === relationship.primaryClassId);
                }
                feedback.push({
                    type: "string",
                    content: classRelationship.name
                });

                if((relationship.primaryCardinality !== "") && (relationship.secondaryCardinality !== "")) {
                    feedback.push({
                        type: "locale",
                        content: "command.read.class.feedback.relationship.cardinality"
                    });

                    if(relationship.primaryCardinality !== "") {
                        feedback.push({
                            type: "string",
                            content: relationship.primaryCardinality
                        });
                    } else {
                        feedback.push({
                            type: "locale",
                            content: "command.read.class.feedback.relationship.not_specified_cardinality"
                        });
                    }

                    feedback.push({
                        type: "locale",
                        content: "command.read.class.feedback.relationship.to_cardinality"
                    });

                    if(relationship.secondaryCardinality !== "") {
                        feedback.push({
                            type: "string",
                            content: relationship.secondaryCardinality
                        });
                    } else {
                        feedback.push({
                            type: "locale",
                            content: "command.read.class.feedback.relationship.not_specified_cardinality"
                        });
                    }
                } else {
                    feedback.push({
                        type: "locale",
                        content: "command.read.class.feedback.relationship.no_cardinality"
                    });
                }
            });
        }
    }

    if(feedback.length === 2) {
        throw "error.command_syntax";
    }

    return feedback;
}