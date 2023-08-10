import ICreateRelationshipDTO from "../public/DTO/ICreateRelationshipDTO";
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
     * Creates a classifier with command line instructions.
     * 
     * @param entityType Which classifier type is being created.
     * @param commandLineArray Instructions to be handled and executed for classifier creation.
     * @returns Feedback containing a success message.
     */
    public createClassifierByCommand(entityType: string, commandLineArray: string[]): Feedback {
        const attributeArguments = this.getCommandArgumentContent(commandLineArray, "-a");
        const methodArguments = this.getCommandArgumentContent(commandLineArray, "-m");
        // Checks if given name is already in use.
        const newClassifier = new Classifier(entityType, commandLineArray[0], attributeArguments, methodArguments);
        this.isClassifierNameInUse(newClassifier.getName());

        this.classifiers.push(newClassifier);
            
        const feedback = new Feedback();
        feedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.part_1"));
        feedback.addSnippet(new LocalizationSnippet("feedback.common.classifier_type."+newClassifier.getEntityType()));
        feedback.addSnippet(new StringSnippet(" "+newClassifier.getName()));
        feedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.part_2"));

        return feedback;
    }

    /**
     * Read a classifier with command line instructions
     * 
     * @param commandLineArray Instructions to be handled and executed for classifier reading.
     * @returns Feedback containing the desired classifier indormation.
     */
    public readClassifierByCommand(commandLineArray: string[]): Feedback {
        const classifierName = commandLineArray?.shift()?.toLowerCase();

        // Checks if classifier name is present.
        if((classifierName === undefined) || (classifierName === "")) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.read.error.missing_name_for_reading"));

            throw new AppError(errorFeedback);
        } else {
            const toReadClassifier = this.getClassifierByName(classifierName);
            const readFeedback = toReadClassifier.toText(commandLineArray);
            return readFeedback;
        }
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
            alterClassifierFeedback.addSnippet(new LocalizationSnippet("feedback.common.classifier_type."+toAlterClassifier.getEntityType()));
            alterClassifierFeedback.addSnippet(new StringSnippet(" "+toAlterClassifier.getName()));
            alterClassifierFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.part_2"));
            return alterClassifierFeedback;
        }
    }

    /**
     * Creates a relationship with command line instructions.
     * 
     * @param commandLineArray Instructions to be handled and executed for relationship creation.
     * @returns Feedback containing a success message 
     */
    public createRelationshipByCommand(commandLineArray: string[]): Feedback {
        // Checks if classifiers's names were given.
        const desiredSourceClassifierName = commandLineArray.shift();
        const desiredTargetClassifierName = commandLineArray.shift();
        if((desiredSourceClassifierName === undefined) || (desiredSourceClassifierName === "")) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.ralationship.error.source_classifier_missing"));

            throw new AppError(errorFeedback);
        } else if((desiredTargetClassifierName === undefined) || (desiredTargetClassifierName === "")) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.ralationship.error.target_classifier_missing"));

            throw new AppError(errorFeedback);
        } else {
            // Checks if name was given, if not generates a name.
            const relationshipName = this.getCommandArgumentContent(commandLineArray, "-n");
            let autoGeneratedName = ""
            if(relationshipName === undefined) {
                let nameInUse = false;
                autoGeneratedName = desiredTargetClassifierName + "_" + desiredTargetClassifierName;
                let count = 0;
                do {
                    const relationshipExists = this.relationships.find((relationship) => relationship.getName() === autoGeneratedName);
                    if(relationshipExists) {
                        autoGeneratedName = desiredTargetClassifierName + "_" + desiredTargetClassifierName + (count > 0 ? "_" + count : "");
                        count++;
                        nameInUse = true;
                    } else {
                        nameInUse = false;
                    }
                } while(nameInUse)
            } else {
                this.isRelationshipNameInUse(relationshipName[0]);
            }

            // Gets the other possible arguments
            const sourceClassifier = this.getClassifierByName(desiredSourceClassifierName);
            const targetClassifier = this.getClassifierByName(desiredTargetClassifierName);
            const relatioshipType = this.getCommandArgumentContent(commandLineArray, "-t");
            const attribute = this.getCommandArgumentContent(commandLineArray, "-a");

            const preRelaionshipData = {
                name: relationshipName ? relationshipName[0] : autoGeneratedName,
                sourceClassifierId: sourceClassifier.getId(),
                targetClassifierId: targetClassifier.getId(),
                relatioshipType: relatioshipType ? relatioshipType[0] : undefined,
                attribute: attribute ? attribute[0] : undefined
            }

            const newRelationship = new Relationship(preRelaionshipData);
            this.relationships.push(newRelationship);

            const relationshipCreationFeedback = new Feedback();
            relationshipCreationFeedback.addSnippet(new LocalizationSnippet("feedback.create.ralationship.success.part_1"));
            relationshipCreationFeedback.addSnippet(new LocalizationSnippet("feedback.common.relationship_type."+newRelationship.getRelationshipType()));
            relationshipCreationFeedback.addSnippet(new LocalizationSnippet("feedback.create.ralationship.success.part_2"));
            relationshipCreationFeedback.addSnippet(new StringSnippet(sourceClassifier.getName()));
            relationshipCreationFeedback.addSnippet(new LocalizationSnippet("feedback.create.ralationship.success.part_3"));
            relationshipCreationFeedback.addSnippet(new StringSnippet(targetClassifier.getName()));
            relationshipCreationFeedback.addSnippet(new LocalizationSnippet("feedback.create.ralationship.success.part_4"));
            relationshipCreationFeedback.addSnippet(new StringSnippet(newRelationship.getName()));
            relationshipCreationFeedback.addSnippet(new LocalizationSnippet("feedback.create.ralationship.success.part_5"));
            return relationshipCreationFeedback;
        }
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
     * Searchs a classifier using it's name, if not found an error will be thrown.
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
     * Searchs a classifier's index using it's name, if not found an error will be thrown.
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
     * Searchs a relationship's index using it's name, if not found an error will be thrown.
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