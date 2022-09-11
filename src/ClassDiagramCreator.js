//Errors
const UNDEFINED_COMMAND = "Undefined command!";
const CREATE_ERROR = "Create must have at minimum type and name!";
const ALTER_ERROR = "Alter must have at minimum type, name and one argument!";
const REMOVE_ERROR = "Remove must have type and name only!";
const TYPE_UNDEFINED = "Specified type is undefined!";
const CLASS_NAME_ERROR = "Name used is invalid or missing!";
const ARGUMENTS_ERROR = "Arguments are missing or invalid!";
const MODEL_NOT_FOUND = "Required model was not found!";

$(document).ready(function() {
    //Key's codes
    const ENTER_KEY = 13;

    //Get command
    $('#CommandConsole').keyup(function (event) {
        if (event.keyCode == ENTER_KEY) {
            const command = this.value.replace("\n", "");

            if(command != "") {
                insertIntoCommandHistory(command);
                const commandArguments = command.split(" ");

                switch(commandArguments[0].toLowerCase()) {
                    case "clear":
                        clearCommandHandler();
                        break;

                    case "create":
                        createCommandHandler(commandArguments);
                        break;

                    case "alter":
                        alterCommandHandler(commandArguments);
                        break;

                    case "remove":
                        removeCommandHandler(commandArguments);
                        break;

                    default:
                        insertIntoCommandHistory(UNDEFINED_COMMAND);
                }
            }

            this.value = "";
        }
    });
});

// ---> COMMAND HANDLERS <---

//Creation handlers
//Command syntax:
//create MODELTYPE NAME ?-a (*VISIBILITY*:TYPE:NAME, .., *VISIBILITY*:TYPE:NAME)? ?-m (*VISIBILITY*:TYPE:NAME, .., *VISIBILITY*:TYPE:NAME)?
//Argument surrounded by * is defaulted to private if omitted
//Argument surrounded by ? may be omitted
//Supported MODELTYPEs: class
//Supported VISIBILITY: private, protected, public
//Description:
//Creates model with desired type and information
function createCommandHandler(creationArguments) {
    try {
        //Validade minimum arguments
        if(creationArguments.length < 3) {
            throw CREATE_ERROR;
        }

        //Type name must exist and be alphabetic character only
        typeValidationHandler(creationArguments[1]);

        //Class name must be alphabetic character only
        nameValidationHandler(creationArguments[2]);
        const className = creationArguments[2];

        //Get attributes
        const attributeArgumentPosition = creationArguments.indexOf("-a");
        let attributesArray = [];
        if(attributeArgumentPosition != -1) {
            attributesArray = argumentToArrayHandler(attributeArgumentPosition + 1, creationArguments);attributesArray = addArgumentsHandler(attributesArray);
        }

        //Get methods
        const methodArgumentPosition = creationArguments.indexOf("-m");
        let methodsArray = [];
        if(methodArgumentPosition != -1) {
            methodsArray = argumentToArrayHandler(methodArgumentPosition + 1, creationArguments);
            console.log(methodsArray);
            methodsArray = addArgumentsHandler(methodsArray);
        }
    
        //Create Class table
        $('#ClassDiagramCanvas').append(`
            <div id="${className}Class" class="ClassModel">
                <div id="${className}ClassNameRow" class="ClassModelRow">
                    <div id="${className}ClassTitle">Class</div>
                    <div id="${className}ClassName">${className}</div>
                </div>
                <div id="${className}ClassAttributesRow" class="ClassModelRow">
                    <div id="${className}ClassAttributeTitle">Attributes</div>
                </div>
                <div id="${className}ClassMethodsRow" class="ClassModelRow">
                    <div id="${className}ClassMethodsTitle">Methods</div>
                </div>
            </div>
        `);
    
        //Create attributes row
        if(attributesArray.length != 0) {
            addToModelHandler(className, "class", attributesArray, "attribute");
        } else {
            $('#'+className+'ClassAttributesRow').append(`
                <div id="${className}ClassEmptyAttributeRow">
                    -
                </div>
            `);
        }
    
        //Create methods row
        if(methodsArray.length != 0) {
            addToModelHandler(className, "class", methodsArray, "method");
        } else {
            $('#'+className+'ClassMethodsRow').append(`
                <div id="${className}ClassEmptyMethodRow">
                    -
                </div>
            `);
        }
    } catch (error) {
        insertIntoCommandHistory(error)
    }
}

