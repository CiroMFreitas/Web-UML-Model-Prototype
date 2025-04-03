import Diagram from "../Models/Diagram";
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
            console.log(classifier.exportToPlantUML())
            classifier.exportToPlantUML().forEach((exportedClassifierContent) => {
                //console.log(exportedClassifierContent)
                exportContent.push(exportedClassifierContent)
            })
            exportContent.push("\n");
        });
        
        exportContent.push("@enduml");
        return exportContent;
    }
}