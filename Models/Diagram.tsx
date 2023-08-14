import IAlterRelationshipDTO from "../public/DTO/IAlterRelationshipDTO";
import ICreateClassifierDTO from "../public/DTO/ICreateClassifierDTO";
import IDiagramCreateRelationshipDTO from "../public/DTO/IDiagramCreateRelationshipDTO";
import IReadClassifierDTO from "../public/DTO/IReadClassifierDTO";
import IReadRelationshipByBetweenDTO from "../public/DTO/IReadRelationshipByBetweenDTO";
import IReadRelationshipByNamedDTO from "../public/DTO/IReadRelationshipByNamedDTO";
import AppError from "./AppError";
import Classifier from "./Classifier";
import Feedback from "./Feedback";
import LocalizationSnippet from "./LocalizationSnippet";
import Relationship from "./Relationship";
import StringSnippet from "./StringSnippet";

/**
 * Object responsible for holding and managing all diagram entities.
 */
export default class Diagram {
    private classifiers = [] as Classifier[];
    private relationships = [] as Relationship[];

    /**
     * Sets an empty diagram.
     */
    constructor() { }

    /**
     * Creates a classifier inside the diagram.
     * 
     * @param classifierCreationInstructions Instructions to be handled and executed for classifier creation.
     * @returns Feedback containing a success message.
     */
    public createClassifier(classifierCreationInstructions: ICreateClassifierDTO): Feedback {
        // Checks if given name is already in use.
        const newClassifier = new Classifier(classifierCreationInstructions);
        this.isClassifierNameInUse(newClassifier.getName());

        this.classifiers.push(newClassifier);
            
        const feedback = new Feedback();
        feedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.part_1"));
        feedback.addSnippet(new LocalizationSnippet("feedback.common.classifier_type."+newClassifier.getClassifierType()));
        feedback.addSnippet(new StringSnippet(" "+newClassifier.getName()));
        feedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.part_2"));

        return feedback;
    }

    /**
     * Read a classifier with command line instructions.
     * 
     * @param readClassifierInstructions Instructions to be executed for classifier reading.
     * @returns Feedback containing the desired classifier indormation.
     */
    public readClassifier(readClassifierInstructions: IReadClassifierDTO): Feedback {
        const toReadClassifier = this.getClassifierByName(readClassifierInstructions.classifierName);
        const readFeedback = toReadClassifier.toText(readClassifierInstructions);
        return readFeedback;
    }
    