//Alteration handlers
//Command syntax:
//alter MODELTYPE NAME ?-n NEWNAME? ?-a (ACTION .., ACTION)? ?-m (ACTION .., ACTION)?
//Argument surrounded by ? may be omitted
//Supported MODELTYPEs: class
//Supported ACTIONs: add, rmv, alt
//Action add, inserts new attribute/method to the bottom of the named model, syntax is add:*VISIBILITY*:TYPE:NAME, argument surrounded by * is defaulted to private
//Action rmv, removes named attribute/method in named model, syntax is rmv:NAME
//Action alt, changes named attribute/method in named model, syntax is alt:NAME:VISIBILITY:TYPE:NEWNAME, - is used to define which field is not to be changed
//Description:
//Changes named model information
function alterCommandHandler(alterationArguments) {
    try {
        //Validade minimum arguments
        if(alterationArguments.length < 5) {
            throw ALTER_ERROR;
        }

        //Type name must exist and be alphabetic character only
        typeValidationHandler(alterationArguments[1]);

        //Class name must be alphabetic character only
        nameValidationHandler(alterationArguments[2]);
        var className = alterationArguments[2]; //Create Class table

        //Checks if model exists
        const model = $(`#${className}Class`);
        if(model.length == 0) {
            throw MODEL_NOT_FOUND;
        }

        //Checks if name is to be changed and valid
        const nameChangeArgument = alterationArguments.indexOf("-n");
        const newName = alterationArguments[nameChangeArgument + 1].trim();
        if(nameChangeArgument != -1) {
            nameValidationHandler(newName);
        }

        //Seperate attributes actions
        const attributeArgumentPosition = alterationArguments.indexOf("-a");
        let attrinutesToAdd = [];
        let attrinutesToRmv = [];
        let attrinutesToAlt = [];
        if(attributeArgumentPosition != -1) {
            const attributesArguments = argumentToArrayHandler(attributeArgumentPosition + 1, alterationArguments);

            attributesArguments.forEach((attributeArgument) => {
                if(attributeArgument.toLowerCase().includes("add:")) {
                    attrinutesToAdd.push(attributeArgument);
                } else if(attributeArgument.toLowerCase().includes("rmv:")) {
                    attrinutesToRmv.push(attributeArgument);
                } else if(attributeArgument.toLowerCase().includes("alt:")) {
                    attrinutesToAlt.push(attributeArgument);
                } else {
                    throw ARGUMENTS_ERROR;
                }
            });
            //Handles alterating attributes arguments
            if(attrinutesToAdd.length != 0) {
                attrinutesToAdd = addArgumentsHandler(attrinutesToAdd);
            }
            if(attrinutesToRmv.length != 0) {
                attrinutesToRmv = rmvArgumentsHandler(attrinutesToRmv);
            }
            if(attrinutesToAlt.length != 0) {
                attrinutesToAlt = altArgumentsHandler(attrinutesToAlt);
            }
        }

        //Seperate methods actions
        const methodArgumentPosition = alterationArguments.indexOf("-m");
        let methodsToAdd = [];
        let methodsToRmv = [];
        let methodsToAlt = [];
        if(methodArgumentPosition != -1) {
            const methodsArguments = argumentToArrayHandler(methodArgumentPosition + 1, alterationArguments);

            methodsArguments.forEach((methodArgument) => {
                if(methodArgument.toLowerCase().includes("add:")) {
                    methodsToAdd.push(methodArgument);
                } else if(methodArgument.toLowerCase().includes("rmv:")) {
                    methodsToRmv.push(methodArgument);
                } else if(methodArgument.toLowerCase().includes("alt:")) {
                    methodsToAlt.push(methodArgument);
                } else {
                    throw ARGUMENTS_ERROR;
                }
            });
            //Handles alterating methods arguments
            if(methodsToAdd.length != 0) {
                methodsToAdd = addArgumentsHandler(methodsToAdd);
            }
            if(methodsToRmv.length != 0) {
                methodsToRmv = rmvArgumentsHandler(methodsToRmv);
            }
            if(methodsToAlt.length != 0) {
                methodsToAlt = altArgumentsHandler(methodsToAlt);
            }
        }

        //Add new methods
        if(methodsToAdd.length != 0) {
            addToModelHandler(className, "class", methodsToAdd, "method");
        }

        //Remove methods
        if(methodsToRmv.length != 0) {
            removeInModelHandler(className, "class", methodsToRmv, "method");
        }

        //Alterate methods
        if(methodsToAlt.length != 0) {
            alterateInModelHandler(className, "class", methodsToAlt, "method");
        }

        //Add new attributes
        if(attrinutesToAdd.length != 0) {
            addToModelHandler(className, "class", attrinutesToAdd, "attribute");
        }

        //Remove attributes
        if(attrinutesToRmv.length != 0) {
            removeInModelHandler(className, "class", attrinutesToRmv, "attribute");
        }

        //Alterate attributes
        if(attrinutesToAlt.length != 0) {
            alterateInModelHandler(className, "class", attrinutesToAlt, "attribute");
        }

        //Handles possible name change
        if(nameChangeArgument != -1) {
            modelNameChangeHandler(newName, model);
        }
    } catch (error) {
        insertIntoCommandHistory(error)
    }
}

