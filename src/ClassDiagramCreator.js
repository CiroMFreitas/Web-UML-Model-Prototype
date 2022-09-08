$(document).ready(function() {
    const ENTER_KEY = 13;

    $('#CommandConsole').keyup(function (event) {
        if (event.keyCode == ENTER_KEY) {
            const command = this.value.trim();

            if(command != "") {
                insertOnCommandHistory(command);

                switch(command.toLowerCase()) {
                    case "clear":
                        clearCommandHandler();
                        break;

                    default:
                        insertOnCommandHistory("Undefined command!")
                }
            }

            this.value = "";
        }
    });
});

function clearCommandHandler () {
    $('#CommandHistory').val("");
}

function insertOnCommandHistory (text) {
    if($('#CommandHistory').val() != "") {
        $('#CommandHistory').val( $('#CommandHistory').val() + "\n" + text);
    } else {
        $('#CommandHistory').val($('#CommandHistory').val() + text);
    }
    $('#CommandHistory').scrollTop(9999999999);
}