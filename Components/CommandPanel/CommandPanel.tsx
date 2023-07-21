import React, { useContext, useRef, useState } from 'react';
//import { useTranslation } from 'react-i18next'

import CommandHandlerContext from '../../Contexts/CommandHandlerContext';

//import CommandLine from '../CommandLine/CommandLine';
import "./CommandPanel.css";

export default function CommandPanel() {
  const commandLineRef = useRef();
  const [commands, setCommands] = useState([]);
  const { commandHandler } = useContext(CommandHandlerContext);
  //const { t } = useTranslation();

  // Local Handlers
  function commandLineHandler(/*event*/) {
    /*if(event.keyCode === 13) {
      const commandLine = commandLineRef.current.value;
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
      }
    }*/
  }

  // Component
  return (
    <div id="CommandPanel">
      <div id="CommandHistory" aria-live="polite">
        {/*
          commands.map(command => {
            return <CommandLine key={ command.id } command={ command.line } />
          })
        */}
      </div>
      
      <input id="CommandConsole" /*ref={ commandLineRef }*/ onKeyUpCapture={ commandLineHandler } /*aria-label={ t("label.command_console") }*/ autoFocus></input>
    </div>
  );
}
