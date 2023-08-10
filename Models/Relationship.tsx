import ICreateRelationshipDTO from "../public/DTO/ICreateRelationshipDTO";
import Attribute from "./Attribute";
import DiagramEntity from "./DiagramEntity";

export default class Relationship extends DiagramEntity {
    private sourceClassifierId: string;
    private targetClassifierId: string;
    private relatioshipType: string;
    private attribute: Attribute;

    constructor(relationshipCreationData: ICreateRelationshipDTO){
        super("")
        this.relatioshipType = "";
        this.sourceClassifierId = "";
        this.targetClassifierId = "";
        this.attribute = new Attribute("");
    }
}