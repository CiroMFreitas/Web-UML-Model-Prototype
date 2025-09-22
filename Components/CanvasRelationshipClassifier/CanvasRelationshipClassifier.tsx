import translate from "../../Controller/Translate";
import IGetClassifierDTO from "../../public/DTO/IGetClassifierDTO";
import IGetRelationshipDTO from "../../public/DTO/IGetRelationshipDTO";


type Props = { sourceClassifierData: IGetClassifierDTO, targetClassifierData: IGetClassifierDTO, relationshipsData: IGetRelationshipDTO[] };

export default function CanvasRelationshipClassifier({ sourceClassifierData, targetClassifierData, relationshipsData }: Props) {
    return (
        <div>
            
        </div>
    )
}