import AppError from "./AppError";
import DiagramEntity from "./DiagramEntity";
import Feedback from "./Feedback";
import LocalizationSnippet from "./LocalizationSnippet";

export default class Classifier extends DiagramEntity {
    private entityType: string;
    
    constructor(entityType: string, classifierName: string, attributeArguments?: string[][]) {
        // Gets and checks if a name was given for classifier.
        if(classifierName === "") {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.name_missing_for_creation.part_1"));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.common.entity_tyoe."+entityType));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.name_missing_for_creation.part_2"));

            throw new AppError(errorFeedback);
        }
        super(classifierName);
        this.entityType = entitytype;
    }
}