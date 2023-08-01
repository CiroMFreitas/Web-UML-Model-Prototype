import IFeedbackSnippet from "../public/interfaces/IFeedbackSnippet";
import { translate } from '../i18n'

/**
 * Snipet with a string that will be localized by i18next.
 */
export default class LocalizationSnippet implements IFeedbackSnippet {
    private content: string

    /**
     * Creates Snippet with given content.
     * 
     * @param content String using i18next structure, example 'localization.content'.
     */
    constructor(content: string) {
        this.content = content;
    }

    /**
     * Returns localized contet.
     * 
     * @returns Content as localized string, with no localization was found, it will return conntent as is.
     */
    public toString(): string {
        return translate(this.content);
    }
}