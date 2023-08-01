import DiagramEntity from "./DiagramEntity";

export default class Classifier extends DiagramEntity {
    private entityType: string;
    
    constructor(entitytype: string, classifierName: string, commandContent: string[]) {
        super(classifierName)
        this.entityType = entitytype;
    }
}