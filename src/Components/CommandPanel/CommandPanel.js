import React, { useContext, useRef, useState } from 'react';
import CommandLine from '../CommandLine/CommandLine';
import "./CommandPanel.css";
import { v4 as uuidv4 } from "uuid";
import classDiagramCommandsHandler from '../Handlers/AppHandlers/ClassDiagramCommandsHandler';
import CommandHandlerContext from '../../Contexts/CommandHandlerContext';
import feedbackHandler from '../Handlers/AppHandlers/FeedbackHandler';

export default function CommandPanel() {
  const commandLineRef = useRef();
  const [commands, setCommands] = useState([]);
  const { commandHandler } = useContext(CommandHandlerContext);

  // Local Handlers
  function commandLineHandler(event) {
    if(event.keyCode === 13) {
      const commandLine = {
        id: uuidv4(),
        line: commandLineRef.current.value
      };
      commandLineRef.current.value = null;

      if(commandLine.line.toLowerCase().trim() === "clear") {
        setCommands([]);
      } else if(commandLine.line.trim() !== "") {
        setCommands(prevCommands => {
          let updatedCommands = [
            ...prevCommands,
            commandLine
          ];

          try {
            const handledCommand = commandHandler(classDiagramCommandsHandler(commandLine.line));

            const handledFeedback = feedbackHandler(handledCommand);
            
            updatedCommands.push({
              id: uuidv4(),
              line: handledFeedback
            });
          } catch(error) {
            console.log(error);
            
            updatedCommands.push({
              id: uuidv4(),
              line: error
            });
          }

          return updatedCommands
        });
      }
    }
  }

  // Component
  return (
    <div id="CommandPanel">
      <div id="CommandHistory" aria-live="polite" disabled>
        {
          commands.map(command => {
            return <CommandLine key={ command.id } command={ command.line } />
          })
        }
      </div>
      
      <input id="CommandConsole" ref={ commandLineRef } onKeyUpCapture={ commandLineHandler } aria-label="Console de comandos" autoFocus></input>
    </div>
  );
}
