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
        feedback.addSnippet(new LocalizationSnippet("feedback.common.classifier_type."+entityType));
        feedback.addSnippet(new StringSnippet(" "+newClassifier.getName()));
        feedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.part_2"));

        return feedback;
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
}