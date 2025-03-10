import React, { useContext } from 'react';
import "./ClassDiagramCanvas.css";
import CommandHandlerContext from '../../Contexts/CommandHandlerContext';
import LocalizationSnippet from '../../Models/LocalizationSnippet';

export default function ClassDiagramCanvas() {
  const commandHandlerContext = useContext(CommandHandlerContext);
  const toRenderEntityData = commandHandlerContext.getToRenderEntityData();

  function translate(i18nContent: string): string {
    return new LocalizationSnippet(i18nContent).toString()
  }

  // Component
  switch(toRenderEntityData.entityType) {
    case "classifier":
      const classifierData = commandHandlerContext.getToRenderClassifier(toRenderEntityData.entityId);
      console.log(classifierData)
      return (
        <div id="ClassDiagramCanvas">
          {/* Classifier type and name */}
          <div>
            { translate("ASCIIDiagram.classifier." + classifierData.classifierType) + " " + classifierData.name }
          </div>

          {/* Atributes */}
          <div>
            <div>
              { translate("ASCIIDiagram.attribute.title") }
            </div>
            
            <div>
              {
                classifierData.attributes.map((attribute) => {
                  return (
                    <div key={attribute.name}>
                      { 
                        attribute.visibility + " " +
                        attribute.name + ": " +
                        attribute.type
                      }
                    </div>
                  )
                })
              }
            </div>
          </div>

          {/* Methods */}
          <div>
            <div>
              { translate("ASCIIDiagram.method.title") }
            </div>

            <div>
              {
                classifierData.methods.map((method) => {
                  return (
                    <div key={method.name}>
                      {
                        method.visibility + " " +
                        method.name + "(" +
                        method.parameters.map((parameter) => {
                          return parameter.name + ": " + parameter.type
                        }).toString().replaceAll(",", ", ") + "): " +
                        method.type
                      }
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      )

    default:
      return (
        <div id="ClassDiagramCanvas">
        </div>
      );
  }
}
