import React, { KeyboardEvent, useContext, useRef, useState } from 'react';
//import { useTranslation } from 'react-i18next'

import CommandHandlerContext from '../../Contexts/CommandHandlerContext';

//import CommandLine from '../CommandLine/CommandLine';
import "./CommandPanel.css";

export default function CommandPanel() {
  
  const [feedback, setFeedback] = useState("");
  const [commandHistory, setCommandHistory] = useState([""]);
  const [commandHistoryPosition, setCommandHistoryPosition] = useState(0);

  const commandLineRef = useRef<HTMLInputElement>(null);
  //const { commandHandler } = useContext(CommandHandlerContext);
  //const { t } = useTranslation();

  /** Checkes each key was pressed in order to excute written comands or check command history
   * 
   * @param event KeyboardEvent
   */
  // Local Handlers
  function commandLineHandler(event: KeyboardEvent): void {
    if(commandLineRef.current !== null) {
      switch(true) {
        // Clears command line, added said command to history and sends command line to be handled by context
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
          }
        break;

        // Gets previous command on history
        case event.key === "ArrowUp" && commandHistoryPosition+1 < commandHistory.length:
          const upPosition = commandHistoryPosition+1;
          setCommandHistoryPosition(upPosition);
          commandLineRef.current.value = commandHistory[upPosition];
          break;

        // Gets next command on history
        case event.key === "ArrowDown" && commandHistoryPosition > 0:
          const downPosition = commandHistoryPosition-1;
          setCommandHistoryPosition(downPosition);
          commandLineRef.current.value = commandHistory[downPosition];
        break;

        default:
          break;
      }
    }
      /*const commandLine = commandLineRef.current.value;
      commandLineRef.current.value = null;

      if(commandLine.toLowerCase().trim() === "clear") {
        setCommands([]);
      } else if(commandLine.trim() !== "") {
        const command = {
          id: uuidv4(),
          line: commandLine + "."
        };

        setCommands(prevCommands => {
          let updatedCommands = [
            ...prevCommands,
            command
          ];

          try {
            const feedback = commandHandler(commandLine);
            
            updatedCommands.push({
              id: uuidv4(),
              line: feedback + "."
            });
          } catch(error) {
            console.log(error);
            
            updatedCommands.push({
              id: uuidv4(),
              line: error + "."
            });
          }

          return updatedCommands
        });
      }*/
  }

  // Component
  return (
    <div id="CommandPanel">
      <div id="CommandFeedback" aria-live="polite">
        {
          feedback
        }
      </div>
      
      <input id="CommandConsole" ref={ commandLineRef } onKeyUpCapture={ commandLineHandler } /*aria-label={ t("label.command_console") }*/ autoComplete="off" autoFocus />
    </div>
  );
}
