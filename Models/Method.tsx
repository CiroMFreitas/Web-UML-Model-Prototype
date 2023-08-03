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
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.attribute.error.invalid_attribute_arguments.part_1"));
            errorFeedback.addSnippet(new StringSnippet(splitArgument.toString().replaceAll(",", ":")))
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.attribute.error.invalid_attribute_arguments.part_2"));

            throw new AppError(errorFeedback)
        }

        // Sets parameters with present.
        this.parameters = [] as Parameter[];
        if((argumentStart !== undefined) && (argumentStart[1] !== "")) {
            this.parameters.push(new Parameter(argumentStart[1].replace(")", "").replace(",", "")))

            methodArguments.forEach((parameterArgument) => {
                this.parameters.push(new Parameter(parameterArgument.replace(")", "").replace(",", "")));
            });
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