import translate from "../../Controller/Translate";
import IGetRelationshipDTO from "../../public/DTO/IGetRelationshipDTO";
import { SUPPORTED_RELATIONSHIP_TYPES } from "../../public/Utils/SupportedKeyWords";


type Props = { relationshipData: IGetRelationshipDTO };

export default function CanvasRelationship({ relationshipData }: Props) {
    const relationshipType = SUPPORTED_RELATIONSHIP_TYPES.find((relationshipType) => relationshipType.name === relationshipData.relationshipType);

    return (
        <div id="ClassDiagramCanvas">
            {/* Classifier type and name */}
            <div>
                {
                    translate("ASCIIDiagram.relationship.title_single") +
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

            -----------

            <div>
                { 
                    
                }
            </div>
        </div>
    )
}