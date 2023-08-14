
import ICreateAttributeDTO from "../public/DTO/ICreateAttributeDTO";
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
     * @param creationInstructions DTO if instructions for attribute creation.
     */
    constructor(creationInstructions: ICreateAttributeDTO) {
        super(creationInstructions.name, creationInstructions.type, creationInstructions.visibility);
    }

    /**
     * Changes attribute's data, expecting data to be organized with the respective order inside array,
     * visibility, name and type.
     * 
     * @param alterations Array containing alterations in the previously stated order.
     */
    public alter(alterations: string[]): void {
        if((alterations[0] !== "-") && (alterations[0] !== "")) {
            this.setVisibility(alterations[0]);
        }

        if((alterations[1] !== "-") && (alterations[1] !== "")) {
            this.setName(alterations[1]);
        }

        if((alterations[2] !== "-") && (alterations[2] !== "")) {
            this.setType(alterations[2]);
        }
    }

    /**
     * Creates a feedback all of attributes's information for a screen reader.
     * 
     * @returns Attribute data in feedback format..
     */
    public toText(): Feedback {
        const readFeedback = new Feedback();
        readFeedback.addSnippet(new StringSnippet(this.getName()));
        readFeedback.addSnippet(new LocalizationSnippet("feedback.read.attribute.with_type"));
        readFeedback.addSnippet(new StringSnippet(this.getType()));
        readFeedback.addSnippet(new LocalizationSnippet("feedback.read.attribute.with_visibility"));
        readFeedback.addSnippet(new LocalizationSnippet("feedback.common.visibility."+this.getVisibility()));

        return readFeedback;
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