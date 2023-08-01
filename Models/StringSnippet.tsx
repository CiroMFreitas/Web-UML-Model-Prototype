import IFeedbackSnippet from "../public/interfaces/IFeedbackSnippet";

/**
 * Snippet with content whom will not to be localized.
 */
export default class StringSnippet implements IFeedbackSnippet {
    private content: string;

    /**
     * Creates Snippet with given content.
     * 
     * @param content String to be stored.
     */
    constructor(content: string) {
        this.content = content;
    }

    /**
     * Returns content as string.
     * 
     * @returns Content's string.
     */
    public toString(): string {
        return this.content;
    }
}