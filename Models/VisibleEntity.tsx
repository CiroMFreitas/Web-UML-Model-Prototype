import TypedEntity from "./TypedEntity";

/**
 * Every entity with visibility should inherit this class.
 */
export default abstract class VisibleEntity extends TypedEntity {
    private visibility: ENTITY_VISIBILITY;

    /**
     * Sets entity's name, type and visibility.
     * 
     * @param name Entity's name.
     * @param type Entity's type.
     * @param visibility Entity's visibility.
     */
    constructor(name: string, type: string, visibility: string) {
        super(name, type);
        
        if(visibility !== "") {
            this.visibility = this.handleVisibility(visibility);
        } else {
            this.visibility = ENTITY_VISIBILITY.PUBLIC;
        }
    }

    /**
     * Gets entity's visibility.
     * 
     * @returns Entity's visibility.
     */
    public getVisibility(): string {
        return this.visibility;
    }

    /**
     * Set's entity's visibility
     * 
     * @param visibility Entiry's visibility.
     */
    public setVisibility(visibility: string): void {
        this.visibility = this.handleVisibility(visibility);
    }

    /**
     * Checks if given visibility is supported by the application, else an unsupported visibility error will be thrown.
     * 
     * @param visibility To be handled.
     * @returns The handled visibility.
     */
    private handleVisibility(visibility: string): ENTITY_VISIBILITY {
        const isVisibilitySupported = Object.values(ENTITY_VISIBILITY).indexOf(visibility as ENTITY_VISIBILITY);
        if(isVisibilitySupported !== -1) {
            return visibility as ENTITY_VISIBILITY;
        } else {
            throw "error.visibility_not_supported";
        }
    }
}