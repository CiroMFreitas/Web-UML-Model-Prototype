//Errors
const UNDEFINED_COMMAND = "Undefined command!";
const CREATE_ERROR = "Create must have at minimum type and name!";
const TYPE_UNDEFINED = "Specified type is undefined!"
const CLASS_NAME_ERROR = "Name used is invalid or missing!";
const ARGUMENTS_ERROR = "Arguments are missing or invalid!"

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

                    default:
                        insertIntoCommandHistory(UNDEFINED_COMMAND);
                }
            }

            this.value = "";
        }
    });
});

//Creation handlers
function createCommandHandler(creationArguments) {
    try {
        //Validade minimum arguments
        if(creationArguments.length < 3) {
            throw CREATE_ERROR;
        }

        //Class name must exist and be alphabetic character only
        typeValidationHandler(creationArguments[1]);

        //Class name must exist and be alphabetic character only
        nameValidationHandler(creationArguments[2]);
        const className = creationArguments[2];

        //Get methods
        const methods = argumentsHandler(creationArguments.indexOf("-m"), creationArguments);

        //Get attributes
        const attributes = argumentsHandler(creationArguments.indexOf("-a"), creationArguments);
    
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
        if(attributes) {
            attributes.forEach((attribute) => {
                $('#'+className+'ClassAttributesRow').append(`
                    <div id="${className}Class${attribute[2]}Row">
                        <div id="${className}Class${attribute[2]}AttributeVisibility" class="FloatRow">${attribute[0]}&nbsp</div>
                        <div id="${className}Class${attribute[2]}AttributeType" class="FloatRow">${attribute[1]}:&nbsp</div>
                        <div id="${className}Class${attribute[2]}AttributeName">${attribute[2]}</div>
                    </div>
                `);
            });
        } else {
            $('#'+className+'ClassAttributesRow').append(`
                <div id="${className}ClassEmptyAttributeRow">
                    -
                </div>
            `);
        }
    
        //Create methods row
        if(methods) {
            methods.forEach((method) => {
                $('#'+className+'ClassMethodsRow').append(`
                    <div id="${className}Class${method[2]}Row">
                        <div id="${className}Class${method[2]}MethodVisibility" class="FloatRow">${method[0]}&nbsp</div>
                        <div id="${className}Class${method[2]}MethodType" class="FloatRow">${method[1]}:&nbsp</div>
                        <div id="${className}Class${method[2]}MethodName">${method[2]}</div>
                    </div>
                `);
            });
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

//Clear handler
function clearCommandHandler() {
    $('#CommandHistory').val("");
}

//Insert into history h
function insertIntoCommandHistory(text) {
    $('#CommandHistory').val($('#CommandHistory').val() + text + "\n");
    $('#CommandHistory').scrollTop(9999999999);
}


//Handle arguments for methods and attributes
function argumentsHandler(startArgumentPosition, creationArgumnts) {
    //Arguments must be present, surrouded by () and must follow the Visibility:Type:Name format, although visibility may be omitted and defaulted to private
    if(startArgumentPosition != -1) {
        //Get arguments first and last positions
        const firstArgumentPosition = startArgumentPosition + 1;
        var lastArgumentPosition = creationArgumnts.length;
        for(let i = startArgumentPosition + 1; i < lastArgumentPosition; i++) {
            if(creationArgumnts[i].lastIndexOf(")") != -1) {
                lastArgumentPosition = i;
            }
        }

        if((creationArgumnts.length < startArgumentPosition + 1) ||
        (creationArgumnts[firstArgumentPosition][0] != "(") ||
        (creationArgumnts[lastArgumentPosition].lastIndexOf(")") == -1)) {
            throw ARGUMENTS_ERROR;
        }

        //Remove ()
        creationArgumnts[firstArgumentPosition] = creationArgumnts[firstArgumentPosition].replace("(", "");
        creationArgumnts[lastArgumentPosition] = creationArgumnts[lastArgumentPosition].replace(")", "");
        
        let arguments = creationArgumnts.slice(startArgumentPosition + 1, lastArgumentPosition + 1);

        if(creationArgumnts[firstArgumentPosition] == "") {
            throw ARGUMENTS_ERROR;
        }

        for(let i = 0; i < arguments.length; i++) {
            //Removes uncessary chacters and split values into array
            arguments[i] = arguments[i].replace(",", "").split(":");
    
            switch(arguments[i][0].toLowerCase()) {
                case "private":
                    arguments[i][0] = "-";
                    break;
    
                case "public":
                    arguments[i][0] = "+";
                    break;
    
                case "protected":
                    arguments[i][0] = "~";
                    break;
    
                default:
                    if(arguments[i].length == 2){
                        arguments[i].unshift("-");
                    } else {
                        throw ARGUMENTS_ERROR;
                    }
            }

            //Argument type and name must have alphabetical characters only
            nameValidationHandler(arguments[i][2]);
            nameValidationHandler(arguments[i][3]);
        };
    
        return arguments;
    }
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