import React from 'react';

export default function ClassEntity(type, name, attributes, methods) {

  /*
  function renderAttribute() {
      if(attributes.length === 0) {
        return (
          <div className="emptyLine">-</div>
        );
      } else {
          return(
              attributes.map((attribute) => (
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
      if(methods.length === 0) {
        return (
          <div className="emptyLine">-</div>
        );
      } else {
        return (
          methods.map((method) => (
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
          <div className="entityType">{ type }</div>
          <div className="entityName">{ name }</div>
      </div>
      { console.log(type) }
      { console.log(name) }
      { console.log(attributes) }
      { console.log(methods) }
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