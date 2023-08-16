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
     * @param creationInstructions Instructions for relationship creation.
     */
    constructor(creationInstructions: ICreateRelationshipDTO){
        super(creationInstructions.relationshipName)
        this.sourceClassifierId = creationInstructions.sourceClassifierId;
        this.targetClassifierId = creationInstructions.targetClassifierId;

        // Checks and possibly defaults realtionship type.
        if(creationInstructions.relatioshipType === undefined) {
            this.relatioshipType = SUPPORTED_RELATIONSHIP_TYPES[0].name;
        } else {
            const supportedRelationshipType = SUPPORTED_RELATIONSHIP_TYPES.find((relationshipType) => relationshipType.code === creationInstructions.relatioshipType);
            if (supportedRelationshipType !== undefined) {
                this.relatioshipType = supportedRelationshipType.name;
            } else {
                const errorFeedback = new Feedback();
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.relationship.error.invalid_relationship_code.part_1."));
                errorFeedback.addSnippet(new StringSnippet(creationInstructions.relatioshipType));
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.relationship.error.invalid_relationship_code.part_2."));

                throw new AppError(errorFeedback);
            }
        }
        
        // Creates attribute if argument is present.
        if(creationInstructions.attribute !== undefined) {
            this.attribute = new Attribute(creationInstructions.attribute);
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

        if(alterInstructions.attributeAlterInstructions.remove[0] !== undefined) {
            this.attribute = undefined;

            numberOfAttributeArgument++;
        }

        if(alterInstructions.attributeAlterInstructions.create[0] !== undefined) {
            if(this.attribute === undefined) {
                const createAttributeInstructions = alterInstructions.attributeAlterInstructions.create[0];
                this.attribute = new Attribute(createAttributeInstructions);
            } else {
                const errorFeedback = new Feedback();
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.relationship.error.attribute_already_exists"));

                throw new AppError(errorFeedback);
            }

            numberOfAttributeArgument++;
        }

        if(alterInstructions.attributeAlterInstructions.alter[0] !== undefined) {
            if(this.attribute !== undefined) {
                const alterAttributeInstructions = alterInstructions.attributeAlterInstructions.alter[0];
                this.attribute.alter(alterAttributeInstructions);
            } else {
                const errorFeedback = new Feedback();
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.relationship.error.attribute_does_not_exist"));

                throw new AppError(errorFeedback);
            }

            numberOfAttributeArgument++;
        }

        if(numberOfAttributeArgument > 1) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.relationship.error.only_one_attribute_argument_allowed"));

            throw new AppError(errorFeedback);
        }

        const alterFeedback = new Feedback();
        alterFeedback.addSnippet(new LocalizationSnippet("feedback.alter.relationship.success.part_1"));
        alterFeedback.addSnippet(new StringSnippet(this.getName()));
        alterFeedback.addSnippet(new LocalizationSnippet("feedback.alter.relationship.success.part_2"));

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