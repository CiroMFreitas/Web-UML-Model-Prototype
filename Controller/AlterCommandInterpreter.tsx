import AppError from "../Models/AppError";
import Feedback from "../Models/Feedback";
import LocalizationSnippet from "../Models/LocalizationSnippet";
import StringSnippet from "../Models/StringSnippet";
import IAlterAssociativeAttributeDTO from "../public/DTO/IAlterAssociativeAttributeDTO";
import IAlterAttributeDTO from "../public/DTO/IAlterAttributeDTO";
import IAlterClassifierDTO from "../public/DTO/IAlterClassifierDTO";
import IAlterMethodDTO from "../public/DTO/IAlterMethodDTO";
import IAlterParameterDTO from "../public/DTO/IAlterParamenterDTO";
import IAlterRelationshipDTO from "../public/DTO/IAlterRelationshipDTO";
import IAttributeChangesDTO from "../public/DTO/IAttributeChangesDTO";
import ICreateAttributeDTO from "../public/DTO/ICreateAttributeDTO";
import ICreateMethodDTO from "../public/DTO/ICreateMethodDTO";
import ICreateParameterDTO from "../public/DTO/ICreateParameterDTO";
import IMethodChangesDTO from "../public/DTO/IMethodChangesDTO";
import IParameterChangesDTO from "../public/DTO/IParameterChangesDTO";
import IRemoveAttributeDTO from "../public/DTO/IRemoveAttributeDTO";
import IRemoveMethodDTO from "../public/DTO/IRemoveMethodDTO";
import IRemoveParameterDTO from "../public/DTO/IRemoveParamenterDTO";
import CommandInterpreter from "./CommandInterpreter";

/**
 * Class responsible for handling user's alter commands into DTOs.
 */
