import IGetMethodDTO from "../../public/DTO/IGetMethodDTO";
import "./CanvasClassifierMethod.css";

type Props = { methodData: IGetMethodDTO };

export default function CanvasClassifierMethod({ methodData }: Props) {
    return (
        <div>
            {
                methodData.visibility + " " +
                methodData.name + "(" +
                methodData.parameters.map((parameter) => {
                    return parameter.name + ": " + parameter.type
                }).toString().replaceAll(",", ", ") + "): " +
                methodData.type
            }
        </div>
    )
}