import React, { useContext } from 'react';
import CommandHandlerContext from '../../Contexts/CommandHandlerContext';
import ClassEntity from '../ClassEntity/ClassEntity';
import RelationshipEntity from '../RelationshipEnity/RelationshipEntity';
import "./ClassDiagramCanvas.css";

export default function ClassDiagramCanvas() {
  const { classEntities, relationshipEntities } = useContext(CommandHandlerContext);

  // Component
  return (
    <div id="ClassDiagramCanvas">
      {
        classEntities.map(classEntity => {
          return <ClassEntity key={ classEntity.id } classEntity={ classEntity } />
        })
      }

      {
        relationshipEntities.map(relationshipEntity => {
          return <RelationshipEntity key={ relationshipEntity.id } relationshipEntity={ relationshipEntity } />
        })
      }
    </div>
  );
}
