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
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.parameter.error.invalid_parameter_arguments.part_1"));
            errorFeedback.addSnippet(new StringSnippet(parameterArguments));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.parameter.error.invalid_parameter_arguments.part_2"));

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