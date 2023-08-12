import IValidVisibilityDTO from "../public/DTO/IValidVisibilityDTO";
import { SUPPORTED_VISIBILITY } from "../public/Utils/SupportedKeyWords";
import AppError from "./AppError";
import Feedback from "./Feedback";
import LocalizationSnippet from "./LocalizationSnippet";
import StringSnippet from "./StringSnippet";
import TypedEntity from "./TypedEntity";

/**
 * Every entity with visibility should inherit this class.
 */
export default abstract class VisibleEntity extends TypedEntity {
    private visibilityName: string;
    private visibilitySymbol: string;

    /**
     * Sets entity's name, type and visibility.
     * 
     * @param name Entity's name.
     * @param type Entity's type.
     * @param visibility Entity's visibility.
     */
    constructor(name: string, type: string, visibility?: string) {
        super(name, type);
        
        if((visibility === undefined) || (visibility === "")) {
            this.visibilityName = SUPPORTED_VISIBILITY[0].name;
            this.visibilitySymbol = SUPPORTED_VISIBILITY[0].symbol;
        } else {
            const foundVisibility = this.validateVisibility(visibility);
    
            this.visibilityName = foundVisibility.name;
            this.visibilitySymbol = foundVisibility.symbol;
        }
    }

    /**
     * Gets entity's visibility.
     * 
     * @returns Entity's visibility.
     */
    public getVisibility(): string {
        return this.visibilityName;
    }

    /**
     * Gets entity's visibility's symbol.
     * 
     * @returns Entity's visibility's symbol.
     */
    public getVisibilitySymbol(): string {
        return this.visibilitySymbol;
    }

    /**
     * Set's entity's visibility
     * 
     * @param visibility Entiry's new visibility.
     */
    public setVisibility(visibility: string): void {
        const foundVisibility = this.validateVisibility(visibility);

        this.visibilityName = foundVisibility.name;
        this.visibilitySymbol = foundVisibility.symbol;
    }

    /**
     * Checks if given visibility is supported by the application, else an error will be thrown.
     * 
     * @param visibility To be validated.
     * @returns The validated visibility.
     */
    private validateVisibility(visibility: string): IValidVisibilityDTO {
        const foundVisibility = SUPPORTED_VISIBILITY.find((searchingVisibility) => searchingVisibility.name === visibility);

        if(foundVisibility === undefined) {
            const errorFeedback = new Feedback()
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.invalid_visibility.part_1"));
            errorFeedback.addSnippet(new StringSnippet(visibility));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.invalid_visibility.part_2"));

            throw new AppError(errorFeedback);
        }

        return foundVisibility;
    }
}