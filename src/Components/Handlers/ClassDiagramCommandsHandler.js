export default function classDiagramCommandsHandler(commandLine) {
    const command = commandLine.replace("\n", "").split(" ");
    let handledCommandLine;

    switch(command[0].toLowerCase()) {
        case "adcionar":
            handledCommandLine = ["Teste"];
            break;

        default:
            handledCommandLine = [
                "error",
                "Comando não reconhecido."
            ];
    }

    return handledCommandLine;
}