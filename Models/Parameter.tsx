import TypedEntity from "./TypedEntity";

/**
 * Parameter of an method.
 */
export default class Parameter extends TypedEntity {
    
    /**
     * Creates Parameter.
     */
    constructor(name: string, type: string) {
        super(name, type);
    }
}