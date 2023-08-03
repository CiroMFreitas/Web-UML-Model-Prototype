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

    public createClassifierByCommand(entityType: string, commandLineArray: string[]): Feedback {
        const attributeArguments = this.getCommandAttributeArguments(commandLineArray);
        // Checks if given name is already in use.
        const newClassifier = new Classifier(entityType, commandLineArray[0], attributeArguments);
        this.isClassifierNameInUse(newClassifier.getName());

        this.classifiers.push(newClassifier);
            
        const feedback = new Feedback();
        feedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.part_1"));
        feedback.addSnippet(new LocalizationSnippet("feedback.common.entity_tyoe."+entityType));
        feedback.addSnippet(new StringSnippet(newClassifier.getName()));
        feedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.part_2"));

        return feedback;
    }

    /**
     * Gets attributes arguments from command, if '-a' is not found will return undefined. 
     * 
     * @param commandLineArray Command line broken into array.
     * @returns Resulting array or undefined.
     */
    private getCommandAttributeArguments(commandLineArray: string[]): string[] | undefined {
        // Checks if attributes arguments are present.
        const attributeArgumentIndex = commandLineArray.findIndex((commandLine) => commandLine === "-a")+1;
        if(attributeArgumentIndex === 0) {
            return undefined;
        }

        // Checks end } is prenset present.
        const endBracketIndex = commandLineArray.findIndex((commandLine) => commandLine.includes(";"))+1;
        if(endBracketIndex === 0) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.end_braces_missing"));

            throw new AppError(errorFeedback);
        }

        // Gets argument while cleaning and spliting it.
        const attributeArguments = commandLineArray.slice(attributeArgumentIndex, endBracketIndex).map((argument) => {
            return argument.replace(",", "").replace(";", "")
        });
        commandLineArray.splice(attributeArgumentIndex, endBracketIndex-attributeArgumentIndex);

        return attributeArguments;
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
}