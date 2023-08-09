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
            this.isMethodNameInUse(firstParameter.getName());

            this.parameters.push(firstParameter)

            methodArguments.forEach((parameterArgument) => {
                const newParameter = new Parameter(parameterArgument.replace(")", "").replace(",", ""));
                this.isMethodNameInUse(newParameter.getName());

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
            }
        });
    }

    /**
     * Checks if given name is already in use by a parameter, if true an error will be thrown.
     * 
     * @param parameterName Name to be checked.
     */
    private isMethodNameInUse(parameterName: string): void {
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