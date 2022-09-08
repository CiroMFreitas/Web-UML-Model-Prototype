$(document).ready(function() {
    const ENTER_KEY = 13;

    $('#CommandConsole').keyup(function (event) {
        if (event.keyCode == ENTER_KEY) {
            const command = this.value.trim();

            if(command != "") {
                insertOnCommandHistory(command);


            this.value = "";
        }
    });
});

function insertOnCommandHistory (text) {
    if($('#CommandHistory').val() != "") {
        $('#CommandHistory').val( $('#CommandHistory').val() + "\n" + text);
    } else {
        $('#CommandHistory').val($('#CommandHistory').val() + text);
    }
    $('#CommandHistory').scrollTop(9999999999);
}