import { useTranslation } from 'react-i18next';

import { upperCaseFirstLetter } from "../UtilityHandlers/StringHandler";

export default function ReadClassCommandHandler(commandArray, classEntities) {
    const classname = upperCaseFirstLetter(commandArray[0].toLowerCase());
    const classEntity = classEntities.find((classEntity) => classname === classEntity.name);
    const { t } = useTranslation();

    if(!classEntity) {
        return t("command.read.class.not_found.part1") + upperCaseFirstLetter(classname.toLowerCase()) + t("command.read.class.not_found.part2");
    }

    const feedback = [
        t("command.read.class.feedback.start"),
        classEntity.name
    ];

    if(commandArray.length === 1) {
        feedback.push(t("command.read.class.feedback.exists"));
    }

   if(commandArray.includes("-a")) {
        if(classEntity.attributes.length === 0) {
            feedback.push(t("command.read.class.feedback.attribute.none"));
        } else {
            if(classEntity.attributes.length > 1) {
                feedback.push(t("command.read.class.feedback.attribute.plural"));
            } else {
                feedback.push(t("command.read.class.feedback.attribute.singular"));
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
            feedback.push(t("command.read.class.feedback.method.none"));
        } else {
            if(classEntity.methods.length > 1) {
                feedback.push(t("command.read.class.feedback.method.plural"));
            } else {
                feedback.push(t("command.read.class.feedback.method.singular"));
            }
    
            classEntity.methods.forEach((method) => {
                feedback.push("; " + method.visibility);
                feedback.push(" " + method.name);
                feedback.push(" " + method.type);
    
                if(method.parameters.length === 0) {
                    feedback.push(t("command.read.class.feedback.parameter.none"));
                } else {
                    if(method.parameters.length > 1) {
                        feedback.push(t("command.read.class.feedback.parameter.plural"));
                    } else {
                        feedback.push(t("command.read.class.feedback.parameter.singular"));
                    }

                    method.parameters.forEach((parameter) => {
                        feedback.push("; " + parameter.name);
                        feedback.push(" " + parameter.type);
                    });

                    if(method.parameters.length > 1) {
                        feedback.push(t("command.read.class.feedback.parameter.last"));
                    }
                }
            });
        }
    }
    

    if(feedback.length === 2) {
        throw t("error.command_syntax");
    }

    return feedback.toString().replaceAll(",", "").replaceAll(";", ",");
}