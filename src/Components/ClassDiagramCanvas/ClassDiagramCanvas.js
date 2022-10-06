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
        classes.map((classData) => {
          <div key={ classData.id }>
            <h1>{ classData.entityName }</h1>
          </div>
        })
      }
    </div>
  );
}
