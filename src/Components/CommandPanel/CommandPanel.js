import React, { useContext, useRef, useState } from 'react';
import CommandLine from '../CommandLine/CommandLine';
import "./CommandPanel.css";
import { v4 as uuidv4 } from "uuid";
import CommandHandlerContext from '../../Contexts/CommandHandlerContext';

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
            const feedback = commandHandler(commandLine.line);
            
            updatedCommands.push({
              id: uuidv4(),
              line: feedback
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
