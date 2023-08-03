import AppError from "./AppError";
import Attribute from "./Attribute";
import DiagramEntity from "./DiagramEntity";
import Feedback from "./Feedback";
import LocalizationSnippet from "./LocalizationSnippet";
import StringSnippet from "./StringSnippet";

/**
 * Classifiers holding attributes and methods.
 */
export default class Classifier extends DiagramEntity {
    private entityType: string;
    private attributes = [] as Attribute[];
    
    /**
     * Creates a Classifier.
     * 
     * @param entityType Classifer's type, vaid types are, class, abstract and interface.
     * @param classifierName Classifier's name.
     * @param attributeArguments Classifier's array of attribute's arguments to be created.
     */
    constructor(entityType: string, classifierName: string, attributeArguments?: string[], methodArguments?: string[]) {
        // Gets and checks if a name was given for classifier.
        if(classifierName === "") {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.name_missing_for_creation.part_1"));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.common.entity_tyoe."+entityType));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.name_missing_for_creation.part_2"));

            throw new AppError(errorFeedback);
        }
        super(classifierName);
        this.entityType = entityType;

        if(attributeArguments !== undefined) {
            attributeArguments.forEach((argument) => {
                const newAttribute = new Attribute(argument);
                this.isAttributeNameInUse(newAttribute.getName());

                this.attributes.push(newAttribute);
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
}