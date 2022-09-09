$(document).ready(function() {
    //Key's codes
    const ENTER_KEY = 13;

    //Get command
    $('#CommandConsole').keyup(function (event) {
        if (event.keyCode == ENTER_KEY) {
            const command = this.value.trim();

            if(command != "") {
                insertOnCommandHistory(command);

                switch(command.toLowerCase()) {
                    case "clear":
                        clearCommandHandler();
                        break;

                    case "create":
                        createCommandHandler(command);
                        break;

                    default:
                        insertIntoCommandHistory("Undefined command!\n")
                }
            }

            this.value = "";
        }
    });
});

function createCommandHandler (command) {
    $('#ClassDiagramCanvas').append(`
        <table id="ClassModel">
            <tr>
                <th>Class Name</th>
            </tr>
            <tr>
                <th>Class Atributtes</th>
            </tr>
            <tr>
                <th>Class Methods</th>
            </tr>
        </table>
    `)
}

//Clear handler
function clearCommandHandler () {
    $('#CommandHistory').val("");
}

//Insert into history h
function insertIntoCommandHistory (text) {
    $('#CommandHistory').val($('#CommandHistory').val() + text);
    $('#CommandHistory').scrollTop(9999999999);
}