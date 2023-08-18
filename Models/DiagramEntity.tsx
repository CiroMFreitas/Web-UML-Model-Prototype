import AppError from "./AppError";
import DomainObject from "./DomainObject";
import Feedback from "./Feedback";
import LocalizationSnippet from "./LocalizationSnippet";
import StringSnippet from "./StringSnippet";

/**
 * All entity which will be drawned on canvas, must inherit this class.
 */
export default abstract class DiagramEntity extends DomainObject {
    private name: string;
    private toDraw: boolean;

    /**
     * Sets entity's name and for it to not be drawn on creation.
     * 
     * @param name Entity's name.
     * @param id Entity's id.
     */
    constructor(name: string, id?: string) {
        super(id);
        this.validadeNamingString(name);

        this.name = name;
        this.toDraw = false;
    }

    /**
     * Sets entity's name.
     * 
     * @param name New name for entity.
     */
    public setName(name: string): void {
        this.validadeNamingString(name);
        this.name = name;
    }

    /**
     * Gets entity's name.
     * 
     * @returns Entity's name.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Returns a boolean determining whether or not should entity be drawn on diagram.
     * 
     * @returns If entity is to be drawn on diagram.
     */
    public isToDraw(): boolean {
        return this.toDraw;
    }

    /**
     * Set entity to be drawn on diagram.
     */
    public draw(): void {
        this.toDraw = true;
    }

    /**
     * Set entity to not be drawn on diagram.
     */
    public undraw(): void {
        this.toDraw = false;
    }

    /**
     * Checks if name has only alphanumerics, dashes and underlines, else an error will be thrown,
     * 
     * @param namingString Name to be validated.
     */
    protected validadeNamingString(namingString: string): void {
        if((namingString === "") || (namingString === undefined)) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.error.missing_name_for_entity.part_1"));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.common.entity_type."+this.constructor.name));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.error.missing_name_for_entity.part_2"));

            throw new AppError(errorFeedback);
        }

        if(!/^[a-zA-Z0-9-_]+$/.test(namingString)) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.invalid_characters_used_for_naming.part_1"));
            errorFeedback.addSnippet(new StringSnippet(namingString));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.invalid_characters_used_for_naming.part_2"));

            throw new AppError(errorFeedback);
        }
    }
}