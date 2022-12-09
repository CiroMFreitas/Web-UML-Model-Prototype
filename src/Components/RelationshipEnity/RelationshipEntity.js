import React from 'react';

export default function RelationshipEntity({ relationshipEntity } ) {

    return (
      <div className="classEntity">
        <div className="classTittle">
            <div className="entityType">{ relationshipEntity.relationshipType }</div>
            <div className="entityName">{ relationshipEntity.primaryClassName }</div>
            <div className="entityName">{ relationshipEntity.secondaryClassName }</div>
        </div>
        { console.log(relationshipEntity) }
      </div>
    )
}