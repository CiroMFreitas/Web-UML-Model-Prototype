import React, { useContext } from 'react';
import CommandHandlerContext from '../../Contexts/CommandHandlerContext';
import "./ClassDiagramCanvas.css";

export default function ClassDiagramCanvas() {
  const { classes } = useContext(CommandHandlerContext);

  // Component
  return (
    <div id="ClassDiagramCanvas">
      {
        classes.map((classData) => (
          <div key={ classData.id }>
            <h1>{ classData.entityName }</h1>
            <h2>{ classData.entityType }</h2>
          </div>
        ))
      }
    </div>
  );
}
