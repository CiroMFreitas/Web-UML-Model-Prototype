import IGetAttributeDTO from "../../public/DTO/IGetAttributeDTO";
import IGetClassifierRelationshipDTO from "../../public/DTO/IGetClassifierRelationshipDTO";
import { SUPPORTED_RELATIONSHIP_TYPES } from "../../public/Utils/SupportedKeyWords";
import "./CanvasClassifierRelationship.css";

type Props = { relationshipData: IGetClassifierRelationshipDTO };

export default function CanvasClassifierRelationship({ relationshipData }: Props) {
    const relationshipType = SUPPORTED_RELATIONSHIP_TYPES.find((relationshipType) => relationshipType.name === relationshipData.relationshipType);

    function relationshipAttribute(attribute: IGetAttributeDTO | null): string {
        if(attribute) {
            return attribute.visibility + " " +
                attribute.name + ": " +
                attribute.type;
        } else {
            return "";
        }
    }

    return (
      <div>
            { 
                relationshipData.sourceClassifierName + " " +
                relationshipType?.ascii + " " +
                relationshipData.targetClassifierName + " :  " +
                relationshipAttribute(relationshipData.attribute) +
                (relationshipData.multiplicity ? relationshipData.multiplicity +  " " : "") +
                " Named: " + relationshipData.relationshipName
            }
      </div>
    )
}