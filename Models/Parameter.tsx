import ICreateParameterDTO from "../public/DTO/ICreateParameterDTO";
import AppError from "./AppError";
import Feedback from "./Feedback";
import LocalizationSnippet from "./LocalizationSnippet";
import StringSnippet from "./StringSnippet";
import TypedEntity from "./TypedEntity";

/**
 * Parameter of an method.
 */
export default class Parameter extends TypedEntity {
    
    /**
     * Creates parameter.
     * 
     * @param creationInstructions DTO with creation instructions.
     */
    constructor(creationInstructions: ICreateParameterDTO) {
        super(creationInstructions.name, creationInstructions.type);
    }

    /**
     * Changes parameter's data, expecting data to be organized with the respective order inside array,
     * name and type.
     * 
     * @param alterations Array containing alterations in the previously stated order.
     */
    public alter(alterations: string[]): void {
        if((alterations[0] !== "-") && (alterations[0] !== "")) {
            this.setName(alterations[0]);
        }

        if((alterations[1] !== "-") && (alterations[1] !== "")) {
            this.setType(alterations[1]);
        }
    }

    /**
     * Creates a feedback all of parameter's information for a screen reader.
     * 
     * @returns Parameter data in feedback format..
     */
    public toText(): Feedback {
        const readFeedback = new Feedback();
        readFeedback.addSnippet(new StringSnippet(this.getName()));
        readFeedback.addSnippet(new LocalizationSnippet("feedback.read.parameter.with_type"));
        readFeedback.addSnippet(new StringSnippet(this.getType()));

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