export default class AlterCommandInterpreter extends CommandInterpreter {
    /**
     * Interprets a alter classifier command into a DTO.
     * 
     * @param commandLine Command to be interpreted.
     * @returns Handled coomand line.
     */
    public static interpretAlterClassifier(commandLine: string[]): IAlterClassifierDTO {
        const name = commandLine.shift();

        // Checks if classifier name is present.
        if((name === undefined) || (name === "")) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.classifier.error.entity_type_missing_on_alteration"));

            throw new AppError(errorFeedback);
        } else {
            // Checks for classifier's name and type change.
            const newClassifierName = this.getCommandArgumentContent(commandLine, "-n");
            const newClassifierType = this.getCommandArgumentContent(commandLine, "-t");

            // Checks and changes classifier's attributes if desired.
            const attributesChangeArgument = this.getCommandArgumentContent(commandLine, "-a");
            let attributeAlterations = {} as IAttributeChangesDTO;
            if(attributesChangeArgument !== undefined) {
                attributeAlterations = this.handleAttributeChanges(attributesChangeArgument);
            }

            // Checks and changes classifier's attributes if desired.
            const methodsChangeArgument = this.getCommandArgumentContent(commandLine, "-m");
            let methodAlterations = {} as IMethodChangesDTO;
            if(attributesChangeArgument !== undefined) {
                methodAlterations = this.handleMethodChanges(methodsChangeArgument);
            }

            return {
                name: name,
                newClassifierName: newClassifierName.length !== 0 ? newClassifierName[0] : undefined,
                newClassifierType: newClassifierType.length !== 0 ? newClassifierType[0] : undefined,
                attributeAlterations: attributeAlterations,
                methodAlterations: methodAlterations
            };
        }
    }

    /**
     * Interprets a command line into a DTO.
     * 
     * @param commandLine Command to be interpreted.
     * @returns Handled coomand line to be executed.
     */
    public static interpretAlterRelationship(commandLine: string[]): IAlterRelationshipDTO {
        const relationshipName = commandLine.shift();
        if((relationshipName === undefined) || (relationshipName === "")) {
            const errorFeedback = new Feedback();
            errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.relationship.error.missing_relationship_name"));

            throw new AppError(errorFeedback);
        } else {
            const newName = this.getCommandArgumentContent(commandLine, "-n");
            const newSourceClassifierName = this.getCommandArgumentContent(commandLine, "-sc");
            const newTargetClassifierName = this.getCommandArgumentContent(commandLine, "-tc");

            const attributeArgument = this.getCommandArgumentContent(commandLine, "-a");
            const multiplicityArgument = this.getCommandArgumentContent(commandLine, "-m");
            const attributeAlterInstructions = this.handlAssociativeAttributeChanges(attributeArgument[0], multiplicityArgument[0]);
    
            return {
                relationshipName: relationshipName,
                newName: newName !== undefined ? newName[0] : undefined,
                newSourceClassifierName: newSourceClassifierName !== undefined ? newSourceClassifierName[0] : undefined,
                newTargetClassifierName: newTargetClassifierName !== undefined ? newTargetClassifierName[0] : undefined,
                attributeAlterInstructions: attributeAlterInstructions
            }
        }
    }

    /**
     * Handles attribute arguments into DTOs.
     * 
     * @param attributeArguments An array of arguments to be handled. 
     * @returns Handled arguments, some may be empty if no instruction of said type were given.
     */
    private static handleAttributeChanges(attributeArguments: string[]): IAttributeChangesDTO {
        const create = [] as ICreateAttributeDTO[];
        const remove = [] as IRemoveAttributeDTO[];
        const alter = [] as IAlterAttributeDTO[];

        attributeArguments.forEach((attributeArgument) => {
            const splitArgument = attributeArgument.split(":");
            const errorFeedback = new Feedback();

            switch(splitArgument.shift()) {
                case "add":
                    create.push(this.handleCreateAttributeArgument(splitArgument.toString().replace(",", ":")));
                    break;

                case "remove":
                    // Remove attribute from a classifier have 2 arguments.
                    if(splitArgument.length === 2) {
                        remove.push({
                            attributeName: splitArgument[1]
                        });
                    // Remove attribute from a relationship have 1 arguments.
                    } else if(splitArgument.length === 1) {
                        remove.push({
                            attributeName: ""
                        });
                    } else {
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_remove_attribute_arguments.part_1"));
                        errorFeedback.addSnippet(new StringSnippet(attributeArgument))
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_remove_attribute_arguments.part_2"));
                    }
                    break;

                case "alter":
                    // Alter attribute from a classifier have 5 arguments.
                    if(splitArgument.length === 5) {
                        alter.push({
                            attributeName: splitArgument[1],
                            newVisibility: splitArgument[2],
                            newName: splitArgument[3],
                            newType: splitArgument[4],
                        });
                    // Alter attribute from a relationship have 4 arguments.
                    } else if(splitArgument.length === 4) {
                        alter.push({
                            attributeName: "",
                            newVisibility: splitArgument[1],
                            newName: splitArgument[2],
                            newType: splitArgument[3],
                        });
                    } else if(splitArgument.length < 4) {
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_alter_attribute_arguments.part_1.too_few"));
                        errorFeedback.addSnippet(new StringSnippet(attributeArgument))
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_alter_attribute_arguments.part_2"));
                    } else {
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_alter_attribute_arguments.part_1.too_few"));
                        errorFeedback.addSnippet(new StringSnippet(attributeArgument))
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_alter_attribute_arguments.part_2"));
                    }
                    break;

                case "":
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.missing_alteration_argument.part_1"));
                    errorFeedback.addSnippet(new StringSnippet(attributeArgument));
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.missing_alteration_argument.part_2"));

                    throw new AppError(errorFeedback);

                default:
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_alteration_argument.part_1"));
                    errorFeedback.addSnippet(new StringSnippet(splitArgument[0]));
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_alteration_argument.part_2"));
                    errorFeedback.addSnippet(new StringSnippet(attributeArgument));
                    errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.attribute.error.invalid_alteration_argument.part_3"));

                    throw new AppError(errorFeedback);
            }
        });

        return {
            create: create,
            remove: remove,
            alter: alter
        };
    }

    private static handlAssociativeAttributeChanges(attributeArgument: string, multiplicityArgument?: string): IAlterAssociativeAttributeDTO {
        const splitArgument = attributeArgument.split(":");

        return {
            alterationCommand: splitArgument[0],
            newVisibility: splitArgument[1] !== undefined ? splitArgument[1] : "-",
            newName: splitArgument[2] !== undefined ? splitArgument[2] : "-",
            newType: "-",
            newMultiplicity: multiplicityArgument
        };
    }

    /**
     * Handles method arguments into DTOs.
     * 
     * @param methodArguments An array of arguments to be handled. 
     * @returns Handled arguments, some may be empty if no instruction of said type were given.
     */
    private static handleMethodChanges(methodArguments: string[]): IMethodChangesDTO {
        const createMethods = [] as ICreateMethodDTO[];
        const removeMethods = [] as IRemoveMethodDTO[];
        const alterMethods = [] as IAlterMethodDTO[];

        const handledmethodsChanges = this.handleMethodArguments(methodArguments);
        handledmethodsChanges.forEach((change) => {
            const methodChangeArguments = change[0].split(":");
            const paramenterChangeArguments = change.splice(1);
            const alterationArgument = methodChangeArguments.shift();
            
            if((alterationArgument === undefined) || (alterationArgument === "")) {
                const errorFeedback = new Feedback();
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.method.error.missing_alteration_argument.part_1"));
                errorFeedback.addSnippet(new StringSnippet(":" + methodChangeArguments.toString().replaceAll(",", ":") + ".."));
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.method.error.missing_alteration_argument.part_2"));

                throw new AppError(errorFeedback);
            } else {
                switch(alterationArgument) {
                    case "add":
                        createMethods.push(this.handleCreateMethodArgument([alterationArgument.toString().replaceAll(",", ":")].concat(paramenterChangeArguments)));
                        break;

                    case "remove":
                        removeMethods.push({
                            methodName: methodChangeArguments[0]
                        });
                        break;

                    case "alter":
                        const parameterChanges = this.handleParameterChanges(paramenterChangeArguments);
                        alterMethods.push({
                            methodName: methodChangeArguments[0],
                            newMethodVisibility: methodChangeArguments[1],
                            newMethodName: methodChangeArguments[2],
                            newMethodType: methodChangeArguments[3],
                            parameterAlteraions: parameterChanges
                        });
                        break;

                    default:
                        const errorFeedback = new Feedback();
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.method.error.invalid_alteration_argument.part_1"));
                        errorFeedback.addSnippet(new StringSnippet(alterationArgument + ":" + methodChangeArguments.toString().replaceAll(",", ":") + ".."));
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.method.error.invalid_alteration_argument.part_2"));
    
                        throw new AppError(errorFeedback);
                }
            }
        });

        return {
            create: createMethods,
            remove: removeMethods,
            alter: alterMethods
        }
    }

    /**
     * Handles parameter arguments into DTOs.
     * 
     * @param parameterArguments An array of arguments to be handled. 
     * @returns Handled arguments, some may be empty if no instruction of said type were given.
     */
    private static handleParameterChanges(parameterArguments: string[]): IParameterChangesDTO {
        const createParameters = [] as ICreateParameterDTO[];
        const removeParameters = [] as IRemoveParameterDTO[];
        const alterParameters = [] as IAlterParameterDTO[];
        
        parameterArguments.forEach((argument) => {
            const changeArguments = argument.split(":");
            const alterationArgument = changeArguments.shift();
            
            if((alterationArgument === undefined) || (alterationArgument === "")) {
                const errorFeedback = new Feedback();
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.parameter.error.missing_alteration_argument.part_1"));
                errorFeedback.addSnippet(new StringSnippet(":" + changeArguments.toString().replaceAll(",", ":")));
                errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.parameter.error.missing_alteration_argument.part_2"));

                throw new AppError(errorFeedback);
            } else {
                switch(true) {
                    case alterationArgument === "add":
                        createParameters.push({
                            name: argument[0],
                            type: argument[1]
                        });
                        break;

                    case alterationArgument === "remove":
                        removeParameters.push({
                            paramaterName: argument[0]
                        });
                        break;

                    case alterationArgument === "alter":
                        alterParameters.push({
                            parameterName: argument[0],
                            newParameterName: argument[1],
                            newParameterType: argument[2]
                        });
                        break;

                    default:
                        const errorFeedback = new Feedback();
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.parameter.error.invalid_alteration_argument.part_1"));
                        errorFeedback.addSnippet(new StringSnippet(alterationArgument + ":" + changeArguments.toString().replaceAll(",", ":")));
                        errorFeedback.addSnippet(new LocalizationSnippet("feedback.alter.parameter.error.invalid_alteration_argument.part_2"));
    
                        throw new AppError(errorFeedback);
                }
            }
        });

        return {
            create: createParameters,
            remove: removeParameters,
            alter: alterParameters
        };

    }
}