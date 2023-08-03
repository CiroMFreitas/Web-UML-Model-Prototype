
import AppError from "./AppError";
import Feedback from "./Feedback";
import LocalizationSnippet from "./LocalizationSnippet";
import StringSnippet from "./StringSnippet";
import VisibleEntity from "./VisibleEntity";

/**
 * Classifier's attributes.
 */
export default class Attribute extends VisibleEntity {

    /**
     * Creates attribute.
     * 
     * @param attributeArgument A string containg it's attributes divided by :.
     */
    constructor(attributeArgument: string) {
        // Checks if sufficient arguments were given for attribute creation.
        const splitArgument = attributeArgument.split(":");
        if(splitArgument.length === 3) {
            super(splitArgument[1], splitArgument[2], splitArgument[0]);
        } else if(splitArgument.length === 2) {
            super(splitArgument[0], splitArgument[1]);
        } else {
            const errorFeedback = new Feedback();
            if(splitArgument[0] === "") {
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.attribute.error.empty_attribute_argument"));
            } else if(splitArgument.length === 1) {
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.attribute.error.invalid_attribute_arguments.part_1.too_few"));
                errorFeedback.addSnippet(new StringSnippet(splitArgument.toString().replaceAll(",", ":")))
            } else {
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.attribute.error.invalid_attribute_arguments.part_1.too_many"));
                errorFeedback.addSnippet(new StringSnippet(splitArgument.toString().replaceAll(",", ":")))
            }
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.attribute.error.invalid_attribute_arguments.part_2"));

            throw new AppError(errorFeedback)
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