//Creation handlers
//Command syntax:
//remove MODELTYPE NAME
//Supported MODELTYPEs: class
//Description:
//Removes named model
function removeCommandHandler(creationArguments) {
    try {
        //Validade minimum arguments
        if(creationArguments.length != 3) {
            throw REMOVE_ERROR;
        }

        //Type name must exist and be alphabetic character only
        typeValidationHandler(creationArguments[1]);
        const type = creationArguments[1].charAt(0).toUpperCase() + creationArguments[1].slice(1);

        //Class name must be alphabetic character only
        nameValidationHandler(creationArguments[2]);
        const className = creationArguments[2];
        
        //Create Class table
        $('#' + className + type).remove();
    } catch (error) {
        insertIntoCommandHistory(error)
    }
}

//Clear handler
//Commandsyntax:
//clear
//Description:
//Clears command history text
function clearCommandHandler() {
    $('#CommandHistory').val("");
}

// ---> DATA TO HTML HANDLERS <---

//Model name change
function modelNameChangeHandler(newName, model) {

    //Changes base model html ids to new name format
    model.attr("id", `#${newName}Class`);
    model.children()[0].id = newName + "ClassNameRow";
    model.children()[1].id = newName + "ClassAttributesRow";
    model.children()[2].id = newName + "ClassMethodsRow";

    //Changes model tittle/name row to new name format
    const modelNameRow = $(`#${newName}ClassNameRow`);
    modelNameRow.children()[0].id = newName + "ClassTitle";
    modelNameRow.children()[1].id = newName + "ClassName";
    modelNameRow.children()[1].innerText = newName;

    //Changes model attribute row to new name format
    const modelAttributeRow = $(`#${newName}ClassAttributesRow`);
    const attributes = modelAttributeRow.children();
    attributes[0].id = newName + "ClassAttributeTitle";
    if(attributes[1].innerText != "-") {
        for(let i = 1; i < attributes.length; i++) {
            const attribute = attributes[i].children;
            const attributeName = attribute[2].innerText;
    
            attributes[i].id = newName + "Class" + attributeName + "AttributeRow";
            attribute[0].id = newName + "Class" + attributeName + "AttributeVisibility";
            attribute[1].id = newName + "Class" + attributeName + "AttributeType";
            attribute[2].id = newName + "Class" + attributeName + "AttributeName";
        }
    } else {
        attributes[1].id = newName + "ClassEmptyAttributeRow";
    }

    //Changes model methods row to new name format
    const modelMethodRow = $(`#${newName}ClassMethodsRow`);
    const methods = modelMethodRow.children();
    methods[0].id = newName + "ClassMethodTitle";
    if(methods[1].innerText != "-") {
        for(let i = 1; i < methods.length; i++) {
            const method = methods[i].children;
            const methodName = method[2].innerText;
    
            methods[i].id = newName + "Class" + methodName + "MethodRow";
            method[0].id = newName + "Class" + methodName + "MethodVisibility";
            method[1].id = newName + "Class" + methodName + "MethodType";
            method[2].id = newName + "Class" + methodName + "MethodName";
        }
    } else {
        methods[1].id = newName + "ClassEmptyMethodRow";
    }
}

