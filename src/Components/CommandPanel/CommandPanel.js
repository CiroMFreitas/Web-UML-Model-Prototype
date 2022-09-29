import React, { useRef } from 'react';
import CommandLine from '../CommandLine/CommandLine';
import "./CommandPanel.css";
import { v4 as uuidv4 } from "uuid";

export default function CommandPanel({ commands, setCommands }) {
  const commandLineRef = useRef();

  // Handlers
  function commandLineHandler(event) {
    const commandLine = commandLineRef.current.value;

    if(event.keyCode === 13) {
      commandLineRef.current.value = null;
      
      setCommands(prevCommands => {
        return [...prevCommands,
          {
            id: uuidv4(),
            line: commandLine
          }]
      });
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
      
      <textarea id="CommandConsole" ref={ commandLineRef } onKeyUpCapture={ commandLineHandler } aria-label="Console de comandos" autoFocus></textarea>
    </div>
  );
}
