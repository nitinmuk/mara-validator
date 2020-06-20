// when document is ready, allow functions to run
$(document).ready(function () {

    function accesCodeToBeValidated() {
        // prevent default behaviour
        event.preventDefault();

        // create new variable containing the code to be analysed 
        var inputtedCodeToBeValidated = $("#code-to-analyse").val();

        // create a new variable containing the selected language from dropdown 
        var languageSelectedByUser = $("#language-selected :selected").val();


        console.log(inputtedCodeToBeValidated);
        console.log(languageSelectedByUser);


        if (languageSelectedByUser == "Javascript") {
            // call JSHint (created by Nitin)
            console.log("call JSHint")
        }
        else if (languageSelectedByUser == "HTML") {
            // call the HTML API (creted by RJ)
            console.log("call HTML API")
        }
        else if (languageSelectedByUser == "CSS") {
            // call the CSS API (creted by RJ)
            console.log("call CSS API")
        } 
        else {
            // language has not been selected by user - error modal "please select language" will go here
            console.log("alert user to select one of the languages")
        }

    }

    function removePreviouslyAppendedErrors() {
        // remove all children nodes
        $("#append-errors-here").empty();
    }

    // add event listener to click of 'validate' button  
    $("#validate-code").on("click", accesCodeToBeValidated)

    // add event listener to click of clear button 
    $("#clear-page").on("click", removePreviouslyAppendedErrors)
});