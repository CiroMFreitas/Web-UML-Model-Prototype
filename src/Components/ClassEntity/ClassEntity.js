import React from 'react';

export default function ClassEntity({ classEntity } ) {

  /*
  function renderAttribute() {
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

  function renderMethod() {
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
                <div className="methodParameters">(
                  {
                    "(" + method.parameters.map((parameter, i, arr) => (
                      parameter.type + ": " +  parameter.name + (arr.length - 1 !== i ? ", " : ")")
                    ))
                  }
                </div>
              </div>
          ))
        );
      }
  }
  */

  return (
    <div className="classEntity">
      <div className="classTittle">
          <div className="entityType">{ classEntity.entityType }</div>
          <div className="entityName">{ classEntity.entityName }</div>
      </div>
      { console.log(classEntity) }
    </div>
  )
}

/*           
  <div className="EntityAttributes">
    <div className="attributesTittle">Atributos</div>=
    { renderAttribute() }
  </div>

  <div className="EntityMethods">
    <div className="methodsTittle">Métodos</div>
    { renderMethod() }
  </div>
*/