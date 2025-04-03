import translate from "../../Controller/Translate";
import IGetRelationshipDTO from "../../public/DTO/IGetRelationshipDTO";


type Props = { relationshipData: IGetRelationshipDTO };

export default function CanvasRelationship({ relationshipData }: Props) {
    return (
        <div id="ClassDiagramCanvas">
            {/* Classifier type and name */}
            <div>
                {
                    translate("ASCIIDiagram.relationship.title_single") +
                    translate("feedback.common.relationship_type." + relationshipData.relationshipType) +
                    translate("ASCIIDiagram.relationship.between") +
                    relationshipData.sourceClassifierName +
                    translate("ASCIIDiagram.relationship.and") +
                    relationshipData.targetClassifierName
                }
            </div>
        </div>
    )
}