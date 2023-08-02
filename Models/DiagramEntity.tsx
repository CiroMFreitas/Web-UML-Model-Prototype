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
     * @param name string
     */
    constructor(name: string) {
        super();

        if(!this.validadeNamingString(name)) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.invalid_characters_used_for_name.part_1"));
            errorFeedback.addSnippet(new StringSnippet(name));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.invalid_characters_used_for_name.part_2"));

            throw new AppError(errorFeedback);
        }
        this.name = name;
        this.toDraw = false;
    }

    /**
     * Sets entity's name.
     * 
     * @param name New name for entity.
     */
    public setName(name: string): void {
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

    protected validadeNamingString(namingString: string): boolean {
        return /^[a-zA-Z0-9-_]+$/.test(namingString);
    }
}