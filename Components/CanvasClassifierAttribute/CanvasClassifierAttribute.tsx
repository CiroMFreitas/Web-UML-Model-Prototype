import IGetAttributeDTO from "../../public/DTO/IGetAttributeDTO";
import "./CanvasClassifierAttribute.css";

type Props = { attributeData: IGetAttributeDTO };

export default function CanvasClassifierAttribute({ attributeData }: Props) {
    return (
        <div>
            { 
            attributeData.visibility + " " +
            attributeData.name + ": " +
            attributeData.type
            }
        </div>
    )
}