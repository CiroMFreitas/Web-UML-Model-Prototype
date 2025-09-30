import translate from "../../Controller/Translate";
import IGetClassifierDTO from "../../public/DTO/IGetClassifierDTO";
import CanvasDiagramClassifier from "../CanvasDiagramClassifier/CanvasDiagramClassifier";

type Props = { classifiersData: IGetClassifierDTO[] };

export default function CanvasDiagramClassifiers({ classifiersData }: Props) {
    return (
        <div>
            <div>
                { translate("ASCIIDiagram.diagram.classifier_header") }
            </div>

            <div>
                {
                    classifiersData.map(classifier => {
                        return <CanvasDiagramClassifier classifierData={ classifier } key={ classifier.name } />
                    })
                }
            </div>
        </div>
    )
}