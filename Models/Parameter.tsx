import AppError from "./AppError";
import Feedback from "./Feedback";
import LocalizationSnippet from "./LocalizationSnippet";
import StringSnippet from "./StringSnippet";
import TypedEntity from "./TypedEntity";

/**
 * Parameter of an method.
 */
export default class Parameter extends TypedEntity {
    
    /**
     * Creates Parameter.
     */
    constructor(parameterArguments: string) {
        const splitArgument = parameterArguments.split(":");
        if(splitArgument.length === 2) {
            super(splitArgument[0], splitArgument[1]);
        } else {
            const errorFeedback = new Feedback();
            if(splitArgument[0] === "") {
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.parameter.error.empty_parameter_argument"));
            } else if(splitArgument.length === 1) {
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.parameter.error.invalid_parameter_arguments.part_1.too_few"));
                errorFeedback.addSnippet(new StringSnippet(splitArgument.toString().replaceAll(",", ":")))
            } else {
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.parameter.error.invalid_parameter_arguments.part_1.too_many"));
                errorFeedback.addSnippet(new StringSnippet(splitArgument.toString().replaceAll(",", ":")))
            }
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.parameter.error.invalid_parameter_arguments.part_2"));

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