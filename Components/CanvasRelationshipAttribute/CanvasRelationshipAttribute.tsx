import translate from "../../Controller/Translate";
import IGetAttributeDTO from "../../public/DTO/IGetAttributeDTO";

type Props = { attributeData: IGetAttributeDTO, multiplicity: string | undefined };

export default function CanvasRelationshipAttribute({ attributeData, multiplicity }: Props) {
    return (
        <>
            -----------

            <div>
                {
                    translate("ASCIIDiagram.relationship.attribute") +
                    attributeData.visibility + " " +
                    attributeData.name + ": " +
                    attributeData.type + " " +
                    (multiplicity ? multiplicity : "")
                }
            </div>
        </>
    )
}