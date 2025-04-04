import Diagram from "../Models/Diagram";
import { SUPPORTED_RELATIONSHIP_TYPES } from "../public/Utils/SupportedKeyWords";
/**
 * Class is capable of exporting class diagram to other
 */
export default class Exporter {
    private diagram: Diagram;

    /** Generates an diagram exporter
     * 
     * 
     * @param diagram Diagram to be exported.
     */
    constructor(diagram: Diagram) {
        this.diagram = diagram;
    }

    public exportToPlantUML(): string[] {
        const exportContent = ["@startuml\n"];

        this.diagram.getClassifiers().forEach((classifier) => {
            classifier.exportToPlantUML().forEach((exportedClassifierContent) => {
                exportContent.push(exportedClassifierContent)
            })
            exportContent.push("\n");
        });

        this.diagram.getRelationships().forEach((relationship) => {
            const sourceClassifier = this.diagram.getClassifierById(relationship.getSourceClassifierId()).getName();
            const targetClassifier = this.diagram.getClassifierById(relationship.getTargetClassifierId()).getName();

            exportContent.push(sourceClassifier + " " +
                (relationship.getMultiplicity() !== undefined ? "\"" + relationship.getMultiplicity() + "\" " : "") +
                SUPPORTED_RELATIONSHIP_TYPES.find((relationshipType) => relationshipType.name === relationship.getRelationshipType())?.ascii + " " +
                targetClassifier +
                (relationship.getAttributeName() !== undefined ? " : " + relationship.getName() : "") + "\n");
        });
        
        exportContent.push("@enduml");
        return exportContent;
    }
}