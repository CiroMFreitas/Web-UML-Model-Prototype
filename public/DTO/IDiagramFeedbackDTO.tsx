import IGetEntityDTO from "./IGetEntityDTO";
import Feedback from "../../Models/Feedback";

/**
 * Entity data that was manipulated and text to speech feedback.
 */
export default interface IDiagramFeedbackDTO {
    entityData: IGetEntityDTO;
    feedback: Feedback;
}