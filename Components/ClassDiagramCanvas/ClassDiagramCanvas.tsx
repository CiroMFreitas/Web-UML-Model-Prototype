import React, { useContext } from 'react';
import "./ClassDiagramCanvas.css";
import CommandHandlerContext from '../../Contexts/CommandHandlerContext';
import CanvasClassifier from '../CanvasClassifier/CanvasClassifier';

export default function ClassDiagramCanvas() {
  const commandHandlerContext = useContext(CommandHandlerContext);
  const toRenderEntityData = commandHandlerContext.getToRenderEntityData();

  // Component
  switch(toRenderEntityData.entityType) {
    case "classifier":
      const classifierData = commandHandlerContext.getToRenderClassifier(toRenderEntityData.entityId);
      return (
        <CanvasClassifier classifierData={ classifierData } />
      );

    default:
      return (
        <div id="ClassDiagramCanvas">
        </div>
      );
  }
}
