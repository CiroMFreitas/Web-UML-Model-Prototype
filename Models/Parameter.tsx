import TypedEntity from "./TypedEntity";

export default class Parameter extends TypedEntity {
    constructor(name: string, type: string) {
        super(name, type);
    }
}