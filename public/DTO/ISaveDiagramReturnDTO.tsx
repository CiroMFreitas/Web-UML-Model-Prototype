/**
 * Stores feeadback and json file to be downloaded.
 */
export default interface ISaveDiagramReturnDTO {
    saveFeedback: string;
    diagramJSONFile: Blob;
}