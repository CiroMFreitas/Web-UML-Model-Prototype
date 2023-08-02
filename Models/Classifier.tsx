import AppError from "./AppError";
import Attribute from "./Attribute";
import DiagramEntity from "./DiagramEntity";
import Feedback from "./Feedback";
import LocalizationSnippet from "./LocalizationSnippet";
import StringSnippet from "./StringSnippet";

export default class Classifier extends DiagramEntity {
    private entityType: string;
    private attributes: Attribute[];
    
    constructor(entityType: string, classifierName: string, attributeArguments?: string[][]) {
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
        this.attributes = [] as Attribute[];

        if(attributeArguments !== undefined) {
            attributeArguments.forEach((argument) => {
                if(argument.length === 3) {
                    this.attributes.push(new Attribute(argument[1], argument[2], argument[0]));
                } else if(argument.length === 2) {
                    this.attributes.push(new Attribute(argument[0], argument[1]));
                } else {
                    const errorFeedback = new Feedback();
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.invalid_attribute_argument.part_1"));
                    errorFeedback.addSnippet(new StringSnippet(argument.toString().replaceAll(",", ":")))
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.invalid_attribute_argument.part_2"));

                    throw new AppError(errorFeedback)
                }
            });
        }
    }
}