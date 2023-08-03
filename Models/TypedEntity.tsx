import AppError from "./AppError";
import DiagramEntity from "./DiagramEntity"
import Feedback from "./Feedback";
import LocalizationSnippet from "./LocalizationSnippet";
import StringSnippet from "./StringSnippet";

/**
 * All entities with types must inehrit this class
 */
export default abstract class TypedEntity extends DiagramEntity {
    private type: string

    /**
     * Sets entity's name and type.
     * 
     * @param name Entoty's name.
     * @param type Entity's type.
     */
    constructor(name: string, type: string) {
        super(name);
        if((type === "") || (type === undefined)) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.error.missing_type_for_entity.part_1"));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.common.entity_type."+this.constructor.name));
            errorFeedback.addSnippet(new StringSnippet(" "+this.getName()));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.error.missing_type_for_entity.part_2"));

            throw new AppError(errorFeedback);
        }

        this.validadeNamingString(type);

        this.type = type;
    }

    /**
     * Sets entity's type.
     * 
     * @param type New entity's type.
     */
    public setType(type: string): void {
        this.validadeNamingString(type);
        this.type = type;
    }

    /**
     * Gets entity's type.
     * 
     * @returns Entity's type.
     */
    public getType(): string {
        return this.type;
    }
}