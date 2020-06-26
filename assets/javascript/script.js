//must be global variable which will store result to be rendered.
var result = [];
// when document is ready, allow functions to run
$(document).ready(function() {
    // call NumberedTextArea function and add numbers to the text
    $('#code-to-analyse').numberedtextarea();

    // access local storage "language" and assign to variable
    let languageValue = localStorage.getItem("language")
    // if language value is not empty, display on dropdown 
    if (languageValue !== null) {
        $("select#language-selected").val(languageValue);
    }

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
            $(noCodeModal).on("click", function() {
                // set to hidden
                deactivateModal(noCodeModal);
            });
            // exit function - if no code is entered, do not continue
            return;
        }

        // call highlight.JS and run inputted code through
        const lan = hljs.highlightAuto(inputtedCodeToBeValidated);

        // save language detected in variable
        const codeLanguageDetected = lan.language;
        
        // create a new variable containing the selected language from dropdown 
        const languageSelectedByUser = $("#language-selected :selected").val();

        addLatestLanguageToLocalStorage(languageSelectedByUser);

        selectTheLanguageAPI(languageSelectedByUser, codeLanguageDetected, inputtedCodeToBeValidated);

    }

    function activateModal(currentModal) {
        currentModal.addClass("is-active");
    }

    function deactivateModal(currentModal) {
        currentModal.removeClass("is-active");
    }

    function addLatestLanguageToLocalStorage(languageSelectedByUser) {
        localStorage.setItem("language", languageSelectedByUser)
    }

    function wrongLanguageModalActivation(languageSelectedByUser, inputtedCodeToBeValidated) {
        // access appropriate error message modal 
        const wrongLanguageModal = $("#wrong-language-selected");
        // display modal
        activateModal(wrongLanguageModal);

        $("#correct-language").on("click", function () {
            deactivateModal(wrongLanguageModal);

            if (languageSelectedByUser == "Javascript") {
                validateJavaScript(inputtedCodeToBeValidated);
                renderResult();
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

    function updateWrongLanguageModalText(languageSelectedByUser) {
        $("#insert-language-here").text(languageSelectedByUser);
    }

    function selectTheLanguageAPI(languageSelectedByUser, codeLanguageDetected, inputtedCodeToBeValidated) {
        if (languageSelectedByUser == "Javascript") {
            if (codeLanguageDetected == "javascript") {
                console.log("match")
                validateJavaScript(inputtedCodeToBeValidated);
                renderResult();

            } else {
                updateWrongLanguageModalText(languageSelectedByUser)
                wrongLanguageModalActivation(languageSelectedByUser, inputtedCodeToBeValidated);
            }
        } 
        else if (languageSelectedByUser == "HTML") {
            if (codeLanguageDetected == "xml") {
                validateHtml(inputtedCodeToBeValidated);
                
            } else {
                updateWrongLanguageModalText(languageSelectedByUser)
                wrongLanguageModalActivation(languageSelectedByUser, inputtedCodeToBeValidated);
            }
        } 
        else if (languageSelectedByUser == "CSS") {
            if (codeLanguageDetected == "css") {
                validateCss(inputtedCodeToBeValidated);
            } else {
                updateWrongLanguageModalText(languageSelectedByUser)
                wrongLanguageModalActivation(languageSelectedByUser, inputtedCodeToBeValidated);
            }
        } 
        else {
            // access appropriate modal div
            const noLanguageModal = $("#no-language-selected-modal");
            // display modal
            activateModal(noLanguageModal);
            // when modal is clicked on 
            $(noLanguageModal).on("click", function() {
                // set modal to hidden
                deactivateModal(noLanguageModal);
            });
        }
    }

    function clearLineNumbersInTextArea() {
        const numberArea = $(".numberedtextarea-line-numbers");
        $(numberArea).children().not(':first').remove();
        removePreviouslyAppendedErrors()
    }

    function removePreviouslyAppendedErrors() {
        // remove all children nodes
        $("#append-errors-here").empty();
    }

    /**
     * validates input source using JSHint API and populates result array.
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
        console.log(JSHINT.data());
        const errors = JSHINT.data().errors;
        result = [];
        if (errors && errors.length) {
            $.each(errors, function(index, item) {
                createAndPushErrorObject(item.line, item.reason, item.id, item.evidence);
            });
            renderResult();
        }
    }

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
            success: function(result) {
                // empty previous results
                window.result = [];
                const errors = result.messages;
                if (errors && errors.length) {
                    $.each(errors, function(index, item) {
                        createAndPushErrorObject(item.lastLine, item.message, item.type, item.extract);
                    });
                }
                renderResult();
            }
        });
    }

    function validateCss(source) {
        const outputFormat = "text/plain";
        const url = `https://cors-anywhere.herokuapp.com/http://jigsaw.w3.org/css-validator/validator?text=${encodeURIComponent(source)}&warning=0&profile=css3&output=${encodeURIComponent(outputFormat)}`
        // make ajax call
        $.ajax({
            url,
            method: "GET"
        })
            .then(function (response) {
                //console.log(response);
                const lines = response.split("\n");
                var lineNum, description, errorType, evidence;
                result = [];
                var errorFinished = false;
                $.each(lines, function (index, line) {
                    console.log(line);
                    if (line.indexOf("Warning") > -1) {
                        errorFinished = true;
                    }
                    if (line.indexOf("Line") > -1) {
                        //console.log(line);
                        const colonSplit = line.split(":");
                        const spaceSplit = colonSplit[1].split(" ");
                        lineNum = spaceSplit[1];
                        const splitForEvidence = colonSplit[1].split(lineNum);
                        console.log("lineNum = " + lineNum + "& evidence = " + evidence);
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
                        //console.log("description = " + description);
                        createAndPushErrorObject(lineNum, description, errorType, evidence)
                    }
                });
                renderResult();
            });
    };

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
        result.push(error);
    }

    /**
     * first clears the error div and then create a table presenting all errors and add it to relevant div
     */
    function renderResult() {
        removePreviouslyAppendedErrors();
        if (result && result.length) {
            const table = $("<table></table>");
            prepareErrorTableHead(table, result[0]);
            $.each(result, function(index, item) {
                const tableDataRow = $("<tr></tr>");
                // Print Javascript validator results object values
                tableDataRow.append($("<td></td>").text(item.lineNo));
                tableDataRow.append($("<td></td>").text(item.reason));
                tableDataRow.append($("<td></td>").text(item.severity));
                tableDataRow.append($("<td></td>").text(item.evidence));
                // Print HTML validator results object values
                // tableDataRow.append($("<td></td>").text(item.lastLine));
                // tableDataRow.append($("<td></td>").text(item.message));
                // tableDataRow.append($("<td></td>").text(item.type));
                // tableDataRow.append($("<td></td>").text(item.extract));
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
            $(errorTotal).on("click", function() {
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
            $(noErrorsFoundModal).on("click", function() {
                // set modal to hidden
                deactivateModal(noErrorsFoundModal);
            });
        }
    }

    /**
     * prepares head row for error table.
     * @param {table whose head row need to be prepared} table 
     * @param {object which need to be referred to prepare head row} errorObj 
     */
    function prepareErrorTableHead(table, errorObj) {
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