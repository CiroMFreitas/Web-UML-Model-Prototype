import React, { useContext } from 'react';
import CommandHandlerContext from '../../Contexts/CommandHandlerContext';
import "./ClassDiagramCanvas.css";

export default function ClassDiagramCanvas() {
  const { classes } = useContext(CommandHandlerContext);

  // Component
  return (
    <div id="ClassDiagramCanvas">
      <h1>TEST</h1>
      {
        classes.map((class) => {
          <div key={ class.id }>
            <h1>{ class.entityName }</h1>
          </div>
        })
      }
    </div>
  );
}
