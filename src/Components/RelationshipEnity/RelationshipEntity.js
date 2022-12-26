import React from 'react';

export default function RelationshipEntity({ relationshipEntity } ) {

    return (
      <div className="classEntity">
        <div className="classTittle">
            <div className="entityType">{ relationshipEntity.relationshipType }</div>
            <div className="name">{ relationshipEntity.primaryClassName }</div>
            <div className="name">{ relationshipEntity.secondaryClassName }</div>
        </div>
        { console.log(relationshipEntity) }
      </div>
    )
}