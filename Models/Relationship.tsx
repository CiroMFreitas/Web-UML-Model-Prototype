import ICreateRelationshipDTO from "../public/DTO/ICreateRelationshipDTO";
import Attribute from "./Attribute";
import DiagramEntity from "./DiagramEntity";

export default class Relationship extends DiagramEntity {
    private sourceClassifierId: string;
    private targetClassifierId: string;
    private relatioshipType: string;
    private attribute: Attribute;

    constructor(relationshipCreationData: ICreateRelationshipDTO){
        super(relationshipCreationData.name)
        this.sourceClassifierId = relationshipCreationData.sourceClassifierId;
        this.targetClassifierId = relationshipCreationData.targetClassifierId;
        this.relatioshipType = "";
        this.attribute = new Attribute("");
    }
}