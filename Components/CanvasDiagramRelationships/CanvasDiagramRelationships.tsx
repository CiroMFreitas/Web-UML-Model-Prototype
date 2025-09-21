import translate from "../../Controller/Translate";
import IGetRelationshipDTO from "../../public/DTO/IGetRelationshipDTO";
import CanvasClassifierRelationship from "../CanvasClassifierRelationship/CanvasClassifierRelationship";

type Props = { relationshipsData: IGetRelationshipDTO[] };

export default function CanvasDiagramRelationships({ relationshipsData }: Props) {
    return (
        <div>
            <div>
                { translate("ASCIIDiagram.diagram.relationshiṕ_header") }
            </div>

            <div>
                {
                    relationshipsData.map(relationship => {
                        return <CanvasClassifierRelationship relationshipData={ relationship } key={ relationship.relationshipName } />
                    })
                }
            </div>
        </div>
    )
}