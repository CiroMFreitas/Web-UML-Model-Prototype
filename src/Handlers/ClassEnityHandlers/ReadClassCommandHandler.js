import { ERROR_COMMAND_SYNTAX } from "../../Utils/Errors";
import { upperCaseFirstLetter } from "../UtilityHandlers/StringHandler";

export default function readClassCommandHandler(commandArray, classEntities) {
    const classname = upperCaseFirstLetter(commandArray[0].toLowerCase());
    const classEntity = classEntities.find((classEntity) => classname === classEntity.name);

    if(!classEntity) {
        return "A classe " + upperCaseFirstLetter(classname.toLowerCase()) + " não existe no projeto!";
    }

    const feedback = [
        "A classe ",
        classEntity.name
    ];

    if(commandArray.length === 1) {
        feedback.push(" existe no projeto");
    }

   if(commandArray.includes("-a")) {
        if(classEntity.attributes.length === 0) {
            feedback.push("; não possui attributos");
        } else {
            if(classEntity.attributes.length > 1) {
                feedback.push("; possui os attributos");
            } else {
                feedback.push("; possui o attributo");
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
            feedback.push("; não possui métodos.");
        } else {
            if(classEntity.methods.length > 1) {
                feedback.push("; possui os métodos");
            } else {
                feedback.push("; possui o método");
            }
    
            classEntity.methods.forEach((method) => {
                feedback.push("; " + method.visibility);
                feedback.push(" " + method.name);
                feedback.push(" " + method.type);
    
                if(method.parameters.length === 0) {
                    feedback.push(" e não possui parâmetros");
                } else {
                    if(method.parameters.length > 1) {
                        feedback.push("; que possui os parâmetro");
                    } else {
                        feedback.push("; que possui o parâmetro");
                    }

                    method.parameters.forEach((parameter) => {
                        feedback.push("; " + parameter.name);
                        feedback.push(" " + parameter.type);
                    });

                    feedback.push(", fim parâmetro");
                }
            });
        }
    }
    

    if(feedback.length === 2) {
        throw ERROR_COMMAND_SYNTAX;
    }

    return feedback.toString().replaceAll(",", "").replaceAll(";", ",");
}