import React, { useContext } from 'react';
import HandledCommandsContext from '../../Contexts/HandledCommandContext';
import "./ClassDiagramCanvas.css";

export default function ClassDiagramCanvas() {
  const { handledCommands } = useContext(HandledCommandsContext);

  // Component
  return (
    <div id="ClassDiagramCanvas">
      { console.log(handledCommands) }
      <h1>{ handledCommands.entityName }</h1>
    </div>
  );
}
/*
      { handledCommands.map((handledCommand) => (
        <div>
          <h2>{ handledCommand.entityName }</h2>
        </div>
      ))}
*/