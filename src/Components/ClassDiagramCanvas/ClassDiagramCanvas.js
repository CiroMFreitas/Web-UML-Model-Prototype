import React, { useContext } from 'react';
import CommandHandlerContext from '../../Contexts/CommandHandlerContext';
import ClassEntity from '../ClassEntity/ClassEntity';
import "./ClassDiagramCanvas.css";

export default function ClassDiagramCanvas() {
  const { classEntities } = useContext(CommandHandlerContext);

  // Component
  return (
    <div id="ClassDiagramCanvas">
      {
        classEntities.map(classEntity => {
          return <ClassEntity key={ classEntity.id } type={ classEntity.entityType } name={ classEntity.entityName } attributes={ classEntity.attributes } methods={ classEntity.attributes } />
        })
      }
    </div>
  );
}
