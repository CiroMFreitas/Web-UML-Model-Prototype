import React, { useContext } from 'react';
import "./ClassDiagramCanvas.css";
import CommandHandlerContext from '../../Contexts/CommandHandlerContext';
import CanvasClassifier from '../CanvasClassifier/CanvasClassifier';
import CanvasRelationship from '../CanvasRelationship/CanvasRelationship';
import translate from '../../Controller/Translate';
import CanvasDiagramClassifiers from '../CanvasDiagramClassifiers/CanvasDiagramClassifiers';
import CanvasDiagramRelationships from '../CanvasDiagramRelationships/CanvasDiagramRelationships';

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
      const diagramData = commandHandlerContext.getDiagramData();
      return (
        <div id="ClassDiagramCanvas">
          <div>
            {
              diagramData.classifiers.length < 1 ?
              translate("ASCIIDiagram.diagram.no_classifiers") :
              <CanvasDiagramClassifiers classifiersData={ diagramData.classifiers } />
            }
            
          </div>

          -----------

          <div>
            { 
              diagramData.relationships.length < 1 ?
              translate("ASCIIDiagram.diagram.no_relationships") : 
              <CanvasDiagramRelationships relationshipsData={ diagramData.relationships } />
            }
          </div>
        </div>
      );
  }
}
