import IToRenderEntityDTO from "./IToRenderEntityDTO";
import Feedback from "../../Models/Feedback";

/**
 * Entity data that was manipulated and text to speech feedback.
 */
export default interface IDiagramFeedbackDTO {
    entityData: IToRenderEntityDTO;
    feedback: Feedback;
}