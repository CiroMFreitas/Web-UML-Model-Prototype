//Errors
const CREATE_TYPE_UNDEFINED = "Type chosen for creation is undefined!";
const CLASS_NAME_MISSING = "Class name is missing or invalid on creation!";
const METHODS_ERROR = "Methods are missing or invalid!"
const METHODS_ARGUMENT_ERROR = "Methods arguments are missing or invalid!"

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
                        insertIntoCommandHistory("Undefined command!")
                }
            }

            this.value = "";
        }
    });
});

//Creation handlers
function createCommandHandler (creationArgumnts) {
    try {
        if((creationArgumnts.length < 2) ||
        (creationArgumnts[1].toLowerCase() != "class")) {
            throw CREATE_TYPE_UNDEFINED;
        }

        //Class name must exist and be alphabetic character only
        if((creationArgumnts.length < 3) ||
        !(/^[A-Za-z]*$/.test(creationArgumnts[2].toLowerCase()))) {
            throw CLASS_NAME_MISSING;
        }

        //Method treatement
        const methodsArgumentPosition = creationArgumnts.indexOf("-m");
        const firstMethodArgument = methodsArgumentPosition + 1;

        //Get last method argument position
        var lastMethodArgument = creationArgumnts.length;
        for(let i = methodsArgumentPosition + 1; i < lastMethodArgument; i++) {
            if(creationArgumnts[i].lastIndexOf(")") != -1) {
                lastMethodArgument = i;
            }
        }

        //Method argument must be present, methods must be surrouded by () and must follow Visibility:Type:Name format, although visibility may be omitted and defaulted to private
        if(methodsArgumentPosition != -1) {
            if((creationArgumnts.length < methodsArgumentPosition + 1) ||
            (creationArgumnts[firstMethodArgument][0] != "(") ||
            (creationArgumnts[lastMethodArgument].lastIndexOf(")") == -1)) {
                throw METHODS_ERROR;
            }

            //Remove ()
            creationArgumnts[firstMethodArgument] = creationArgumnts[firstMethodArgument].replace("(", "");
            creationArgumnts[lastMethodArgument] = creationArgumnts[lastMethodArgument].replace(")", "");

            if(creationArgumnts[firstMethodArgument] == "") {
                throw METHODS_ARGUMENT_ERROR;
            }

            //Get methods
            var methods = [];
            for(let i = firstMethodArgument; i < lastMethodArgument + 1; i++) {
                let currentMethod = creationArgumnts[i].split(":");

                switch(currentMethod[0].toLowerCase()) {
                    case "private":
                        currentMethod[0] = "-";
                        break;

                    case "public":
                        currentMethod[0] = "+";
                        break;

                    case "protected":
                        currentMethod[0] = "~";
                        break;

                    default:
                        if(currentMethod.length == 2){
                            currentMethod.unshift("-");
                        } else {
                            throw METHODS_ARGUMENT_ERROR;
                        }
                }
                methods.push(currentMethod);
            }

            console.log(methods);
        }
    } catch (error) {
        insertIntoCommandHistory(error)
    }
    
    /*$('#ClassDiagramCanvas').append(`
        <table id="ClassModel">
            <tr>
                <th>${creationArgumnts[2]}</th>
            </tr>
            <tr>
                <th>Class Atributtes</th>
            </tr>
            <tr>
                <th>Class Methods</th>
            </tr>
        </table>
    `);*/
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