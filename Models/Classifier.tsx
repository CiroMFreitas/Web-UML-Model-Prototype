import IAttributeChangesDTO from "../public/DTO/IAttributeChangesDTO";
import ICreateClassifierDTO from "../public/DTO/ICreateClassifierDTO";
import IMethodChangesDTO from "../public/DTO/IMethodChangesDTO";
import IReadClassifierDTO from "../public/DTO/IReadClassifierDTO";
import { SUPPORTED_ENTITY_TYPES } from "../public/Utils/SupportedKeyWords";
import AppError from "./AppError";
import Attribute from "./Attribute";
import DiagramEntity from "./DiagramEntity";
import Feedback from "./Feedback";
import LocalizationSnippet from "./LocalizationSnippet";
import Method from "./Method";
import StringSnippet from "./StringSnippet";

/**
 * Classifiers holding attributes and methods.
 */
export default class Classifier extends DiagramEntity {
    private classifierType: string;
    private attributes = [] as Attribute[];
    private methods = [] as Method[];
    
    /**
     * Creates a Classifier.
     * 
     * @param creationInstructions DTO contaning instructions for classifier creation.
     */
    constructor(creationInstructions: ICreateClassifierDTO) {
        super(creationInstructions.name, creationInstructions.id);
        // If classifier is the given type it will be saved as a class.
        this.classifierType = creationInstructions.classifierType === SUPPORTED_ENTITY_TYPES.classifier[0] ? SUPPORTED_ENTITY_TYPES.classifier[1] : creationInstructions.classifierType;

        // Cretas attributes if any arguments are present.
        creationInstructions.attributes.forEach((attributeInstructions) => {
            const newAttribute = new Attribute(attributeInstructions);
            this.isAttributeNameInUse(newAttribute.getName());

            this.attributes.push(newAttribute);
        });

        // Cretas methods if any arguments are present.
        creationInstructions.methods.forEach((methodInstructions) => {
            const newMethod = new Method(methodInstructions);
            this.isMethodNameInUse(newMethod.getName());

            this.methods.push(newMethod);
        });
    }

    /**
     * Execute classifier's attribute alterations.
     * 
     * @param attributesChanges DTO containing instructions.
     */
    public alterAttributes(alterationInstructions: IAttributeChangesDTO): void {
        alterationInstructions.remove.forEach((removeAttribute) => {
            const toRemoveAttributeIndex = this.getAttributeIndexByName(removeAttribute.attributeName);
            this.attributes.splice(toRemoveAttributeIndex, 1);
        });

        alterationInstructions.create.forEach((createAttribute) => {
            const newAttribute = new Attribute(createAttribute);
            this.isAttributeNameInUse(newAttribute.getName());
            this.attributes.push(newAttribute);
        });

        alterationInstructions.alter.forEach((alterAttribute) => {
            const toAlterAttribute = this.getAttributeByName(alterAttribute.attributeName);
            toAlterAttribute.alter(alterAttribute);
            if(alterAttribute.newName !== "" && alterAttribute.newName !== alterAttribute.attributeName) {
                this.isAttributeNameInUse(toAlterAttribute.getName());
            }

        });
    }

    /**
     * Execute classifier's methods alterations.
     * 
     * @param methodsChanges DTO containing instructions.
     */
    public alterMethods(alterationInstructions: IMethodChangesDTO): void {
        alterationInstructions.remove.forEach((removeMethod) => {
            const toRemoveMethoIndex = this.getMethodIndexByName(removeMethod.methodName);
            this.methods.splice(toRemoveMethoIndex, 1);
        });

        alterationInstructions.create.forEach((createMethod) => {
            const newMethod = new Method(createMethod);
            this.isMethodNameInUse(newMethod.getName());
            this.methods.push(newMethod);
        });

        alterationInstructions.alter.forEach((alterMethod) => {
            const toAlterMethod = this.getMethodByName(alterMethod.methodName);
            toAlterMethod.alter(alterMethod);
            this.isMethodNameInUse(toAlterMethod.getName());
        });
    }

    /**
     * Get's classifier's type.
     * 
     * @returns Classifier's type.
     */
    public getClassifierType(): string {
        return this.classifierType;
    }

    /**
     * Set's classifier's type.
     * 
     */
    public setClassifierType(classifierType: string): void {
        if(!SUPPORTED_ENTITY_TYPES.classifier.includes(classifierType)) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.error.invalid_classifiier_type.part_1"));
            errorFeedback.addSnippet(new StringSnippet(classifierType));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.error.invalid_classifiier_type.part_2"));
            
            throw new AppError(errorFeedback);
        }

