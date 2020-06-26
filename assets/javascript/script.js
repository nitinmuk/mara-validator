//must be global variable which will store result to be rendered.
var result = [];
// when document is ready, allow functions to run
$(document).ready(function () {
    // call NumberedTextArea function and add numbers to the text
    $('#code-to-analyse').numberedtextarea();

    // access local storage "language" and assign to variable
    let languageValue = localStorage.getItem("language");
    // if language value is not empty, display on dropdown 
    if (languageValue !== null) {
        $("select#language-selected").val(languageValue);
    }

    /**
     * gets trigerred once user click on validate button
     * it analyzes the selected language and text inserted by user
     * in text editor and then triggers relevant API/error modals based on same.
     * Also, saves the language selected by user in local storage
     * so that on next user visit same language could be preselcted.
     */
    function accesCodeToBeValidated() {

        // prevent default behaviour
        event.preventDefault();

        // create new variable containing the code to be analysed 
        const inputtedCodeToBeValidated = $("#code-to-analyse").val();

        // if inputted code is empty 
        if (inputtedCodeToBeValidated == "") {
            // access appropriate error message modal 
            const noCodeModal = $("#no-code-input-modal");
            // display modal
            activateModal(noCodeModal);
            // on click of modal
            $(noCodeModal).on("click", function () {
                // set to hidden
                deactivateModal(noCodeModal);
            });
            // exit function - if no code is entered, do not continue
            return;
        }
        // create a new variable containing the selected language from dropdown 
        const languageSelectedByUser = $("#language-selected :selected").val();
        addLatestLanguageToLocalStorage(languageSelectedByUser);
        selectTheLanguageAPI(languageSelectedByUser, inputtedCodeToBeValidated);
    }

    /**
     * activates current modal.
     * @param {current modal which need to be displayed} currentModal 
     */
    function activateModal(currentModal) {
        currentModal.addClass("is-active");
    }

    /**
     * deactivates current modal
     * @param {current modal which need to be hidden} currentModal 
     */
    function deactivateModal(currentModal) {
        currentModal.removeClass("is-active");
    }

    /**
     * saves current language in local storage.
     * @param {current user selected language} languageSelectedByUser 
     */
    function addLatestLanguageToLocalStorage(languageSelectedByUser) {
        localStorage.setItem("language", languageSelectedByUser);
    }

    /**
     * once it is detected that user selected language is not correct
     * then displays modal to user to confirm if language is correct
     * and let user decide if he/she wants to change the language selection
     * or continue with same selection and validate against same.
     * @param {current language selected by user} languageSelectedByUser 
     * @param {code which need to be validated} inputtedCodeToBeValidated 
     */
    function wrongLanguageModalActivation(languageSelectedByUser, inputtedCodeToBeValidated) {
        // access appropriate error message modal 
        const wrongLanguageModal = $("#wrong-language-selected");
        // display modal
        activateModal(wrongLanguageModal);

        $("#correct-language").on("click", function () {
            deactivateModal(wrongLanguageModal);

            if (languageSelectedByUser == "Javascript") {
                validateJavaScript(inputtedCodeToBeValidated);
            }
            else if (languageSelectedByUser == "HTML") {
                validateHtml(inputtedCodeToBeValidated);
            }
            else if (languageSelectedByUser == "CSS") {
                validateCss(inputtedCodeToBeValidated);
            }
        });

        $("#incorrect-language").on("click", function () {
            deactivateModal(wrongLanguageModal);
            return;
        });

        $(".modal-close").on("click", function () {
            deactivateModal(wrongLanguageModal);
            return;
        });

    }

    /**
     * used to dynamically change modal message text about the current selected language
     * @param {current user selected language} languageSelectedByUser 
     */
    function updateWrongLanguageModalText(languageSelectedByUser) {
        $("#insert-language-here").text(languageSelectedByUser);
    }

    /**
     * activate wrong language selection modal if detected language is different
     * than what user has selected, otherwise triggers relevant API based on 
     * user selected language to do validation.
     * @param {current selected language by user} languageSelectedByUser 
     * @param {source code which need to be validated} inputtedCodeToBeValidated 
     */
    function selectTheLanguageAPI(languageSelectedByUser, inputtedCodeToBeValidated) {
        // call highlight.JS and run inputted code through
        const lan = hljs.highlightAuto(inputtedCodeToBeValidated);
        // store language detected in variable
        const codeLanguageDetected = lan.language;

        if (languageSelectedByUser == "Javascript") {
            if (codeLanguageDetected == "javascript") {
                validateJavaScript(inputtedCodeToBeValidated);
            } else {
                updateWrongLanguageModalText(languageSelectedByUser);
                wrongLanguageModalActivation(languageSelectedByUser, inputtedCodeToBeValidated);
            }
        }
        else if (languageSelectedByUser == "HTML") {
            if (codeLanguageDetected == "xml") {
                validateHtml(inputtedCodeToBeValidated);

            } else {
                updateWrongLanguageModalText(languageSelectedByUser);
                wrongLanguageModalActivation(languageSelectedByUser, inputtedCodeToBeValidated);
            }
        }
        else if (languageSelectedByUser == "CSS") {
            if (codeLanguageDetected == "css") {
                validateCss(inputtedCodeToBeValidated);
            } else {
                updateWrongLanguageModalText(languageSelectedByUser);
                wrongLanguageModalActivation(languageSelectedByUser, inputtedCodeToBeValidated);
            }
        }
        else {
            // access appropriate modal div
            const noLanguageModal = $("#no-language-selected-modal");
            // display modal
            activateModal(noLanguageModal);
            // when modal is clicked on 
            $(noLanguageModal).on("click", function () {
                // set modal to hidden
                deactivateModal(noLanguageModal);
            });
        }
    }

    /**
     * clears line number for text editor.
     */
    function clearLineNumbersInTextArea() {
        const numberArea = $(".numberedtextarea-line-numbers");
        $(numberArea).children().not(':first').remove();
        removePreviouslyAppendedErrors();
    }

    /**
     * clears the section where error result element will be rendered.
     */
    function removePreviouslyAppendedErrors() {
        // remove all children nodes
        $("#append-errors-here").empty();
    }

    /**
     * validates input source using JSHint API,
     * creates error object if any error found
     * and finally renders result to user. 
     * @param {source code which need to be validated} source 
     */
    function validateJavaScript(source) {
        var options = {
            //undef: true,
            esversion: 10,
            unused: true
        };
        var predef = {
            foo: false
        };
        JSHINT(source, options, predef);
        const errors = JSHINT.data().errors;
        window.result = [];
        if (errors && errors.length) {
            $.each(errors, function (index, item) {
                createAndPushErrorObject(item.line, item.reason, item.id, item.evidence);
            });
        }
        renderResult();
    }

    /**
     * calls W3C validate HTML API, once promise is resolved then process the response,
     * create error objects, if any error found
     * and finally renders result for user.
     * @param {source code which need to be validated} html 
     */
    function validateHtml(html) {
        // emulate form post
        var formData = new FormData();
        formData.append('out', 'json');
        formData.append('content', html);
        // make ajax call
        $.ajax({
            url: "https://html5.validator.nu/",
            data: formData,
            dataType: "json",
            type: "POST",
            processData: false,
            contentType: false,
            success: function (response) {
                // empty previous results
                window.result = [];
                const errors = response.messages;
                if (errors && errors.length) {
                    $.each(errors, function (index, item) {
                        createAndPushErrorObject(item.lastLine, item.message, item.type, item.extract);
                    });
                }
                renderResult();
            }
        });
    }

    /**
     * calls W3C validate CSS API to validate the source, once API responds, then process the response 
     * and parse the text response to extract desired data, create error object if error/warning found 
     * and finally calls renderResult function to display the result.
     * @param {source code which need to be validated} source 
     */
    function validateCss(source) {
        const outputFormat = "text/plain";
        const url = `https://cors-anywhere.herokuapp.com/http://jigsaw.w3.org/css-validator/validator?text=${encodeURIComponent(source)}&warning=0&profile=css3&output=${encodeURIComponent(outputFormat)}`;
        // make ajax call
        $.ajax({
            url,
            method: "GET"
        })
            .then(function (response) {
                const lines = response.split("\n");
                var lineNum, description, errorType, evidence;
                window.result = [];
                var errorFinished = false;
                $.each(lines, function (index, line) {
                    if (line.indexOf("Warning") > -1) {
                        errorFinished = true;
                    }
                    if (line.indexOf("Line") > -1) {
                        const colonSplit = line.split(":");
                        const spaceSplit = colonSplit[1].split(" ");
                        lineNum = spaceSplit[1];
                        const splitForEvidence = colonSplit[1].split(lineNum);
                        if (errorFinished) {
                            errorType = "warning";
                            description = splitForEvidence[1];
                            evidence = splitForEvidence[1];
                        }
                        else {
                            errorType = "error";
                            description = lines[index + 1].trim() + lines[index + 2].trim();
                            evidence = splitForEvidence[1];

                        }
                        createAndPushErrorObject(lineNum, description, errorType, evidence);
                    }
                });
                renderResult();
            });
    }

    /**
     * prepares error object using input fields and push it to result array.
     * @param {line number where error is being reported} lineNum 
     * @param {error reason or message} reason 
     * @param {severity or type of error} severity 
     * @param {line of code that has error} evidence 
     */
    function createAndPushErrorObject(lineNum, reason, severity, evidence) {
        const error = {};
        if (lineNum) {
            error.lineNo = lineNum;
        }
        if (reason) {
            error.reason = reason;
        }
        if (severity) {
            error.severity = severity;
        }
        if (evidence) {
            error.evidence = evidence;
        }
        window.result.push(error);
    }

    /**
     * first clears the error div and then create a table presenting all errors and add it to relevant div
     */
    function renderResult() {
        removePreviouslyAppendedErrors();
        if (result && result.length) {
            const table = $("<table></table>");
            prepareErrorTableHead(table, result[0]);
            $.each(result, function (index, item) {
                const tableDataRow = $("<tr></tr>");
                tableDataRow.append($("<td></td>").text(item.lineNo));
                tableDataRow.append($("<td></td>").text(item.reason));
                tableDataRow.append($("<td></td>").text(item.severity));
                tableDataRow.append($("<td></td>").text(item.evidence));
                table.append(tableDataRow);
            });

            $("#append-errors-here").append(table);
            // access modal content for number of errors found and set error count to result.lenght
            $("#total-errors-here").text(result.length);
            // access appropriate "number of errors" modal 
            const errorTotal = $("#number-of-errors-found");
            // display modal
            activateModal(errorTotal);
            // when modal is clicked on 
            $(errorTotal).on("click", function () {
                // set modal to hidden
                deactivateModal(errorTotal);
            });
        }
        else {
            // activate "NO ERRORS FOUND" modal
            // access appropriate modal div
            const noErrorsFoundModal = $("#no-errors-found");
            // display modal
            activateModal(noErrorsFoundModal);
            // when modal is clicked on 
            $(noErrorsFoundModal).on("click", function () {
                // set modal to hidden
                deactivateModal(noErrorsFoundModal);
            });
        }
    }

    /**
     * prepares head row for error table.
     * @param {table whose head row need to be prepared} table 
    */
    function prepareErrorTableHead(table) {
        const tableHead = $("<tr></tr>");
        tableHead.append($("<th class='has-text-primary'></th>").text("Line No."));
        tableHead.append($("<th class='has-text-primary'></th>").text("Error Description"));
        tableHead.append($("<th class='has-text-primary'></th>").text("Error Severity"));
        tableHead.append($("<th class='has-text-primary' id='focus-code-column'></th>").text("Code In Focus"));
        // give error table a border
        $(table).attr("style", "border: 4px solid #00d1b2");
        table.append(tableHead);
    }

    // add event listener to click of 'validate' button  
    $("#validate-code").on("click", accesCodeToBeValidated);

    // add event listener to click of clear button 
    $("#clear-page").on("click", removePreviouslyAppendedErrors, clearLineNumbersInTextArea);

});