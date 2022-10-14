import { ERROR_FAILED_FEEDBACK_HANDLING } from "../../../Utils/Errors";
import { SUPPORTED_COMMANDS, SUPPORTED_ENTITY_TYPES } from "../../../Utils/SupportedKeyWords";

export default function feedbackHandler(handledCommand) {
    let handledFeedback;

    switch(true) {
        case SUPPORTED_COMMANDS.create.includes(handledCommand.command):
            handledFeedback = createFeedBackHandler(handledCommand);

        break;

        default:
            return ERROR_FAILED_FEEDBACK_HANDLING;
    }

    return handledFeedback;
}

function createFeedBackHandler(createdEntity) {
    switch(true) {
        case SUPPORTED_ENTITY_TYPES.class.includes(createdEntity.entityType.toLowerCase()):
            return "A classe " + createdEntity.entityName + " foi criada com sucesso!";

        default:
            return ERROR_FAILED_FEEDBACK_HANDLING;
    }
}
