import LocalizationSnippet from "../Models/LocalizationSnippet";

export default function translate(i18nContent: string): string {
    return new LocalizationSnippet(i18nContent).toString()
}