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
    private parameters: Parameter[];

    /**
     * Creates a method.
     * 
     * @param methodArguments An array containing method's arguments and it's paramenter's.
     */
    constructor(methodArguments: string[]) {
        // Gets first method argument and possibly first parameter.
        const argumentStart = methodArguments?.shift()?.split("(");
        const splitArgument = argumentStart !== undefined ? argumentStart[0].split(":") : [""];

        // Checks if enogh arguments ware given for method creation.
        if(splitArgument.length === 3) {
            super(splitArgument[1], splitArgument[2], splitArgument[0]);
        } else if(splitArgument.length === 2) {
            super(splitArgument[0], splitArgument[1]);
        } else {
            const errorFeedback = new Feedback();
            if(splitArgument[0] === "") {
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.method.error.empty_method_argument"));
            } else if(splitArgument.length === 1) {
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.method.error.invalid_method_arguments.part_1.too_few"));
                errorFeedback.addSnippet(new StringSnippet(splitArgument.toString().replaceAll(",", ":")))
            } else {
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.method.error.invalid_method_arguments.part_1.too_many"));
                errorFeedback.addSnippet(new StringSnippet(splitArgument.toString().replaceAll(",", ":")))
            }
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.method.error.invalid_method_arguments.part_2"));

            throw new AppError(errorFeedback)
        }

        // Sets parameters with present.
        this.parameters = [] as Parameter[];
        if((argumentStart !== undefined) && (argumentStart[1] !== "")) {
            const firstParameter = new Parameter(argumentStart[1].replace(")", "").replace(",", ""));
            this.isParameterNameInUse(firstParameter.getName());

            this.parameters.push(firstParameter)

            methodArguments.forEach((parameterArgument) => {
                const newParameter = new Parameter(parameterArgument.replace(")", "").replace(",", ""));
                this.isParameterNameInUse(newParameter.getName());

                this.parameters.push(newParameter);
            });
        }
    }

    /**
     * Changes method's data, expecting data to be organized with the respective order inside array,
     * visibility, name, type and parameters arguments.
     * 
     * @param alterations Array containing alterations in the previously stated order.
     */
    public alter(alterations: string[]): void {
        if((alterations[0] !== "-") && (alterations[0] !== "")) {
            this.setVisibility(alterations[0]);
        }

        if((alterations[1] !== "-") && (alterations[1] !== "")) {
            this.setName(alterations[1]);
        }

        if((alterations[2] !== "-") && (alterations[2] !== "")) {
            this.setType(alterations[2]);
        }

        const parameterAlterations = alterations.splice(3);
        parameterAlterations.forEach((parameterAlteration) => {
            const changeArguments = parameterAlteration.split(":");
            const alterationArgument = changeArguments.shift();
            
            if((alterationArgument === undefined) || (alterationArgument === "")) {
                const errorFeedback = new Feedback();
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.error.missing_alteration_argument.part_1"));
                errorFeedback.addSnippet(new StringSnippet(":" + changeArguments.toString().replaceAll(",", ":")));
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.error.missing_alteration_argument.part_2"));

                throw new AppError(errorFeedback);
            } else {
                switch(true) {
                    case alterationArgument === "add":
                        const newParameter = new Parameter(alterationArgument.toString().replaceAll(",", ":"));
                        this.isParameterNameInUse(newParameter.getName());
                        this.parameters.push(newParameter);
                        break;

                    case alterationArgument === "remove":
                        const removalIndex = this.getParameterIndexByName(changeArguments[0]);
                        this.parameters.splice(removalIndex, 1);
                        break;

                    case alterationArgument === "alter":
                        const alteringParameter = this.getParameterByName(changeArguments[0]);
                        this.isParameterNameInUse(changeArguments[2])
                        alteringParameter.alter(changeArguments.splice(1));
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