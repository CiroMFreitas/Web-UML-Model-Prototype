import IAlterRelationshipDTO from "../public/DTO/IAlterRelationshipDTO";
import ICreateRelationshipDTO from "../public/DTO/ICreateRelationshipDTO";
import { SUPPORTED_RELATIONSHIP_TYPES } from "../public/Utils/SupportedKeyWords";
import AppError from "./AppError";
import Attribute from "./Attribute";
import DiagramEntity from "./DiagramEntity";
import Feedback from "./Feedback";
import LocalizationSnippet from "./LocalizationSnippet";
import StringSnippet from "./StringSnippet";

/**
 * Represents relationships between classifiers in diagram.
 */
export default class Relationship extends DiagramEntity {
    private sourceClassifierId: string;
    private targetClassifierId: string;
    private relatioshipType: string;
    private attribute?: Attribute;

    /**
     * Creates a relationship between classifiers following DTO instrucitons.
     * 
     * @param relationshipCreationData Instructions for relationship creation.
     */
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
     * Alter relationship's data following DTO instructions.
     * 
     * @param alterInstructions Alterations instructions to be executed.
     * @returns Feedback should the alteration succeed.
     */
    public alter(alterInstructions: IAlterRelationshipDTO, newSourceClassifierId?: string, newTargetClassifierId?: string): Feedback {
        if(alterInstructions.newName !== undefined) {
            this.setName(alterInstructions.newName);
        }

        if(newSourceClassifierId) {
            this.sourceClassifierId = newSourceClassifierId;
        }
        
        if(newTargetClassifierId) {
            this.targetClassifierId = newTargetClassifierId;
        }

        let numberOfAttributeArgument = 0;

        if(alterInstructions.attributeAlterInstructions.alterAttributes.length > 0) {
            const alterAttributeInstructions = alterInstructions.attributeAlterInstructions.alterAttributes[0];
            if(this.attribute !== undefined) {
                this.attribute.alter([
                    alterAttributeInstructions.newVisibility,
                    alterAttributeInstructions.newName,
                    alterAttributeInstructions.newType
    
                ]);
            } else {
                const errorFeedback = new Feedback();
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.relationship.error.attribute_doe_not_exist"));

                throw new AppError(errorFeedback);
            }

            numberOfAttributeArgument++;
        }


        const alterFeedback = new Feedback();

        return alterFeedback;
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

    /**
     * Creates a feedback with classifier's information for a screen reader.
     * 
     * @param commandLineArray Details to be read from classifier.
     * @returns Classifier data in feedback format..
     */
    public toText(): Feedback {
        const toTextFeedback = new Feedback()
        toTextFeedback.addSnippet(new StringSnippet(this.getName()));

        if(this.attribute !== undefined) {
            toTextFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.attribute_is_present"));
            toTextFeedback.mergeFeedback(this.attribute.toText());
        }

        toTextFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.of_tyoe"));
        toTextFeedback.addSnippet(new StringSnippet(this.relatioshipType));

        return toTextFeedback;
    }
}