        // If classifier is the given type it will be saved as a class.
        this.classifierType = classifierType === SUPPORTED_ENTITY_TYPES.classifier[0] ? SUPPORTED_ENTITY_TYPES.classifier[1] : classifierType;
    }

    /**
     * Checks if given name is already in use by an attribute, if true an error will be thrown.
     * 
     * @param attributeName Name to be checked.
     */
    private isAttributeNameInUse(attributeName: string): void {
        const attributeExists = this.attributes.find((attribute) => attribute.getName() === attributeName);

        if(attributeExists) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.attribute_name_already_in_use.part_1"));
            errorFeedback.addSnippet(new StringSnippet(attributeName))
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.attribute_name_already_in_use.part_2"));

            throw new AppError(errorFeedback);
        }
    }

    /**
     * Handles arguments for methods creation.
     * 
     * @param methodArguments Arguments to be handled.
     * @returns Handled arguments.
     */
    private handleMethodArguments(methodArguments: string[]): string[][] {
        // Breaks method arguments into arrays for method creation
        const handledMethodArguments = [[]] as string[][];
        let endparameter = methodArguments.findIndex((methodArgument) => methodArgument.includes(")"))+1;
        while(endparameter !== 0) {
            handledMethodArguments.push(methodArguments.splice(0, endparameter))
            
            endparameter = methodArguments.findIndex((methodArgument) => methodArgument.includes(")"))+1;
        }

        // Checks if there were left overs, meaning the methods were not properly declared.
        if(methodArguments.length > 0) {
            // rebuilds method for error feedback.
            const errorMethod = "";
            handledMethodArguments.forEach((handledMethod) => {
                errorMethod.concat(handledMethod.toString().replaceAll(",", " "));
            });
            errorMethod.concat(methodArguments.toString().replaceAll(",", " "));

            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.syntax_error_in_method_argument.part_1"));
            errorFeedback.addSnippet(new StringSnippet(errorMethod))
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.syntax_error_in_method_argument.part_2"));

            throw new AppError(errorFeedback);
        }

        return handledMethodArguments;
    }

    /**
     * Checks if given name is already in use by a method, if true an error will be thrown.
     * 
     * @param methodName Name to be checked.
     */
    private isMethodNameInUse(methodName: string): void {
        const methodExists = this.methods.find((method) => method.getName() === methodName);

        if(methodExists) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.method_name_already_in_use.part_1"));
            errorFeedback.addSnippet(new StringSnippet(methodName))
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.classifier.error.method_name_already_in_use.part_2"));

            throw new AppError(errorFeedback);
        }
    }

    /**
     * Searchs a attribute's index using it's name, if not found an error will be thrown.
     * 
     * @param name Name of the attribute to be searched.
     * @returns Desired attribute's index.
     */
    private getAttributeIndexByName(name: string): number {
        const attributeIndex = this.attributes.findIndex((attribute) => attribute.getName() === name);

        if(attributeIndex === -1) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.attributes.error.attribute_not_found.part_1"));
            errorFeedback.addSnippet(new StringSnippet(name));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.attributes.error.attribute_not_found.part_2"));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.common.entity_type." + this.classifierType));
            errorFeedback.addSnippet(new StringSnippet(" " + this.getName()));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.attributes.error.attribute_not_found.part_3"));

            throw new AppError(errorFeedback);
        }

        return attributeIndex;
    }

    /**
     * Searchs a attribute using it's name, if not found an error will be thrown.
     * 
     * @param name Name of the attribute to be searched.
     * @returns Desired attribute.
     */
    private getAttributeByName(name: string): Attribute {
        const searchedAttribute = this.attributes.find((attribute) => attribute.getName() === name);

        if(searchedAttribute === undefined) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.attributes.error.attribute_not_found.part_1"));
            errorFeedback.addSnippet(new StringSnippet(name));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.attributes.error.attribute_not_found.part_2"));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.common.entity_type." + this.classifierType));
            errorFeedback.addSnippet(new StringSnippet(" " + this.getName()));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.attributes.error.attribute_not_found.part_3"));

            throw new AppError(errorFeedback);
        }

        return searchedAttribute;
    }

    /**
     * Searchs a method's index using it's name, if not found an error will be thrown.
     * 
     * @param name Name of the method to be searched.
     * @returns Desired method's index.
     */
    private getMethodIndexByName(name: string): number {
        const methodIndex = this.methods.findIndex((method) => method.getName() === name);

        if(methodIndex === -1) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.method.error.method_not_found.part_1"));
            errorFeedback.addSnippet(new StringSnippet(name));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.method.error.method_not_found.part_2"));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.common.entity_type." + this.classifierType));
            errorFeedback.addSnippet(new StringSnippet(" " + this.getName()));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.method.error.method_not_found.part_3"));

            throw new AppError(errorFeedback);
        }

        return methodIndex;
    }

    /**
     * Searchs a method using it's name, if not found an error will be thrown.
     * 
     * @param name Name of the method to be searched.
     * @returns Desired method.
     */
    private getMethodByName(name: string): Method {
        const searchedMethod = this.methods.find((method) => method.getName() === name);

        if(searchedMethod === undefined) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.method.error.attribute_not_found.part_1"));
            errorFeedback.addSnippet(new StringSnippet(name));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.method.error.attribute_not_found.part_2"));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.common.entity_type." + this.classifierType));
            errorFeedback.addSnippet(new StringSnippet(" " + this.getName()));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.method.error.attribute_not_found.part_3"));

            throw new AppError(errorFeedback);
        }

        return searchedMethod;
    }

    /**
     * Creates a feedback with classifier's information for a screen reader.
     * 
     * @param readInstructions Instructions for readaing classifier.
     * @returns Classifier data in feedback format..
     */
    public toText(readInstructions: IReadClassifierDTO): Feedback {
        const toTextFeedback = new Feedback()
  
        // Start classifier read feedbback.
        toTextFeedback.addSnippet(new LocalizationSnippet("feedback.read.classifier.part_1"));
        toTextFeedback.addSnippet(new StringSnippet(this.getName()));
        toTextFeedback.addSnippet(new LocalizationSnippet("feedback.read.classifier.part_2"));
        toTextFeedback.addSnippet(new LocalizationSnippet("feedback.common.classifier_type."+this.classifierType));

        if(readInstructions.readAttributes) {
            if(this.attributes.length > 0) {
                if(this.attributes.length === 1) {
                    toTextFeedback.addSnippet(new LocalizationSnippet("feedback.read.classifier.attributes.singular"));
                    toTextFeedback.mergeFeedback(this.attributes[0].toText());
                } else {
                    toTextFeedback.addSnippet(new LocalizationSnippet("feedback.read.classifier.attributes.plural"));
                    this.attributes.forEach((attribute, index) => {
                        if(index+1 === this.attributes.length) {
                            toTextFeedback.addSnippet(new LocalizationSnippet("feedback.read.classifier.attributes.and"));
                        } else {
                            toTextFeedback.addSnippet(new StringSnippet(", "));
                        }
                        toTextFeedback.mergeFeedback(attribute.toText());
                    });
                }
            }
        }

        if(readInstructions.readMethods) {
            if(this.methods.length > 0) {
                if(this.methods.length === 1) {
                    toTextFeedback.addSnippet(new LocalizationSnippet("feedback.read.classifier.methods.singular"));
                    toTextFeedback.mergeFeedback(this.methods[0].toText());
                } else {
                    toTextFeedback.addSnippet(new LocalizationSnippet("feedback.read.classifier.methods.plural"));
                    this.methods.forEach((method, index) => {
                        if(index+1 === this.methods.length) {
                            toTextFeedback.addSnippet(new LocalizationSnippet("feedback.read.classifier.methods.and"));
                        } else {
                            toTextFeedback.addSnippet(new StringSnippet(", "));
                        }
                        toTextFeedback.mergeFeedback(method.toText());
                    });
                }
            }
        }

        if(readInstructions.readAttributes || readInstructions.readMethods) {
            toTextFeedback.addSnippet(".");
        } else {
            toTextFeedback.addSnippet(new LocalizationSnippet("feedback.read.classifier.is_present"));
        }

        return toTextFeedback;
    }

    /**
     * Generates an array in PlantUML's format.
     * 
     * @returns Array formated for PlantUML.
     */
    public exportToPlantUML(): string[] {
        const exportContent = [this.classifierType + " " + this.getName() + "\n"];

        this.attributes.forEach((attribute) => {
            exportContent.push(this.getName() + " : " + attribute.exportToPlantUML() + "\n")
        })

        this.methods.forEach((method) => {
            exportContent.push(this.getName() + " : " + method.exportToPlantUML() + "\n")
        })

        return exportContent;
    }

    /**
     * Stub.
     * 
     * @returns Stub.
     */
    public toDiagram(): string {
        return "";
    }
}