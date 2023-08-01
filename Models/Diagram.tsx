import Classifier from "./Classifier";

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

    /**
     * Checks if given name is already in use by a classifier.
     * 
     * @param classifierName Name to be checked.
     * @returns true if names is present, otherwise false.
     */
    public isClassifierNameInUse(classifierName: string): boolean {
        const classifierExists = this.classifiers.find((classifier) => classifier.getName() === classifierName);

        if(classifierExists) {
            return true;
        } else {
            return false;
        }
    }
}