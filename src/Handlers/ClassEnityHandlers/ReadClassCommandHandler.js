import { ERROR_COMMAND_SYNTAX } from "../../Utils/Errors";
import { upperCaseFirstLetter } from "../UtilityHandlers/StringHandler";

export default function readClassCommandHandler(commandArray, classEntities) {
    const classEntity = classEntities.find((classEntity) => commandArray[2] === classEntity.entityName);

    if(!classEntity) {
        return "A classe " + upperCaseFirstLetter(commandArray[0].toLowerCase()) + " não existe no projeto!";
    }

    const feedback = [
        "A classe ",
        classEntity.entityName
    ];

    if(commandArray.length === 3) {
        feedback.push(" existe no projeto");
    }

   if(commandArray.includes("-a")) {
        if(classEntity.attributes.length === 0) {
            feedback.push(". Não possui attributos.");
        } else {
            if(classEntity.attributes.length > 1) {
                feedback.push(". Possui os attributos");
            } else {
                feedback.push(". Possui o attributo");
            }
    
            classEntity.attributes.forEach((attribute) => {
                feedback.push("; " + attribute.visibility);
                feedback.push(" " + attribute.name);
                feedback.push(" " + attribute.type);
            });
        }
    }

    if(commandArray.includes("-m")) {
        if(classEntity.methods.length === 0) {
            feedback.push(". Não possui métodos.");
        } else {
            if(classEntity.methods.length > 1) {
                feedback.push(". Possui os métodos");
            } else {
                feedback.push(". Possui o método");
            }
    
            classEntity.methods.forEach((method) => {
                feedback.push(". " + method.visibility);
                feedback.push(" " + method.name);
                feedback.push(" " + method.type);
    
                if(method.parameters.length === 0) {
                    feedback.push(" e não possui parametros");
                } else {
                    if(method.parameters.length > 1) {
                        feedback.push(" e possui os parametros");
                    } else {
                        feedback.push(" e possui o parametro");
                    }

                    method.parameters.forEach((parameter) => {
                        feedback.push("; " + parameter.name);
                        feedback.push(" " + parameter.type);
                    });
                }
            });
        }
    }
    

    if(feedback.length === 2) {
        throw ERROR_COMMAND_SYNTAX;
    }

    return feedback.toString().replaceAll(",", "") + ".";
}