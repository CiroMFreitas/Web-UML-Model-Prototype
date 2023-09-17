import React, { KeyboardEvent, useContext, useRef, useState } from 'react';
import { translate } from '../../i18n'

import CommandHandlerContext from '../../Contexts/CommandHandlerContext';

import "./CommandPanel.css";
import { SUPPORTED_COMMANDS } from '../../public/Utils/SupportedKeyWords';

export default function CommandPanel() {
  
    const [feedback, setFeedback] = useState("");
    const [commandHistory, setCommandHistory] = useState([""]);
    const [commandHistoryPosition, setCommandHistoryPosition] = useState(0);

    const commandLineRef = useRef<HTMLInputElement>(null);
    const importRef = useRef<HTMLInputElement>(null);
    const commandHandler = useContext(CommandHandlerContext);

    /** Checks which key was pressed in order to excute written comands or check command history
     * 
     * @param event Event which triggered funciton.
     */
    function commandLineHandler(event: KeyboardEvent): void {
        if(commandLineRef.current !== null) {
            switch(true) {
                // Clears command line, addd command to history and sends it to be handled by context
                case event.key === "Enter":
                    const commandLine = commandLineRef.current ? commandLineRef.current.value : "";
                    if(commandLine !== "") {
                        commandHistory.splice(1, 0, commandLine);
                        if(commandHistory.length > 11) {
                          commandHistory.pop();
                        }
                        setCommandHistory(commandHistory);
                        setCommandHistoryPosition(0);
                        commandLineRef.current.value = commandHistory[0];

                        // Breaks command line into an array.
                        const commandLineArray = commandLine.replace("\n", "").replaceAll(",", "").split(" ");
                        if(commandLineArray[0] === SUPPORTED_COMMANDS.import) {
                            importRef.current?.click();
                        } else if(commandLineArray[0] === SUPPORTED_COMMANDS.save) {
                            const saveDiagramReturn = commandHandler.saveDiagram();

                            //Convert JSON string to BLOB.
                            //json = [json];
                            const url = URL.createObjectURL(saveDiagramReturn.diagramJSONFile)
                            const downloadJSONFile = document.createElement('a')
                          
                            downloadJSONFile.href = url
                            downloadJSONFile.download = "diagram.json"
                            downloadJSONFile.click()
                            URL.revokeObjectURL(url)

                            setFeedback(saveDiagramReturn.saveFeedback)
                        } else {
                            setFeedback(commandHandler.getFeedBack(commandLineArray));
                        }
                    }
                    break;

                // Gets previous command in history
                case event.key === "ArrowUp" && commandHistoryPosition+1 < commandHistory.length:
                    const upPosition = commandHistoryPosition+1;
                    setCommandHistoryPosition(upPosition);
                    commandLineRef.current.value = commandHistory[upPosition];
                    break;

                // Gets next command in history
                case event.key === "ArrowDown" && commandHistoryPosition > 0:
                    const downPosition = commandHistoryPosition-1;
                    setCommandHistoryPosition(downPosition);
                    commandLineRef.current.value = commandHistory[downPosition];
                    break;

                default:
                    break;
            }
        }
    }

    /**
     * Sends xml content of a file to be handled by contex and sets feedback after import handling.
     */
    function importHandler(): void {
        const files = importRef.current?.files;
        if((files !== null) && (files !== undefined)) {
            files[0].text().then((xmlContent) => {
                const commandLineArray = ["import", xmlContent]
                setFeedback(commandHandler.getFeedBack(commandLineArray));
            });
        }
    }

    // Component
    return (
        <div id="CommandPanel">
            <div id="CommandFeedback" aria-live="polite">
                {
                  feedback
                }
            </div>
      
            <input id="CommandConsole" ref={ commandLineRef } onKeyUpCapture={ commandLineHandler } aria-label={ translate("label.command_console") } autoComplete="off" autoFocus />

            <input id="UploadXML" ref={ importRef } type="file" onChange={ () => importHandler() } accept="text/xml" aria-hidden="true" hidden />
        </div>
    );
}