//Model information insertion handler
function addToModelHandler(modelName, modelType, arguments, argumentType) {
    //Uppercase firstletter
    modelType = modelType.charAt(0).toUpperCase() + modelType.slice(1);
    argumentType = argumentType.charAt(0).toUpperCase() + argumentType.slice(1);
    const htmlId = modelName + modelType + argumentType;

    //Removes empty row place holder if present
    if($('#' + modelName + modelType + 'Empty' + argumentType + 'Row').length != 0) {
        $('#' + modelName + modelType + 'Empty' + argumentType + 'Row').remove();
    }

    //Insertion on model's html
    arguments.forEach((argument) => {
        const htmlRowId = modelName + modelType + argument[2] + argumentType;

        $('#' + htmlId + 'sRow').append(`
            <div id="${htmlRowId}Row">
                <div id="${htmlRowId}Visibility" class="FloatRow">${argument[0]}&nbsp</div>
                <div id="${htmlRowId}Type" class="FloatRow">${argument[1]}:&nbsp</div>
                <div id="${htmlRowId}Name">${argument[2]}</div>
            </div>
        `);
    });
}

//Model information insertion handler
function removeInModelHandler(modelName, modelType, arguments, argumentType) {
    //Uppercase firstletter
    modelType = modelType.charAt(0).toUpperCase() + modelType.slice(1);
    argumentType = argumentType.charAt(0).toUpperCase() + argumentType.slice(1);

    //Insertion on model's html
    arguments.forEach((argument) => {
        $('#' + modelName + modelType + argument + argumentType + 'Row').remove();
    });

    //Removes empty row place holder if present
    if($('#' + modelName + modelType + argumentType + 'sRow').length == 1) {
        $('#' + modelName + modelType + argumentType + 'sRow').append(`
            <div id="${modelName}${modelType}Empty${argumentType}Row">
                -
            </div>
        `);
    }
}

//Model information insertion handler
function alterateInModelHandler(modelName, modelType, arguments, argumentType) {
    //Uppercase firstletter
    modelType = modelType.charAt(0).toUpperCase() + modelType.slice(1);
    argumentType = argumentType.charAt(0).toUpperCase() + argumentType.slice(1);

    //Insertion on model's html
    arguments.forEach((argument) => {
        //Html id prototype
        const htmlId = modelName + modelType + argument[0] + argumentType;

        //Visibility
        if(argument[1] != "-") {
            $('#' + htmlId + 'Visibility').text(`${argument[1]}\xa0`);
        }

        //Type
        if(argument[2] != "-") {
            $('#' + htmlId + 'Type').text(`${argument[2]}:\xa0`);
        }

        //Name
        if(argument[3] != "-") {
            $('#' + htmlId + 'Name').text(argument[3]);

            //New ids
            const newHtmlId = modelName + modelType + argument[3] + argumentType;
            $('#' + htmlId + 'Row').attr("id", '#' + newHtmlId + 'Row');
            $('#' + htmlId + 'Visibility').attr("id", '#' + newHtmlId + 'Visibility');
            $('#' + htmlId + 'Type').attr("id", '#' + newHtmlId + 'Type');
            $('#' + htmlId + 'Name').attr("id", '#' + newHtmlId + 'Name');
        }
    });
}

