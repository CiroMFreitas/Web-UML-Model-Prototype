import ICreateRelationshipDTO from "../public/DTO/ICreateRelationshipDTO";
import { SUPPORTED_RELATIONSHIP_TYPES } from "../public/Utils/SupportedKeyWords";
import AppError from "./AppError";
import Attribute from "./Attribute";
import DiagramEntity from "./DiagramEntity";
import Feedback from "./Feedback";
import LocalizationSnippet from "./LocalizationSnippet";
import StringSnippet from "./StringSnippet";

export default class Relationship extends DiagramEntity {
    private sourceClassifierId: string;
    private targetClassifierId: string;
    private relatioshipType: string;
    private attribute?: Attribute;

    constructor(relationshipCreationData: ICreateRelationshipDTO){
        super(relationshipCreationData.name)
        this.sourceClassifierId = relationshipCreationData.sourceClassifierId;
        this.targetClassifierId = relationshipCreationData.targetClassifierId;

        // Checks and possibly defaults realtionship type.
        if(relationshipCreationData.relatioshipType === undefined) {
            this.relatioshipType = SUPPORTED_RELATIONSHIP_TYPES[0].name;
        } else {
            const supportedRelationshipType = SUPPORTED_RELATIONSHIP_TYPES.find((relationshipType) => relationshipType.code === relationshipCreationData.relatioshipType);
            if (supportedRelationshipType !== undefined) {
                this.relatioshipType = supportedRelationshipType.name;
            } else {
                const errorFeedback = new Feedback();
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.relationship.error.invalid_relationship_code.part_1."));
                errorFeedback.addSnippet(new StringSnippet(relationshipCreationData.relatioshipType));
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.relationship.error.invalid_relationship_code.part_2."));

                throw new AppError(errorFeedback);
            }
        }
        
        // Creates attribute if argument is present.
        if(relationshipCreationData.attribute !== undefined) {
            this.attribute = new Attribute(relationshipCreationData.attribute);
        }
    }

    /**
     * Gets relationship's source classifier's id.
     * 
     * @returns Source classifier's id.
     */
    public getSourceClassifierId(): string {
        return this.sourceClassifierId;
    }

    /**
     * Gets relationship's target classifier's id.
     * 
     * @returns Target classifier's id.
     */
    public getTargetClassifierId(): string {
        return this.targetClassifierId;
    }

    /**
     * Gets relationship's type.
     * 
     * @returns Target classifier's type.
     */
    public getRelationshipType(): string {
        return this.relatioshipType;
    }
}