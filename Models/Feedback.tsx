import IFeedbackSnippet from "../public/interfaces/IFeedbackSnippet";

/**
 * Used to return strings and translatable text to user.
 */
export default class Feedback {
    private feedbackSnippets: IFeedbackSnippet[];

    /**
     * Creates an empty feedback.
     */
    constructor() {
        this.feedbackSnippets = [] as IFeedbackSnippet[];
    }

    /**
     * Adds a snippet to the feedback.
     * 
     * @param snippet Snippet to be added.
     */
    public addSnippet(snippet: IFeedbackSnippet): void {
        this.feedbackSnippets.push(snippet);
    }

    /**
     * Turns all of feedfabck"s content as string.
     * 
     * @returns Feedback content.
     */
    public toString(): string {
        let feedback = "";

        this.feedbackSnippets.forEach((snippet) => {
            feedback += snippet.toString();
        });

        return feedback;
    }
}