/**
 * Stores feeadback and file to be exported.
 */
export default interface IExportDiagramDTO {
    feedback: string;
    fileContent: Blob;
    fileExtension: string;
}