import AppError from "./AppError";
import Attribute from "./Attribute";
import DiagramEntity from "./DiagramEntity";
import Feedback from "./Feedback";
import LocalizationSnippet from "./LocalizationSnippet";
import Method from "./Method";
import StringSnippet from "./StringSnippet";

/**
 * Classifiers holding attributes and methods.
 */
export default class Classifier extends DiagramEntity {
    private entityType: string;
    private attributes = [] as Attribute[];
    private methods = [] as Method[];
    
    /**
     * Creates a Classifier.
     * 
     * @param entityType Classifer's type, vaid types are, class, abstract and interface.
     * @param classifierName Classifier's name.
     * @param attributeArguments Classifier's array of attribute's arguments to be created.
     * @param methodArguments Classifier's array of method's arguments to be created.
     */
    constructor(entityType: string, classifierName: string, attributeArguments?: string[], methodArguments?: string[]) {
        super(classifierName);
        this.entityType = entityType;

        // Cretas attributes if arguments are present.
        if(attributeArguments !== undefined) {
            attributeArguments.forEach((argument) => {
                const newAttribute = new Attribute(argument);
                this.isAttributeNameInUse(newAttribute.getName());

                this.attributes.push(newAttribute);
            });
        }

        // Cretas methods if arguments are present.
        if(methodArguments !== undefined) {
            const handledMethodArguments = this.handleMethodArguments(methodArguments);
            handledMethodArguments.forEach((handledMethod) => {
                const newMethod = new Method(handledMethod);
                this.isMethodNameInUse(newMethod.getName());

                this.attributes.push(newMethod);
            });
        }
    }

    /**
     * Checks if given name is already in use by an attribute, if true an error will be thrown.
     * 
     * @param attributeName Name to be checked.
     */
    private isAttributeNameInUse(attributeName: string): void {
        const attributeExists = this.attributes.find((attribute) => attribute.getName() === attributeName);

        if(attributeExists) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.attribute_name_already_in_use.part_1"));
            errorFeedback.addSnippet(new StringSnippet(attributeName))
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.attribute_name_already_in_use.part_2"));

            throw new AppError(errorFeedback);
        }
    }

    private handleMethodArguments(methodArguments: string[]): string[][] {
        // Breaks method arguments into arrays for method creation
        const handledMethodArguments = [[]] as string[][];
        let endparameter = methodArguments.findIndex((methodArgument) => methodArgument.includes(")"))+1;
        while(endparameter !== 0) {
            handledMethodArguments.push(methodArguments.splice(0, endparameter))
            
            endparameter = methodArguments.findIndex((methodArgument) => methodArgument.includes(")"))+1;
        }

        // Checks if there were left overs, menaing tha methods were not properly declared.
        if(methodArguments.length > 0) {
            // rebuilds method for error feedback.
            const errorMethod = "";
            handledMethodArguments.forEach((handledMethod) => {
                errorMethod.concat(handledMethod.toString().replaceAll(",", " "));
            });
            errorMethod.concat(methodArguments.toString().replaceAll(",", " "));

            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.syntax_error_in_method_argument.part_1"));
            errorFeedback.addSnippet(new StringSnippet(errorMethod))
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.syntax_error_in_method_argument.part_2"));

            throw new AppError(errorFeedback);
        }

        return handledMethodArguments;
    }

    /**
     * Checks if given name is already in use by a method, if true an error will be thrown.
     * 
     * @param methodName Name to be checked.
     */
    private isMethodNameInUse(methodName: string): void {
        const methodExists = this.methods.find((method) => method.getName() === methodName);

        if(methodExists) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.method_name_already_in_use.part_1"));
            errorFeedback.addSnippet(new StringSnippet(methodName))
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.method_name_already_in_use.part_2"));

            throw new AppError(errorFeedback);
        }
    }

    /**
     * Stub.
     * 
     * @returns Stub.
     */
    public toText(): string {
        return "";
    }

    /**
     * Stub.
     * 
     * @returns Stub.
     */
    public toDiagram(): string {
        return "";
    }
}