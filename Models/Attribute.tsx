
import IAlterAttributeDTO from "../public/DTO/IAlterAttributeDTO";
import ICreateAttributeDTO from "../public/DTO/ICreateAttributeDTO";
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
        super(creationInstructions.name, creationInstructions.type, creationInstructions.visibility, creationInstructions.id);
    }

    /**
     * Changes attribute's data, following DTO instructions.
     * 
     * @param alterations DTO containing alterations instructions.
     */
    public alter(alterations: IAlterAttributeDTO): void {
        if((alterations.newVisibility !== "-") && (alterations.newVisibility !== "")) {
            this.setVisibility(alterations.newVisibility);
        }

        if((alterations.newName !== "-") && (alterations.newName !== "")) {
            this.setName(alterations.newName);
        }

        if((alterations.newType !== "-") && (alterations.newType !== "")) {
            this.setType(alterations.newType);
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
     * Generates an array in PlantUML's format.
     * 
     * @returns Array formated for PlantUML.
     */
    public exportToPlantUML(): string {
        return this.getVisibilitySymbol() + " " + this.getType() + " " + this.getName();
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