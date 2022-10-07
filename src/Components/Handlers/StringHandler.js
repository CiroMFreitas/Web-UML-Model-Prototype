export default function upperCaseFirstLetter(upperCaseString) {
    const firstLetter = upperCaseString.charAt(0).toUpperCase();

    return firstLetter + upperCaseString.substring(1)
}