import AppError from "../Models/AppError";
import Feedback from "../Models/Feedback";
import LocalizationSnippet from "../Models/LocalizationSnippet";
import StringSnippet from "../Models/StringSnippet";
import ICreateAttributeDTO from "../public/DTO/ICreateAttributeDTO";
import ICreateMethodDTO from "../public/DTO/ICreateMethodDTO";
import ICreateParameterDTO from "../public/DTO/ICreateParameterDTO";

/**
 * Hold static methods that useful to multiple command interpreters classes.
 */
export default abstract class CommandInterpreter {

    /**
     * Gets given argument's content from command line, removing said range, if no start is found an empty
     * array will be returned, if no end is found, an error will be thrown.
     * 
     * @param commandLine Comand line to be searched.
     * @param startArgument Start argument to be searched.
     * @returns Array argument content.
     */
    protected static getCommandArgumentContent(commandLine: string[], startArgument: string): string[] {
        // Checks if given argument is present.
        const startIndex = commandLine.findIndex((commandLine) => commandLine === startArgument)+1;
        if(startIndex === 0) {
            return [];
        }

        // Checks if end for an argument is present.
        const endIndex = commandLine.findIndex((commandLine) => commandLine.includes(";"))+1;
        if(endIndex === 0) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.no_end_given_for_argument.part_1"));
            errorFeedback.addSnippet(new StringSnippet(startArgument));
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.error.no_end_given_for_argument.part_2"));

            throw new AppError(errorFeedback);
        }

        // Gets argument while cleaning it.
        const argumentContents = commandLine.slice(startIndex, endIndex).map((content) => {
            return content.replace(",", "").replace(";", "")
        });
        commandLine.splice(startIndex, endIndex-startIndex);

        return argumentContents;
    }

    /**
     * Handles attribute argument into a create attribute DTO.
     * 
     * @param argument Attribute argument to be handled.
     * @returns The handled argument into a DTO.
     */
    protected static handleCreateAttributeArgument(argument: string): ICreateAttributeDTO {
        const splitArgument = argument.split(":");
        if(splitArgument.length === 3) {
            return {
                visibility: splitArgument[0],
                name: splitArgument[1],
                type: splitArgument[2]
            };
        } else if(splitArgument.length === 2) {
            return {
                name: splitArgument[0],
                type: splitArgument[1]
            };
        } else if(splitArgument.length < 2) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.attribute.error.invalid_attribute_arguments.part_1.too_few"));
            errorFeedback.addSnippet(new StringSnippet(splitArgument.toString().replaceAll(",", ":")))
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.attribute.error.invalid_attribute_arguments.part_2"));

            throw new AppError(errorFeedback);
        } else {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.attribute.error.invalid_attribute_arguments.part_1.too_many"));
            errorFeedback.addSnippet(new StringSnippet(splitArgument.toString().replaceAll(",", ":")))
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.attribute.error.invalid_attribute_arguments.part_2"));

            throw new AppError(errorFeedback);
        }
    }

    /**
     * Handles arguments for methods creation.
     * 
     * @param methodArguments Arguments to be handled.
     * @returns Handled arguments.
     */
    protected static handleMethodArguments(methodArguments: string[]): string[][] {
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
     * Handles methods arguments into create method DTO.
     * 
     * @param methodArguments Handled argument to be further handled into a DTO.
     * @returns Method creation instructions.
     */
    protected static handleCreateMethodArgument(methodArguments: string[]): ICreateMethodDTO {
        // Gets first method argument and possibly first parameter.
        const argumentStart = methodArguments?.shift()?.split("(");

        // Sets parameters with present.
        const parameters = [] as ICreateParameterDTO[];
        if((argumentStart !== undefined) && (argumentStart[1] !== "")) {
            const firstParameter = this.handleCreateParameterArgument(argumentStart[1].replace(")", "").replace(",", ""));
            parameters.push(firstParameter)

            methodArguments.forEach((parameterArgument) => {
                const newParameter = this.handleCreateParameterArgument(parameterArgument.replace(")", "").replace(",", ""));

                parameters.push(newParameter);
            });
        }

        // Checks if enogh arguments ware given for method creation.
        const splitArgument = argumentStart !== undefined ? argumentStart[0].split(":") : [""];
        if(splitArgument.length === 3) {
            return {
                visibility: splitArgument[0],
                name: splitArgument[1],
                type: splitArgument[2],
                parameters: parameters
            };
        } else if(splitArgument.length === 2) {
            return {
                name: splitArgument[0],
                type: splitArgument[1],
                parameters: parameters
            };
        } else {
            const errorFeedback = new Feedback();
            if(splitArgument[0] === "") {
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.method.error.empty_method_argument"));
            } else if(splitArgument.length < 2) {
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.method.error.invalid_method_arguments.part_1.too_few"));
                errorFeedback.addSnippet(new StringSnippet(splitArgument.toString().replaceAll(",", ":")))
            } else {
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.method.error.invalid_method_arguments.part_1.too_many"));
                errorFeedback.addSnippet(new StringSnippet(splitArgument.toString().replaceAll(",", ":")))
            }
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.method.error.invalid_method_arguments.part_2"));

            throw new AppError(errorFeedback)
        }
    }

    /**
     * Handles parameter argument in the following format 'name:type' into a DTO.
     * 
     * @param argument Argument to be handled.
     * @returns DTO containning instructions for parameter creation.
     */
    protected static handleCreateParameterArgument(argument: string): ICreateParameterDTO {
        const splitArgument = argument.split(":");
        const errorFeedback = new Feedback();
        if(splitArgument.length > 2) {
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.parameter.error.invalid_method_arguments.part_1.too_many"));
            errorFeedback.addSnippet(new StringSnippet(splitArgument.toString().replaceAll(",", ":")))
        } else if(splitArgument.length < 2) {
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.parameter.error.invalid_method_arguments.part_1.too_few"));
            errorFeedback.addSnippet(new StringSnippet(splitArgument.toString().replaceAll(",", ":")))
        } else {
            return {
                name: argument[0],
                type: argument[1]
            };
        }
        errorFeedback.addSnippet(new LocalizationSnippet("feedback.create.parameter.error.invalid_method_arguments.part_2"));

        throw new AppError(errorFeedback)
    }
}