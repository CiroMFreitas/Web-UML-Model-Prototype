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
     * Stub.
     * 
     * @returns Stub.
     */
    public toText(): string {
        return "";
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