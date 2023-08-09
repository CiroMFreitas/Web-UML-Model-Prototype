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
    private entityType: string;
    private attributes = [] as Attribute[];
    private methods = [] as Method[];
    
    /**
     * Creates a Classifier.
     * 
     * @param entityType Classifer's type, vaid types are, class, abstract and interface.
     * @param classifierName Classifier's name.
     * @param attributeArguments Classifier's array of attribute's arguments to be created.
     * @param methodArguments Classifier's array of method's arguments to be created.
     */
    constructor(entityType: string, classifierName: string, attributeArguments?: string[], methodArguments?: string[]) {
        super(classifierName);
        this.entityType = entityType === SUPPORTED_ENTITY_TYPES.classifier[0] ? SUPPORTED_ENTITY_TYPES.classifier[1] : entityType;

        // Cretas attributes if arguments are present.
        if(attributeArguments !== undefined) {
            attributeArguments.forEach((argument) => {
                const newAttribute = new Attribute(argument);
                this.isAttributeNameInUse(newAttribute.getName());

                this.attributes.push(newAttribute);
            });
        }

        // Cretas methods if arguments are present.
        if(methodArguments !== undefined) {
            const handledMethodArguments = this.handleMethodArguments(methodArguments);
            handledMethodArguments.forEach((handledMethod) => {
                const newMethod = new Method(handledMethod);
                this.isMethodNameInUse(newMethod.getName());

                this.methods.push(newMethod);
            });
        }
    }

    /**
     * Handles instructions for alterations to attributes, expects a array containg a string with instructions
     * separated by ":".
     * 
     * @param attributesChanges Array containing instructions.
     */
    public alterAttributes(attributesChanges: string[]): void {
        attributesChanges.forEach((change) => {
            const changeArguments = change.split(":");
            const alterationArgument = changeArguments.shift();
            
            if((alterationArgument === undefined) || (alterationArgument === "")) {
                const errorFeedback = new Feedback();
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.attributes.error.missing_alteration_argument.part_1"));
                errorFeedback.addSnippet(new StringSnippet(":" + changeArguments.toString().replaceAll(",", ":")));
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.attributes.error.missing_alteration_argument.part_2"));

                throw new AppError(errorFeedback);

            } else {
                switch(true) {
                    case alterationArgument === "add":
                        const newAttribute = new Attribute(alterationArgument.toString().replaceAll(",", ":"));
                        this.isAttributeNameInUse(newAttribute.getName());
                        this.attributes.push(newAttribute);
                        break;

                    case alterationArgument === "remove":
                        const removalIndex = this.getAttributeIndexByName(changeArguments[0]);
                        this.attributes.splice(removalIndex, 1);
                        break;

                    case alterationArgument === "alter":
                        const alteringAttribute = this.getAttributeByName(changeArguments[0]);
                        this.isAttributeNameInUse(changeArguments[2])
                        alteringAttribute.alter(changeArguments.splice(1));
                        break;

                    default:
                        const errorFeedback = new Feedback();
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.error.invalid_alteration_argument.part_1"));
                        errorFeedback.addSnippet(new StringSnippet(alterationArgument + ":" + changeArguments.toString().replaceAll(",", ":")));
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.error.invalid_alteration_argument.part_2"));
    
                        throw new AppError(errorFeedback);
                }
            }
        });
    }

    /**
     * Handles instructions for alterations to attributes, expects a array containg a string with instructions
     * separated by ":".
     * 
     * @param methodsChanges Array containing instructions.
     */
    public alterMethods(methodsChanges: string[]): void {
        const handledmethodsChanges = this.handleMethodArguments(methodsChanges);
        handledmethodsChanges.forEach((change) => {
            const methodChangeArguments = change[0].split(":");
            const paramenterChangeArguments = change.splice(1);
            const alterationArgument = methodChangeArguments.shift();
            
            if((alterationArgument === undefined) || (alterationArgument === "")) {
                const errorFeedback = new Feedback();
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.error.missing_alteration_argument.part_1"));
                errorFeedback.addSnippet(new StringSnippet(":" + methodChangeArguments.toString().replaceAll(",", ":") + ".."));
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.error.missing_alteration_argument.part_2"));

                throw new AppError(errorFeedback);
            } else {
                switch(true) {
                    case alterationArgument === "add":
                        const newMethod = new Method([alterationArgument.toString().replaceAll(",", ":")].concat(paramenterChangeArguments));
                        this.isMethodNameInUse(newMethod.getName());
                        this.methods.push(newMethod);
                        break;

                    default:
                        const errorFeedback = new Feedback();
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.error.invalid_alteration_argument.part_1"));
                        errorFeedback.addSnippet(new StringSnippet(alterationArgument + ":" + methodChangeArguments.toString().replaceAll(",", ":") + ".."));
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.error.invalid_alteration_argument.part_2"));
    
                        throw new AppError(errorFeedback);
                }
            }
        });
    }

    /**
     * Get's classifier's type.
     * 
     * @returns Classifier's type.
     */
    public getEntityType(): string {
        return this.entityType;
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
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.common.entity_type." + this.entityType));
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
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.common.entity_type." + this.entityType));
            errorFeedback.addSnippet(new StringSnippet(" " + this.getName()));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.attributes.error.attribute_not_found.part_3"));

            throw new AppError(errorFeedback);
        }

        return searchedAttribute;
    }

    /**
     * Creates a feedback with classifier's information for a screen reader.
     * 
     * @param commandLineArray Details to be read from classifier.
     * @returns Classifier data in feedback format..
     */
    public toText(commandLineArray: string[]): Feedback {
        const toTextFeedback = new Feedback()
  
        // Start classifier read feedbback.
        toTextFeedback.addSnippet(new LocalizationSnippet("feedback.read.classifier.part_1"));
        toTextFeedback.addSnippet(new StringSnippet(this.getName()));
        toTextFeedback.addSnippet(new LocalizationSnippet("feedback.read.classifier.part_2"));
        toTextFeedback.addSnippet(new LocalizationSnippet("feedback.common.classifier_type."+this.entityType));

        let areArgumentsPresent = false;

        if(commandLineArray.includes("-a")) {
            areArgumentsPresent = true;

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

        if(commandLineArray.includes("-m")) {
            areArgumentsPresent = true;

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

        if(areArgumentsPresent) {
            toTextFeedback.addSnippet(".");
        } else {
            toTextFeedback.addSnippet(new LocalizationSnippet("feedback.read.classifier.is_present"));
        }

        return toTextFeedback;
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