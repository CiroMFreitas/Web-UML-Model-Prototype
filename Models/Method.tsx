import IAlterMethodDTO from "../public/DTO/IAlterMethodDTO";
import ICreateMethodDTO from "../public/DTO/ICreateMethodDTO";
import AppError from "./AppError";
import Feedback from "./Feedback";
import LocalizationSnippet from "./LocalizationSnippet";
import Parameter from "./Parameter";
import StringSnippet from "./StringSnippet";
import VisibleEntity from "./VisibleEntity";

/**
 * Classifier's methods.
 */
export default class Method extends VisibleEntity {
    private parameters = [] as Parameter[];

    /**
     * Creates a method.
     * 
     * @param creationInstructions DTO containing instructions for mwthod creation.
     */
    constructor(creationInstructions: ICreateMethodDTO) {
        super(creationInstructions.name, creationInstructions.type, creationInstructions.visibility, creationInstructions.Id);

        // Sets parameters if any arguments are present.
        creationInstructions.parameters.forEach((parameterInstructions) => {
            const firstParameter = new Parameter(parameterInstructions);
            this.isParameterNameInUse(firstParameter.getName());

            this.parameters.push(firstParameter)
        })
    }

    /**
     * Changes method's data following DTO instructions.
     * 
     * @param alterations DTO containing alterations instructions.
     */
    public alter(alterations: IAlterMethodDTO): void {
        if((alterations.newMethodVisibility !== "-") && (alterations.newMethodVisibility !== "")) {
            this.setVisibility(alterations.newMethodVisibility);
        }

        if((alterations.newMethodName !== "-") && (alterations.newMethodName !== "")) {
            this.setName(alterations.newMethodName);
        }

        if((alterations.newMethodType !== "-") && (alterations.newMethodType !== "")) {
            this.setType(alterations.newMethodType);
        }
        
        alterations.parameterAlteraions.remove.forEach((removeParameter) => {
            const toRemoveParameterIndex = this.getParameterIndexByName(removeParameter.paramaterName);
            this.parameters.splice(toRemoveParameterIndex, 1);
        });
        
        alterations.parameterAlteraions.create.forEach((createParameter) => {
            const newParameter = new Parameter(createParameter);
            this.isParameterNameInUse(newParameter.getName());
            this.parameters.push(newParameter);
        });
        
        alterations.parameterAlteraions.alter.forEach((alterParameter) => {
            const toAlterParameter = this.getParameterByName(alterParameter.parameterName);
            toAlterParameter.alter(alterParameter);
            this.isParameterNameInUse(toAlterParameter.getName());
        });
    }

    /**
     * Checks if given name is already in use by a parameter, if true an error will be thrown.
     * 
     * @param parameterName Name to be checked.
     */
    private isParameterNameInUse(parameterName: string): void {
        const methodExists = this.parameters.find((parameter) => parameter.getName() === parameterName);

        if(methodExists) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.methods.error.parameter_name_already_in_use.part_1"));
            errorFeedback.addSnippet(new StringSnippet(parameterName))
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.methods.error.parameter_name_already_in_use.part_2"));

            throw new AppError(errorFeedback);
        }
    }

    /**
     * Searchs a parameter's index using it's name, if not found an error will be thrown.
     * 
     * @param name Name of the parameter to be searched.
     * @returns Desired parameter's index.
     */
    private getParameterIndexByName(name: string): number {
        const parameterIndex = this.parameters.findIndex((parameter) => parameter.getName() === name);

        if(parameterIndex === -1) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.methods.error.parameter_not_found.part_1"));
            errorFeedback.addSnippet(new StringSnippet(name));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.methods.error.parameter_not_found.part_2"));
            errorFeedback.addSnippet(new StringSnippet(this.getName()));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.methods.error.parameter_not_found.part_3"));

            throw new AppError(errorFeedback);
        }

        return parameterIndex;
    }

    /**
     * Searchs a parameter using it's name, if not found an error will be thrown.
     * 
     * @param name Name of the parameter to be searched.
     * @returns Desired parameter.
     */
    private getParameterByName(name: string): Parameter {
        const searchedParameter = this.parameters.find((parameter) => parameter.getName() === name);

        if(searchedParameter === undefined) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.methods.error.parameter_not_found.part_1"));
            errorFeedback.addSnippet(new StringSnippet(name));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.methods.error.parameter_not_found.part_2"));
            errorFeedback.addSnippet(new StringSnippet(this.getName()));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.methods.error.parameter_not_found.part_3"));

            throw new AppError(errorFeedback);
        }

        return searchedParameter;
    }

    /**
     * Creates a feedback all of method's information for a screen reader.
     * 
     * @returns Method data in feedback format..
     */
    public toText(): Feedback {
        const readFeedback = new Feedback();
        readFeedback.addSnippet(new StringSnippet(this.getName()));
        readFeedback.addSnippet(new LocalizationSnippet("feedback.read.method.with_type"));
        readFeedback.addSnippet(new StringSnippet(this.getType()));
        readFeedback.addSnippet(new LocalizationSnippet("feedback.read.method.with_visibility"));
        readFeedback.addSnippet(new LocalizationSnippet("feedback.common.visibility."+this.getVisibility()));

        // Get parametrs feedback,
        if(this.parameters.length > 0) {
            if(this.parameters.length === 1) {
                readFeedback.addSnippet(new LocalizationSnippet("feedback.read.methods.parameters.singular"));
                readFeedback.mergeFeedback(this.parameters[0].toText());
            } else {
                readFeedback.addSnippet(new LocalizationSnippet("feedback.read.methods.parameters.plural"));
                this.parameters.forEach((parameter, index) => {
                    if(index+1 === this.parameters.length) {
                        readFeedback.addSnippet(new LocalizationSnippet("feedback.read.methods.parameters.and"));
                    } else {
                        readFeedback.addSnippet(new StringSnippet(", "));
                    }
                    readFeedback.mergeFeedback(parameter.toText());
                });
            }
        } else {
            readFeedback.addSnippet(new LocalizationSnippet("feedback.read.methods.parameters.no_parameters"));
        }

        return readFeedback;
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