    /**
     * Removes a classifier by command line instructions.
     * 
     * @param commandLineArray An array containing the classifier name in first position.
     * @returns Feedback if the removal was successful..
     */
    public removeClassifierByCommand(commandLineArray: string[]): Feedback {
        const classifierName = commandLineArray?.shift()?.toLowerCase();

        // Checks if classifier name is present.
        if((classifierName === undefined) || (classifierName === "")) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.remove.classifier.error.missing_name_for_removal"));

            throw new AppError(errorFeedback);
        } else {
            const toRemoveClassifierIndex = this.getClassifierIndexByName(classifierName);
            this.classifiers.splice(toRemoveClassifierIndex, 1);

            const removeFeedback = new Feedback();
            removeFeedback.addSnippet(new LocalizationSnippet("feedback.remove.classifier.success.part_1"));
            removeFeedback.addSnippet(new StringSnippet(classifierName));
            removeFeedback.addSnippet(new LocalizationSnippet("feedback.remove.classifier.success.part_2"));
            return removeFeedback;
        }
    }

    /**
     * Alters a classifier following instructions inside an array.
     * 
     * @param commandLineArray Array containing instructions to be handled.
     * @returns Feedback should alteration succeed.
     */
    public alterClassifierByCommand(commandLineArray: string[]): Feedback {
        const classifierName = commandLineArray?.shift()?.toLowerCase();

        // Checks if classifier name is present.
        if((classifierName === undefined) || (classifierName === "")) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.error.entity_type_missing_on_alteration"));

            throw new AppError(errorFeedback);
        } else {
            const toAlterClassifier = this.getClassifierByName(classifierName);

            // Checks and changes classifier's name if desired.
            const nameChangeArgument = this.getCommandArgumentContent(commandLineArray, "-n");
            if(nameChangeArgument !== undefined) {
                toAlterClassifier.setName(nameChangeArgument[0]);
            }

            // Checks and changes classifier's attributes if desired.
            const attributesChangeArgument = this.getCommandArgumentContent(commandLineArray, "-a");
            if(attributesChangeArgument !== undefined) {
                toAlterClassifier.alterAttributes(attributesChangeArgument);
            }

            // Checks and changes classifier's methods if desired.
            const methodsChangeArgument = this.getCommandArgumentContent(commandLineArray, "-m");
            if(methodsChangeArgument !== undefined) {
                toAlterClassifier.alterMethods(methodsChangeArgument);
            }
    
            const alterClassifierFeedback = new Feedback();
            alterClassifierFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.part_1"));
            alterClassifierFeedback.addSnippet(new LocalizationSnippet("feedback.common.classifier_type."+toAlterClassifier.getClassifierType()));
            alterClassifierFeedback.addSnippet(new StringSnippet(" "+toAlterClassifier.getName()));
            alterClassifierFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.part_2"));
            return alterClassifierFeedback;
        }
    }

    /**
     * Creates a relationship in diagram following DTO instructions.
     * 
     * @param relationshipCreationInstructions Instructions to be handled and executed for relationship
     * creation.
     * @returns Feedback containing a success message.
     */
    public createRelationship(relationshipCreationInstructions: IDiagramCreateRelationshipDTO): Feedback {
        // Checks if classifiers's names were given.
        const desiredSourceClassifier = this.getClassifierByName(relationshipCreationInstructions.sourceClassifierName);
        const desiredTargetClassifier = this.getClassifierByName(relationshipCreationInstructions.targetClassifierName);
        
        // Checks if name was given, if not generates a name.
        let autoGeneratedName = "";
        if(relationshipCreationInstructions.relationshipName === undefined) {
            let nameInUse = false;
            autoGeneratedName = desiredSourceClassifier.getName() + "_" + desiredTargetClassifier.getName();
            let count = 0;
            do {
                const relationshipExists = this.relationships.find((relationship) => relationship.getName() === autoGeneratedName);
                if(relationshipExists) {
                    autoGeneratedName = desiredSourceClassifier.getName() + "_" + desiredTargetClassifier.getName() + (count > 0 ? "_" + count : "");
                    count++;
                    nameInUse = true;
                } else {
                    nameInUse = false;
                }
            } while(nameInUse)
        } else {
            this.isRelationshipNameInUse(relationshipCreationInstructions.relationshipName);
        }

        const newRelationship = new Relationship({
            relationshipName: relationshipCreationInstructions.relationshipName !== undefined ? relationshipCreationInstructions.relationshipName : autoGeneratedName,
            sourceClassifierId: desiredSourceClassifier.getId(),
            targetClassifierId: desiredTargetClassifier.getId(),
            relatioshipType: relationshipCreationInstructions.relatioshipType,
            attribute: relationshipCreationInstructions.attribute
        });
        this.relationships.push(newRelationship);

        const relationshipCreationFeedback = new Feedback();
        relationshipCreationFeedback.addSnippet(new LocalizationSnippet("feedback.create.ralationship.success.part_1"));
        relationshipCreationFeedback.addSnippet(new LocalizationSnippet("feedback.common.relationship_type."+newRelationship.getRelationshipType()));
        relationshipCreationFeedback.addSnippet(new LocalizationSnippet("feedback.create.ralationship.success.part_2"));
        relationshipCreationFeedback.addSnippet(new StringSnippet(desiredSourceClassifier.getName()));
        relationshipCreationFeedback.addSnippet(new LocalizationSnippet("feedback.create.ralationship.success.part_3"));
        relationshipCreationFeedback.addSnippet(new StringSnippet(desiredTargetClassifier.getName()));
        relationshipCreationFeedback.addSnippet(new LocalizationSnippet("feedback.create.ralationship.success.part_4"));
        relationshipCreationFeedback.addSnippet(new StringSnippet(newRelationship.getName()));
        relationshipCreationFeedback.addSnippet(new LocalizationSnippet("feedback.create.ralationship.success.part_5"));

        return relationshipCreationFeedback;
    }
    
    /**
     * Removes a relationship by command line instructions.
     * 
     * @param commandLineArray An array containing the instruvtions for relationship removal.
     * @returns Feedback if the removal was successful..
     */
    public removeRelatioshipByCommand(commandLineArray: string[]): Feedback {
        const removalDirection = commandLineArray?.shift()?.toLowerCase();

        switch(removalDirection) {
            // Removal by relationship name.
            case "named":
                const removingRelationshipName = commandLineArray?.shift();
                if((removingRelationshipName === undefined) || (removingRelationshipName === "")) {
                    const errorFeedback = new Feedback();
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.remove.relationship.error.missing_relationship_name_for_removal"));
        
                    throw new AppError(errorFeedback);
                } else {
                    const removingRelationshipIndex = this.getRelationshipIndexByName(removingRelationshipName);
                    this.relationships.splice(removingRelationshipIndex, 1);
                }
                break;

            // Reoval by related classifiers name.
            case "between":
                const sourceClassifierName = commandLineArray?.shift();
                const targetClassifierName = commandLineArray?.shift();
                if((sourceClassifierName === undefined) || (sourceClassifierName === "")) {
                    const errorFeedback = new Feedback();
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.remove.relationship.error.missing_source_classifier_name_for_removal"));
        
                    throw new AppError(errorFeedback);
                } else if((targetClassifierName === undefined) || (targetClassifierName === "")) {
                    const errorFeedback = new Feedback();
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.remove.relationship.error.missing_target_classifier_name_for_removal"));
        
                    throw new AppError(errorFeedback);
                } else {
                    const sourceClassifier = this.getClassifierByName(sourceClassifierName);
                    const targetClassifier = this.getClassifierByName(targetClassifierName);
                    const classifiersRelationshipsIndexes = this.relationships.map((relationship, index) => {
                        if((relationship.getSourceClassifierId() === sourceClassifier.getId()) && (relationship.getTargetClassifierId() === targetClassifier.getId())) {
                            return index;
                        }
                    });

                    if((classifiersRelationshipsIndexes === undefined) || (classifiersRelationshipsIndexes.length === 0)) {
                        const errorFeedback = new Feedback();
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.remove.relationship.error.no_relationship_found_with_classifiers.part_1"));
                        errorFeedback.addSnippet(new StringSnippet(sourceClassifierName));
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.remove.relationship.error.no_relationship_found_with_classifiers.part_2"));
                        errorFeedback.addSnippet(new StringSnippet(targetClassifierName));
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.remove.relationship.error.no_relationship_found_with_classifiers.part_3"));
            
                        throw new AppError(errorFeedback);
                    } else if(classifiersRelationshipsIndexes.length > 1) {
                        const errorFeedback = new Feedback();
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.remove.relationship.error.multiple_relationship_found_with_classifiers.part_1"));
                        errorFeedback.addSnippet(new StringSnippet(sourceClassifierName));
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.remove.relationship.error.multiple_relationship_found_with_classifiers.part_2"));
                        errorFeedback.addSnippet(new StringSnippet(targetClassifierName));
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.remove.relationship.error.multiple_relationship_found_with_classifiers.part_3"));
                        classifiersRelationshipsIndexes.forEach((relationshipIndex, index) => {
                            if(relationshipIndex !== undefined) {
                                if(classifiersRelationshipsIndexes.length > index+1) {
                                    errorFeedback.addSnippet(new StringSnippet(", " + this.relationships[relationshipIndex].getName()));
                                } else {
                                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.remove.relationship.error.multiple_relationship_found_with_classifiers.part_2"));
                                    errorFeedback.addSnippet(new StringSnippet(this.relationships[relationshipIndex].getName()))
                                }
                            }
                        });
            
                        throw new AppError(errorFeedback);
                    } else {
                        const removalIndex = classifiersRelationshipsIndexes[0];
                        if(removalIndex !== undefined) {
                            this.relationships.splice(removalIndex, 1);
                        }
                    }
                }
                break;
            
            default:
                const errorFeedback = new Feedback();
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.remove.relationship.error.invalid_direction"));
    
                throw new AppError(errorFeedback);
        }
        
        const removeFeedback = new Feedback();
        return removeFeedback;
    }
    
    /**
     * Reads one or more relationships in diagram following given instructions.
     * 
     * @param readInstrunctions Handled instrunctions.
     * @returns Feedback containg relationship(s) information.
     */
    public readRelationship(readInstrunctions: IReadRelationshipByNamedDTO | IReadRelationshipByBetweenDTO): Feedback {
        const readFeedback = new Feedback();
        const namedReadInstruction = readInstrunctions as IReadRelationshipByNamedDTO;
        const betweenReadInstruction = readInstrunctions as IReadRelationshipByBetweenDTO;

        switch(true) {
            case namedReadInstruction.relationshipName !== undefined:
                const toReadRelationship = this.getRelationshipByName(namedReadInstruction.relationshipName);
                const sourceClassifierByNamed = this.getClassifierById(toReadRelationship.getSourceClassifierId());
                const targetClassifierByNamed = this.getClassifierById(toReadRelationship.getTargetClassifierId());
                
                readFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.start"));
                readFeedback.mergeFeedback(toReadRelationship.toText());
                readFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.classifiers.part_1"));
                readFeedback.addSnippet(new StringSnippet(sourceClassifierByNamed.getName()));
                readFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.classifiers.part_2"));
                readFeedback.addSnippet(new StringSnippet(targetClassifierByNamed.getName()));
                readFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.classifiers.part_3"));
                break;

            case betweenReadInstruction.sourceClassifierName !== undefined &&
            betweenReadInstruction !== undefined:
                const sourceClassifierByBetween = this.getClassifierByName(betweenReadInstruction.sourceClassifierName);
                const targetClassifierByBetween = this.getClassifierByName(betweenReadInstruction.targetClassifierName);

                const classifiersRelationships = this.getClassifiersRelationships(sourceClassifierByBetween.getId(), targetClassifierByBetween.getId())

                if(classifiersRelationships.length === 0) {
                    readFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.classifiers_relationships.part_1.not_found"));
                } else if(classifiersRelationships.length === 1) {
                    readFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.classifiers_relationships.part_1.found.singular.start"));
                    readFeedback.mergeFeedback(classifiersRelationships[0].toText())
                    readFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.classifiers_relationships.part_1.found.singular.end"));
                } else {
                    readFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.classifiers_relationships.part_1.found.plural.start"));

                    classifiersRelationships.forEach((classifiersRelationship, index) => {
                        if(classifiersRelationships.length !== index+1) {
                            readFeedback.addSnippet(new StringSnippet(", "))
                            readFeedback.mergeFeedback(classifiersRelationship.toText())
                        } else {
                            readFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.classifiers_relationships.part_1.found.plural.and"))
                            readFeedback.mergeFeedback(classifiersRelationship.toText())
                        }
                    });

                    readFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.classifiers_relationships.part_1.found.plural.end"));
                }
                readFeedback.addSnippet(new StringSnippet(sourceClassifierByBetween.getName()));
                readFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.classifiers_relationships.found.part_2"));
                readFeedback.addSnippet(new StringSnippet(targetClassifierByBetween.getName()));
                readFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.classifiers_relationships.found.part_3"));
                break;

            default:
                throw "In Diagram.tsx, readRelationship method an invalid read instruction was given.";
        }

        return readFeedback;
    }

    /**
     * Alters a classifier following instructions DTO.
     * 
     * @param commandLineArray DTO containing instructions to be executed.
     * @returns Feedback should alteration succeed.
     */
    public alterRelationship(alterInstructions: IAlterRelationshipDTO): Feedback {
        const toAlterRelationship = this.getRelationshipByName(alterInstructions.relationshipName);

        let newSourceClassifier;
        if(alterInstructions.newSourceClassifierName !== undefined) {
            newSourceClassifier = this.getClassifierByName(alterInstructions.newSourceClassifierName);
        }

        let newTargetClassifier;
        if(alterInstructions.newTargetClassifierName !== undefined) {
            newTargetClassifier = this.getClassifierByName(alterInstructions.newTargetClassifierName);
        }

        const alterFeedback = toAlterRelationship.alter(alterInstructions,
            newSourceClassifier ? newSourceClassifier.getId() : undefined,
            newTargetClassifier ? newTargetClassifier.getId() : undefined);
        return alterFeedback;
    }

    /**
     * Returns a feedback containing the names of all classifiers in the diagram, if any.
     * 
     * @returns Classfiers's names if present.
     */
    public readDiagram(): Feedback {
        const readDiagramFeedback = new Feedback()

        readDiagramFeedback.addSnippet(new LocalizationSnippet("feedaback.read.diagram.start"));
        if(this.classifiers.length > 0) {
            if(this.classifiers.length > 0) {
                readDiagramFeedback.addSnippet(new LocalizationSnippet("feedaback.read.diagram.classifiers_present.singular"));
                readDiagramFeedback.addSnippet(new StringSnippet(this.classifiers[0].getName()));
            } else {
                readDiagramFeedback.addSnippet(new LocalizationSnippet("feedaback.read.diagram.classifiers_present.plural"));
                this.classifiers.forEach((classifier) => {
                    readDiagramFeedback.addSnippet(new StringSnippet(", " + classifier.getName()));
                });
            }
        } else {
            readDiagramFeedback.addSnippet(new LocalizationSnippet("feedaback.read.diagram.no_classifiers_present"));
        }
        readDiagramFeedback.addSnippet(new StringSnippet("."));

        return readDiagramFeedback;
    }

    /**
     * Gets given argument's content from command line, removing said range, if no start is found, undefined
     * will be returned, if no end is found, an error will be thrown.
     * 
     * @param commandLineArray Comand line to be searched.
     * @param startArgument Start argument to be searched.
     * @returns Array argument content or undefined.
     */
    private getCommandArgumentContent(commandLineArray: string[], startArgument: string): string[] | undefined {
        // Checks if given argument is present.
        const startIndex = commandLineArray.findIndex((commandLine) => commandLine === startArgument)+1;
        if(startIndex === 0) {
            return undefined;
        }

        // Checks if end for an argument is present.
        const endIndex = commandLineArray.findIndex((commandLine) => commandLine.includes(";"))+1;
        if(endIndex === 0) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.no_end_given_for_argument.part_1"));
            errorFeedback.addSnippet(new StringSnippet(startArgument));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.no_end_given_for_argument.part_2"));

            throw new AppError(errorFeedback);
        }

        // Gets argument while cleaning it.
        const argumentContents = commandLineArray.slice(startIndex, endIndex).map((content) => {
            return content.replace(",", "").replace(";", "")
        });
        commandLineArray.splice(startIndex, endIndex-startIndex);

        return argumentContents;
    }

    /**
     * Checks if given name is already in use by a classifier, if true an error will be thrown.
     * 
     * @param classifierName Name to be checked.
     */
    private isClassifierNameInUse(classifierName: string): void {
        const classifierExists = this.classifiers.find((classifier) => classifier.getName() === classifierName);

        if(classifierExists) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.classifier_name_already_in_use"));

            throw new AppError(errorFeedback);
        }
    }

    /**
     * Checks if given name is already in use by a relationship, if true an error will be thrown.
     * 
     * @param relationshipName Name to be checked.
     */
    private isRelationshipNameInUse(relationshipName: string): void {
        const relationshipExists = this.relationships.find((relationship) => relationship.getName() === relationshipName);

        if(relationshipExists) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.relationship.error.relationship_name_already_in_use.part_1."));
            errorFeedback.addSnippet(new StringSnippet(relationshipName));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.relationship.error.relationship_name_already_in_use.part_2."));

            throw new AppError(errorFeedback);
        }
    }

    /**
     * Searchs for a classifier using it's name, if not found an error will be thrown.
     * 
     * @param name Name of the classifier to be searched.
     * @returns Desired classifier.
     */
    private getClassifierByName(name: string): Classifier {
        const searchedClassifier = this.classifiers.find((classifier) => classifier.getName() === name)
            
        // Checks if classfier is present in diagram.
        if(searchedClassifier === undefined) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.classifier_not_found.part_1"));
            errorFeedback.addSnippet(new StringSnippet(name));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.classifier_not_found.part_2"));

            throw new AppError(errorFeedback);
        } else {
            return searchedClassifier;
        }
    }

    /**
     * Searchs for a classifier's index using it's name, if not found an error will be thrown.
     * 
     * @param name Name of the classifier to be searched.
     * @returns Desired classifier's index.
     */
    private getClassifierIndexByName(name: string): number {
        const searchedClassifierIndex = this.classifiers.findIndex((classifier) => classifier.getName() === name)
            
        // Checks if classfier is present in diagram.
        if(searchedClassifierIndex === -1) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.classifier_not_found.part_1"));
            errorFeedback.addSnippet(new StringSnippet(name));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.classifier_not_found.part_2"));

            throw new AppError(errorFeedback);
        } else {
            return searchedClassifierIndex;
        }
    }

    /**
     * Searchs for a classifier using it's id, if not found an error will be thrown.
     * 
     * @param id Id of the classifier to be searched.
     * @returns Desired classifier.
     */
    private getClassifierById(id: string): Classifier {
        const searchedClassifier = this.classifiers.find((classifier) => classifier.getId() === id)
            
        // Checks if classfier is present in diagram.
        if(searchedClassifier === undefined) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.classifier_not_found.part_1"));
            errorFeedback.addSnippet(new StringSnippet(id));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.classifier_not_found.part_2"));

            throw new AppError(errorFeedback);
        } else {
            return searchedClassifier;
        }
    }

    /**
     * Gets all realtionships between both source and target classifier, using their ids, will return an empty 
     * array if no relationships are found.
     * 
     * @param sourceId Source classifier's id.
     * @param targetId Target classifier's id.
     * @returns Found relationships.
     */
    private getClassifiersRelationships(sourceId: string, targetId: string): Relationship[] {
        return this.relationships.filter((relationship) => 
            relationship.getSourceClassifierId() === sourceId &&
            relationship.getTargetClassifierId() === targetId 
        );
    }

    /**
     * Searchs for a realationship using it's name, if not found an error will be thrown.
     * 
     * @param name Name of the relationship to be searched.
     * @returns Desired relationship.
     */
    private getRelationshipByName(name: string): Relationship {
        const searchedRelationship = this.relationships.find((relationship) => relationship.getName() === name)
            
        // Checks if classfier is present in diagram.
        if(searchedRelationship === undefined) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.relationship_not_found.part_1"));
            errorFeedback.addSnippet(new StringSnippet(name));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.relationship_not_found.part_2"));

            throw new AppError(errorFeedback);
        } else {
            return searchedRelationship;
        }
    }

    /**
     * Searchs for a relationship's index using it's name, if not found an error will be thrown.
     * 
     * @param name Name of the relationship to be searched.
     * @returns Desired relationship's index.
     */
    private getRelationshipIndexByName(name: string): number {
        const searchedRelationship = this.relationships.findIndex((relationship) => relationship.getName() === name)
            
        // Checks if relationship is present in diagram.
        if(searchedRelationship === -1) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.relationship_not_found.part_1"));
            errorFeedback.addSnippet(new StringSnippet(name));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.relationship_not_found.part_2"));

            throw new AppError(errorFeedback);
        } else {
            return searchedRelationship;
        }
    }
}