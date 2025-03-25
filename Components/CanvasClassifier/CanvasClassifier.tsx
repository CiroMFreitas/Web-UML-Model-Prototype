import translate from "../../Controller/Translate";
import "./CanvasClassifier.css";
import IGetClassifierDTO from "../../public/DTO/IGetClassifierDTO";
import CanvasClassifierAttribute from "../CanvasClassifierAttribute/CanvasClassifierAttribute";
import CanvasClassifierMethod from "../CanvasClassifierMethod/CanvasClassifierMethod";
import CanvasClassifierRelationship from "../CanvasClassifierRelationship/CanvasClassifierRelationship";

type Props = { classifierData: IGetClassifierDTO };

export default function CanvasClassifier({ classifierData }: Props) {  
    return (
        <div id="ClassDiagramCanvas">
            {/* Classifier type and name */}
            <div>
                { translate("ASCIIDiagram.classifier." + classifierData.classifierType) + " " + classifierData.name }
            </div>

            {/* Atributes */}
            <div>
                <div>
                    { translate("ASCIIDiagram.attribute.title") }
                </div>
      
                <div>
                    {
                        classifierData.attributes.length < 1 ?
                        translate("ASCIIDiagram.attribute.no_attributes") : 
                        classifierData.attributes.map((attribute) => {
                            return <CanvasClassifierAttribute attributeData={ attribute } key={ attribute.name } />
                        })
                     }
                </div>

                -----------
            </div>

            {/* Methods */}
            <div>
                <div>
                { translate("ASCIIDiagram.method.title") }
                </div>
      
                <div>
                    {
                        classifierData.methods.length < 1 ?
                        translate("ASCIIDiagram.method.no_methods") : 
                        classifierData.methods.map((method) => {
                            return <CanvasClassifierMethod methodData={ method } key={ method.name } />
                        })
                    }
                </div>
            
                -----------
            </div>

            {/* Relationships */}
            <div>
                <div>
                    { translate("ASCIIDiagram.relationship.title") }
                </div>
      
                <div>
                    {
                        classifierData.relationships.length < 1 ?
                        translate("ASCIIDiagram.relationship.no_relationships") : 
                        classifierData.relationships.map((relationship) => {
                            return <CanvasClassifierRelationship relationshipData={ relationship } key={ relationship.relationshipName } />
                        })
                    }
                </div>
            </div>
        </div>
    )
}