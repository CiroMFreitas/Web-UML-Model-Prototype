import { v4 as uuidv4 } from "uuid";

/**
 * Domain class for app's classes.
 */
export default abstract class DomainObject {
    private id: string;

    /**
     * Generates object with id using uuid.
     * 
     * @param id Object's id.
     */
    constructor(id?: string) {
        if(id !== undefined) {
            this.id = id;
        } else {
            this.id = uuidv4();
        }
    }

    /**
     * Gets object's id.
     * 
     * @returns Object's id.
     */
    public getId(): string {
        return this.id;
    }
}