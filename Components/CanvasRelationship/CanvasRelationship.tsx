import translate from "../../Controller/Translate";
import IGetRelationshipDTO from "../../public/DTO/IGetRelationshipDTO";
import { SUPPORTED_RELATIONSHIP_TYPES } from "../../public/Utils/SupportedKeyWords";
import CanvasRelationshipAttribute from "../CanvasRelationshipAttribute/CanvasRelationshipAttribute";


type Props = { relationshipData: IGetRelationshipDTO };

export default function CanvasRelationship({ relationshipData }: Props) {
    const relationshipType = SUPPORTED_RELATIONSHIP_TYPES.find((relationshipType) => relationshipType.name === relationshipData.relationshipType);

    return (
        <div id="ClassDiagramCanvas">
            {/* Classifier type and name */}
            <div>
                {
                    translate("ASCIIDiagram.relationship.title_single") +
                    translate("feedback.common.relationship_type." + relationshipData.relationshipType) + " " +
                    relationshipData.relationshipName
                    
                }
            </div>

            -----------

            <div>
                { 
                    relationshipData.sourceClassifierName + " " +
                    relationshipType?.ascii + " " +
                    relationshipData.targetClassifierName
                }
            </div>

            {
                relationshipData.attribute == null ?
                "" :
                <CanvasRelationshipAttribute attributeData={ relationshipData.attribute } multiplicity={ relationshipData.multiplicity } />

            }
        </div>
    )
}