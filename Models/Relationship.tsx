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
    private relationshipType: string;
    private attribute?: Attribute;
    private multiplicity?: string;

    /**
     * Creates a relationship between classifiers following DTO instrucitons.
     * 
     * @param creationInstructions Instructions for relationship creation.
     */
    constructor(creationInstructions: ICreateRelationshipDTO){
        super(creationInstructions.relationshipName, creationInstructions.id)
        this.sourceClassifierId = creationInstructions.sourceClassifierId;
        this.targetClassifierId = creationInstructions.targetClassifierId;

        // Checks and possibly defaults realtionship type.
        if(creationInstructions.relationshipType === undefined) {
            this.relationshipType = SUPPORTED_RELATIONSHIP_TYPES[0].name;
        } else {
            const supportedRelationshipTypeByCode = SUPPORTED_RELATIONSHIP_TYPES.find((relationshipType) => relationshipType.code === creationInstructions.relationshipType);
            const supportedRelationshipTypeByName = SUPPORTED_RELATIONSHIP_TYPES.find((relationshipType) => relationshipType.name === creationInstructions.relationshipType);
            if (supportedRelationshipTypeByCode !== undefined) {
                this.relationshipType = supportedRelationshipTypeByCode.name;
            } else if(supportedRelationshipTypeByName !== undefined) {
                this.relationshipType = supportedRelationshipTypeByName.name;
            } else {
                const errorFeedback = new Feedback();
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.relationship.error.invalid_relationship_code.part_1"));
                errorFeedback.addSnippet(new StringSnippet(creationInstructions.relationshipType));
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.relationship.error.invalid_relationship_code.part_2"));

                throw new AppError(errorFeedback);
            }
        }
        
        // Creates attribute if argument is present.
        if(creationInstructions.attribute !== undefined) {
            this.multiplicity = creationInstructions.multiplicity;
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

        switch(alterInstructions.attributeAlterInstructions.alterationCommand){
            case "remove":
                this.attribute = undefined;
                break

            case "create":
                if(this.attribute === undefined) {
                    this.attribute = new Attribute({
                        name: alterInstructions.attributeAlterInstructions.newName,
                        type: alterInstructions.attributeAlterInstructions.newType,
                        visibility: alterInstructions.attributeAlterInstructions.newVisibility
                    });
                } else {
                    const errorFeedback = new Feedback();
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.relationship.error.attribute_already_exists"));
    
                    throw new AppError(errorFeedback);
                }
                break

            case "alter":
                if(this.attribute !== undefined) {
                    this.attribute.alter({
                        attributeName: "",
                        newName: alterInstructions.attributeAlterInstructions.newName,
                        newType: alterInstructions.attributeAlterInstructions.newType,
                        newVisibility: alterInstructions.attributeAlterInstructions.newVisibility
                    });
                } else {
                    const errorFeedback = new Feedback();
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.relationship.error.attribute_does_not_exist"));
    
                    throw new AppError(errorFeedback);
                }
                break
        }

        if(alterInstructions.attributeAlterInstructions.newMultiplicity !== undefined) {
            this.multiplicity = alterInstructions.attributeAlterInstructions.newMultiplicity;
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
        return this.relationshipType;
    }

    /**
     * Gets relationship's multiplicity.
     * 
     * @returns Target classifier's multiplicity.
     */
    public getMultiplicity(): string | undefined {
        return this.multiplicity;
    }

    /**
     * Gets relationship's attribute's name.
     * 
     * @returns Target classifier's multiplicity.
     */
    public getAttributeName(): string | undefined {
        return this.attribute?.getName();
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
        toTextFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.of_type"));
        toTextFeedback.addSnippet(new StringSnippet(this.relationshipType));

        if(this.attribute !== undefined) {
            toTextFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.attribute_is_present"));
            toTextFeedback.mergeFeedback(this.attribute.toText());

            if(this.multiplicity !== undefined) {
                toTextFeedback.addSnippet(new LocalizationSnippet("feedback.read.relationship.multiplicity_is_present"));
                toTextFeedback.addSnippet(new StringSnippet(this.multiplicity));
            }
        }

        return toTextFeedback;
    }
}