import IAlterParameterDTO from "../public/DTO/IAlterParamenterDTO";
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
     * @param creationInstructions DTO with parameter creation instructions.
     */
    constructor(creationInstructions: ICreateParameterDTO) {
        super(creationInstructions.name, creationInstructions.type);
    }

    /**
     * Changes parameter's data following DTO instructions.
     * 
     * @param alterations DTO containing alterations to be executed.
     */
    public alter(alterations: IAlterParameterDTO): void {
        if((alterations.newParameterName !== "-") && (alterations.newParameterName !== "")) {
            this.setName(alterations.newParameterName);
        }

        if((alterations.newParameterType !== "-") && (alterations.newParameterType !== "")) {
            this.setType(alterations.newParameterType);
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