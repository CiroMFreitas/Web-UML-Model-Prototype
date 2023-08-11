import AppError from "../Models/AppError";
import Feedback from "../Models/Feedback";
import LocalizationSnippet from "../Models/LocalizationSnippet";
import StringSnippet from "../Models/StringSnippet";

/**
 * Hold static methods that useful to multiple command interpreters classes.
 */
export default abstract class CommandInterpreter {

    /**
     * Gets given argument's content from command line, removing said range, if no start is found, undefined
     * will be returned, if no end is found, an error will be thrown.
     * 
     * @param commandLine Comand line to be searched.
     * @param startArgument Start argument to be searched.
     * @returns Array argument content or undefined.
     */
    protected static getCommandArgumentContent(commandLine: string[], startArgument: string): string[] | undefined {
        // Checks if given argument is present.
        const startIndex = commandLine.findIndex((commandLine) => commandLine === startArgument)+1;
        if(startIndex === 0) {
            return undefined;
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
}