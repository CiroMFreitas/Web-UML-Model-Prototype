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

    public createClassifier(entityType: string, commandLineArray: string[]): Feedback {
        // Checks if given name is already in use.
        const newClassifier = new Classifier(entityType, commandLineArray);
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