import translate from "../../Controller/Translate";
import IGetClassifierDTO from "../../public/DTO/IGetClassifierDTO";
import IGetRelationshipDTO from "../../public/DTO/IGetRelationshipDTO";
import CanvasClassifierRelationship from "../CanvasClassifierRelationship/CanvasClassifierRelationship";


type Props = { sourceClassifierData: IGetClassifierDTO, targetClassifierData: IGetClassifierDTO, relationshipsData: IGetRelationshipDTO[] };

export default function CanvasRelationshipClassifier({ sourceClassifierData, targetClassifierData, relationshipsData }: Props) {
    return (
        <div  id="ClassDiagramCanvas">
            <div>
                {
                    translate("ASCIIDiagram.multiple_relationships.header.part_1") +
                    sourceClassifierData.name +
                    translate("ASCIIDiagram.multiple_relationships.header.part_2") +
                    targetClassifierData.name +
                    translate("ASCIIDiagram.multiple_relationships.header.part_3")

                }
            </div>

            -----------

            <div>
                {
                    relationshipsData.length < 1 ?
                    translate("ASCIIDiagram.relationship.no_relationships") : 
                    relationshipsData.map((relationship) => {
                        return <CanvasClassifierRelationship relationshipData={ relationship } key={ relationship.relationshipName } />
                    })
                }
            </div>
        </div>
    )
}