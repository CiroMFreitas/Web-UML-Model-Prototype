import translate from "../../Controller/Translate";
import IGetClassifierDTO from "../../public/DTO/IGetClassifierDTO";

type Props = { classifierData: IGetClassifierDTO };

export default function CanvasDiagramClassifier({ classifierData }: Props) {
    return (
        <div>
            {
                translate("ASCIIDiagram.classifier." + classifierData.classifierType) +
                " " +
                classifierData.name
            }
        </div>
    )
}