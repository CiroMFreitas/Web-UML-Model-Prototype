import AppError from "./AppError";
import Classifier from "./Classifier";
import Feedback from "./Feedback";
import LocalizationSnippet from "./LocalizationSnippet";
import StringSnippet from "./StringSnippet";

/**
 * Object responsible for holding and managing all diagram entities.
 */
export default class Diagram {
    private classifiers: Classifier[];

    /**
     * Sets an empty diagram.
     */
    constructor() {
        this.classifiers = [] as Classifier[];
    }

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
    
            const alterClassifierFeedback = new Feedback();
            alterClassifierFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.part_1"));
            alterClassifierFeedback.addSnippet(new LocalizationSnippet("feedback.common.classifier_type."+toAlterClassifier.getEntityType()));
            alterClassifierFeedback.addSnippet(new StringSnippet(" "+toAlterClassifier.getName()));
            alterClassifierFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.part_2"));
            return alterClassifierFeedback;
        }
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
}