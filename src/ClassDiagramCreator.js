//Errors
const UNDEFINED_COMMAND = "Undefined command!";
const CREATE_ERROR = "Create must have at minimum type and name!";
const ALTER_ERROR = "Alter must have at minimum type, name and one argument!";
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
        let methods = [];
        if(methodArgumentPosition != -1) {
            methods = addArgumentsHandler(methodArgumentPosition + 1, creationArguments);
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
        if(methods.length != 0) {
            addToModelHandler(className, "class", methods, "method");
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
//Action alt, changes named attribute/method in named model, syntax is alt:NAME:VISIBILITY:TYPE:NEWNAME, - is used to define that field is not to be changed
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
        }
        //Add new attributes
        if(attrinutesToAdd.length != 0) {
            const addingAttributeArguments = addArgumentsHandler(attrinutesToAdd);
            addToModelHandler(className, "class", addingAttributeArguments, "attribute");
        }

        //Remove attributes
        if(attrinutesToRmv.length != 0) {
            const removingAttributeArguments = rmvArgumentsHandler(attrinutesToRmv);
            removeInModelHandler(className, "class", removingAttributeArguments, "attribute");
        }

        //Handles possible name change
        if(nameChangeArgument != -1) {
            modelNameChangeHandler(newName, model);
        }
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

    //Insertion on model's html
    arguments.forEach((argument) => {
        $('#'+modelName+modelType+argumentType+'sRow').append(`
            <div id="${modelName}${modelType}${argument[2]}${argumentType}Row">
                <div id="${modelName}${modelType}${argument[2]}${argumentType}Visibility" class="FloatRow">${argument[0]}&nbsp</div>
                <div id="${modelName}${modelType}${argument[2]}${argumentType}Type" class="FloatRow">${argument[1]}:&nbsp</div>
                <div id="${modelName}${modelType}${argument[2]}${argumentType}Name">${argument[2]}</div>
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
        $('#'+modelName+modelType+argument+argumentType+'Row').remove();
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
    const handledAddArguments = [];

    //Removes command strutuctre characters and split values into array
    arguments.forEach((argument) => {
        //Removes , and get to be removed argument name
        argument = argument.replace(",", "").split(":");

        //Argument type and name must be alphabetical characters only
        nameValidationHandler(argument[1]);

        handledAddArguments.push(argument[1]);
    });

    return handledAddArguments;
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