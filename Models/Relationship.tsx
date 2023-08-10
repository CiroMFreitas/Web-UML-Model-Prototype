import DiagramEntity from "./DiagramEntity";

export default class Relationship extends DiagramEntity {
    private relatioshipType: string;

    constructor(){
        super("")
        this.relatioshipType = "";
    }
}