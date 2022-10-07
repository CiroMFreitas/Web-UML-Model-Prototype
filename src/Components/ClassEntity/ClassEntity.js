import React, { useContext } from 'react';
import CommandHandlerContext from '../../Contexts/CommandHandlerContext';

export default function ClassEntity() {
    const { classEntities } = useContext(CommandHandlerContext);

    function renderAttribute(classEntity) {
        if(classEntity.attributes.length === 0) {
          return (
            <div className="emptyLine">-</div>
          );
        } else {
            return(
                classEntity.attributes.map((attribute) => (
                    <div className="attributeLine">
                      <div className="attributeVisibility">{ attribute.visibility }</div>
                      <div className="attributeType">{ attribute.type }</div>
                      <div className="attributeName">{ attribute.name }</div>
                    </div>
                ))
            );
        }
    }

    function renderMethod(classEntity) {
        if(classEntity.methods.length === 0) {
          return (
            <div className="emptyLine">-</div>
          );
        } else {
          return (
            classEntity.methods.map((method) => (
                <div className="methodLine">
                  <div className="methodVisibility">{ method.visibility }</div>
                  <div className="methodType">{ method.type }</div>
                  <div className="methodName">{ method.name }</div>
                </div>
            ))
          );
        }
    }
    
    return (
        <>
        {
            classEntities.map((classEntity) => (
                <div className="classEntity" key={ classEntity.id }>
                    <div className="classTittle">
                        <div className="entityType">{ classEntity.entityType }</div>
                        <div className="entityName">{ classEntity.entityName }</div>
                    </div>
                    
                    <div className="EntityAttributes">
                      <div className="attributesTittle">Atributos</div>
                      { renderAttribute(classEntity) }
                    </div>

                        <div className="EntityMethods">
                          <div className="methodsTittle">Métodos</div>
                          { renderMethod(classEntity) }
                        </div>
                    </div>
                ))
            }
        </>
    )
}