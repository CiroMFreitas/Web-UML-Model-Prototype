//Errors
const CREATE_TYPE_UNDEFINED = "Type chosen for creation is undefined!";

$(document).ready(function() {
    //Key's codes
    const ENTER_KEY = 13;

    //Get command
    $('#CommandConsole').keyup(function (event) {
        if (event.keyCode == ENTER_KEY) {
            const command = this.value.trimEnd();

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

function createCommandHandler (command) {
    $('#ClassDiagramCanvas').append(`
//Creation handlers
function createCommandHandler (creationArgumnts) {
    try {
        if((creationArgumnts.length < 2) || (creationArgumnts[1].toLowerCase() != "class")) {
            throw CREATE_TYPE_UNDEFINED;
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