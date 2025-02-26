import React, { useContext } from 'react';

import "./ClassDiagramCanvas.css";
import CommandHandlerContext from '../../Contexts/CommandHandlerContext';

export default function ClassDiagramCanvas() {
  const commandHandlerContext = useContext(CommandHandlerContext);
  const toRenderEntityData = commandHandlerContext.getToRenderEntityData();

  // Component
  switch(toRenderEntityData.entityType) {
    case "classifier":
      const classifierData = commandHandlerContext.getToRenderClassifier(toRenderEntityData.entityId);
      console.log(classifierData)
      return (
        <div id="ClassDiagramCanvas">
          Classifier
        </div>
      )

    default:
      return (
        <div id="ClassDiagramCanvas">
        </div>
      );
  }
}
