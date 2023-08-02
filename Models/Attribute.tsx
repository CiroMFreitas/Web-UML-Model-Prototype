
import VisibleEntity from "./VisibleEntity";

export default class Attribute extends VisibleEntity {

    /**
     * Creates attribute.
     */
    constructor(name: string, type: string, visibility?: string) {
        super(name, type, visibility);
    }

    public toText(): string {
        return "";
    }

    public toDiagram(): string {
        return "";
    }
}