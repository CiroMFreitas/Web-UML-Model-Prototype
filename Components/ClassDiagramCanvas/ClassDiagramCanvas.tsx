import React, { useContext } from 'react';
import "./ClassDiagramCanvas.css";
import CommandHandlerContext from '../../Contexts/CommandHandlerContext';
import CanvasClassifier from '../CanvasClassifier/CanvasClassifier';
import CanvasRelationship from '../CanvasRelationship/CanvasRelationship';

export default function ClassDiagramCanvas() {
  const commandHandlerContext = useContext(CommandHandlerContext);
  const entityData = commandHandlerContext.getEntityData();

  // Component
  switch(entityData.entityType) {
    case "classifier":
      const classifierData = commandHandlerContext.getClassifierData(entityData.entityId);
      return (
        <CanvasClassifier classifierData={ classifierData } />
      );

    case "relationship":
      const relationshipData = commandHandlerContext.getRelationshipData(entityData.entityId);
      return (
        <CanvasRelationship relationshipData={ relationshipData } />
      );
    
    default:
      return (
        <div id="ClassDiagramCanvas">
        </div>
      );
  }
}