//Insert into history
function insertIntoCommandHistory(text) {
    $('#CommandHistory').val($('#CommandHistory').val() + text + "\n");
    $('#CommandHistory').scrollTop(9999999999);
}

// ---> UTILITY HANDLERS <---

//Handle new arguments for methods and attributes
function addArgumentsHandler(arguments) {
    const handledAddArguments = [];

    //Removes command strutuctre characters and split values into array
    arguments.forEach((argument) => {
        if(argument.toLowerCase().indexOf("add:") != -1) {
            argument = argument.toLowerCase().replace("add:", "");
        }
        argument = argument.replace(",", "").split(":");
    
        switch(argument[0].toLowerCase()) {
            case "private":
                argument[0] = "-";
                break;

            case "public":
                argument[0] = "+";
                break;
    
            case "protected":
                argument[0] = "~";
                break;

            default:
                if(argument.length == 2){
                    argument.unshift("-");
                } else {
                    throw ARGUMENTS_ERROR;
                }
        }

        //Argument type and name must be alphabetical characters only
        nameValidationHandler(argument[2]);
        nameValidationHandler(argument[3]);

        handledAddArguments.push(argument);
    });

    return handledAddArguments;
}

//Handle arguments removal of methods and attributes
function rmvArgumentsHandler(arguments) {
    const handledRmvArguments = [];

    //Removes command strutuctre characters and split values into array
    arguments.forEach((argument) => {
        //Removes , and get to be removed argument name
        argument = argument.replace(",", "").split(":");

        //Argument type and name must be alphabetical characters only
        nameValidationHandler(argument[1]);

        handledRmvArguments.push(argument[1]);
    });

    return handledRmvArguments;
}

//Handle arguments removal of methods and attributes
function altArgumentsHandler(arguments) {
    const handledAltArguments = [];

    //Removes command strutuctre characters and split values into array
    arguments.forEach((argument) => {
        //Removes , and get to be altered and alt designation
        argument = argument.replace(",", "").split(":");
        argument.shift();

        //Argument type and name must be alphabetical characters only
        nameValidationHandler(argument[1]);
        if(argument[5] != "-") {
            nameValidationHandler(argument[5]);
        }
    
        switch(argument[1].toLowerCase()) {
            case "private":
                argument[1] = "-";
                break;

            case "public":
                argument[1] = "+";
                break;
    
            case "protected":
                argument[1] = "~";
                break;

            default:
                if(argument[1] != "-"){
                    throw ARGUMENTS_ERROR;
                }
        }

        handledAltArguments.push(argument);
    });

    return handledAltArguments;
}

//Argument to array
function argumentToArrayHandler(firstArgumentPosition, arguments) {
    var lastArgumentPosition = arguments.length;
    for(let i = firstArgumentPosition; i < lastArgumentPosition; i++) {
        if(arguments[i].lastIndexOf(")") != -1) {
            lastArgumentPosition = i;
        }
    }

    if((arguments.length < firstArgumentPosition + 1) ||
    (arguments[firstArgumentPosition][0] != "(") ||
    (arguments[lastArgumentPosition].lastIndexOf(")") == arguments.length)) {
        throw ARGUMENTS_ERROR;
    } 

    //Remove ()
    arguments[firstArgumentPosition] = arguments[firstArgumentPosition].replace("(", "");
    arguments[lastArgumentPosition] = arguments[lastArgumentPosition].replace(")", "");
        
    const argumentsArray = arguments.slice(firstArgumentPosition, lastArgumentPosition + 1);

    if(argumentsArray[firstArgumentPosition] == "") {
        throw ARGUMENTS_ERROR;
    }
        
    return argumentsArray;
}

//Type validation
function typeValidationHandler(type) {
    const types = [
        "class"
    ];

    if(!types.includes(type)) {
        throw TYPE_UNDEFINED;
    }
}

//Name validation
function nameValidationHandler(name) {
    if(!(/^[A-Za-z]*$/.test(name))) {
        throw CLASS_NAME_ERROR;
    }
}