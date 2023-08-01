import AppError from "./AppError";
import Classifier from "./Classifier";
import Feedback from "./Feedback";
import LocalizationSnippet from "./LocalizationSnippet";
import StringSnippet from "./StringSnippet";

/**
 * Object holding all diagram entities.
 */
export default class Diagram {
    private classifiers: Classifier[];

    /**
     * Sets an empty diagram.
     */
    constructor() {
        this.classifiers = [] as Classifier[];
    }

    public createClassifier(entityType: string, commandLineArray: string[]): Feedback {
        // Gets and checks if a name was given for classifier.
        const classifierName = commandLineArray.shift();
        if((typeof classifierName === "undefined") || (classifierName === "")) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("error.name_missing_for_creation.part_1"));
            errorFeedback.addSnippet(new LocalizationSnippet("error.name_missing_for_creation."+entityType));
            errorFeedback.addSnippet(new LocalizationSnippet("error.name_missing_for_creation.part_2"));

            throw new AppError(errorFeedback);
        } else {
            // Checks if given name is already in use.
            this.isClassifierNameInUse(classifierName);

            this.classifiers.push(new Classifier(entityType, classifierName, commandLineArray));
            
            const feedback = new Feedback();
            feedback.addSnippet(new LocalizationSnippet("feedback.create_classifier.part_1"));
            feedback.addSnippet(new LocalizationSnippet("feedback.create_classifier."+entityType));
            feedback.addSnippet(new StringSnippet(classifierName));
            feedback.addSnippet(new LocalizationSnippet("feedback.create_classifier.part_2"));

            return feedback;
        }
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
            errorFeedback.addSnippet(new LocalizationSnippet("error.classifier_name_already_in_use"));

            throw new AppError(errorFeedback);
        }
    }
}