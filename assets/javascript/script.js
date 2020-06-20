// when document is ready, allow functions to run
$(document).ready(function () {

    function accesCodeToBeValidated() {
        // prevent default behaviour
        event.preventDefault();

        // create new variable containing the code to be analysed 
        var inputtedCodeToBeValidated = $("#code-to-analyse").val();

        // if inputted code is empty 
        if (inputtedCodeToBeValidated == "") {
            // access appropriate error message modal 
            const noCodeModal = $("#no-code-input-modal");
            // display modal
            noCodeModal.removeClass("hide");
            // on click of modal
            $(noCodeModal).on("click", function() {
                // set to hidden
                noCodeModal.addClass("hide"); 
            })
        }

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
            // access appropriate modal div
            const noLanguageModal = $("#no-language-selected-modal")
            // display modal
            noLanguageModal.removeClass("hide")
            // when modal is clicked on 
            $(noLanguageModal).on("click", function() {
                // set modal to hidden
                noLanguageModal.addClass("hide")
            })
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