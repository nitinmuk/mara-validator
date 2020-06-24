// when document is ready, allow functions to run
$(document).ready(function() {
    // call NumberedTextArea function and add numbers to the text
    $('#code-to-analyse').numberedtextarea();

<<<<<<< HEAD
=======

>>>>>>> d85be5b05bb50041f2a3a65b6209f1eb43882bfe
    var result = [];

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
            noCodeModal.addClass("is-active");
            // on click of modal
            $(noCodeModal).on("click", function() {
                // set to hidden
                noCodeModal.removeClass("is-active");
            });
            // exit function - if no code is entered, do not continue
            return;
        }

        // create a new variable containing the selected language from dropdown 
        var languageSelectedByUser = $("#language-selected :selected").val();
        selectTheLanguageAPI(languageSelectedByUser, inputtedCodeToBeValidated);
<<<<<<< HEAD
    }

=======

    }

>>>>>>> d85be5b05bb50041f2a3a65b6209f1eb43882bfe
    function selectTheLanguageAPI(languageSelectedByUser, inputtedCodeToBeValidated) {
        if (languageSelectedByUser == "Javascript") {
            validateJavaScript(inputtedCodeToBeValidated);
            renderResult();
        } else if (languageSelectedByUser == "HTML") {
            validateHtml(inputtedCodeToBeValidated);
            renderResult();
        } else if (languageSelectedByUser == "CSS") {
            validateCss(inputtedCodeToBeValidated);
<<<<<<< HEAD
            renderResult();
        } else {
            // access appropriate modal div
            const noLanguageModal = $("#no-language-selected-modal");
            // display modal
=======
            console.log("call CSS API")
        } else {
            // access appropriate modal div
            const noLanguageModal = $("#no-language-selected-modal")
                // display modal
>>>>>>> d85be5b05bb50041f2a3a65b6209f1eb43882bfe
            noLanguageModal.addClass("is-active");
            // when modal is clicked on 
            $(noLanguageModal).on("click", function() {
                // set modal to hidden
                noLanguageModal.removeClass("is-active");
<<<<<<< HEAD
            });
=======
            })
>>>>>>> d85be5b05bb50041f2a3a65b6209f1eb43882bfe
        }
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
<<<<<<< HEAD
            });
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
                console.log(result);
                const errors = result.messages;
                console.log(errors);
                result = [];
                if (errors && errors.length) {
                    $.each(errors, function(index, item) {
                        createAndPushErrorObject(item.lastLine, item.message, item.type, item.extract);
                    });
                }
            },
        });
    }

    function validateCss(inputtedCodeToBeValidated) {
        const outputFormat = "text/plain";
        const url = `https://cors-anywhere.herokuapp.com/http://jigsaw.w3.org/css-validator/validator?text=${encodeURIComponent(inputtedCodeToBeValidated)}&warning=0&profile=css2&output=${encodeURIComponent(outputFormat)}`;
        // make ajax call
        $.ajax({
                url,
                method: "GET"
            })
            .then(function(response) {
                console.log(response);
            });
=======

            });
        }
>>>>>>> d85be5b05bb50041f2a3a65b6209f1eb43882bfe
    }

    /**
     * prepares error object using input fields and push it to result array.
<<<<<<< HEAD
     * @param {line number where error is being reported} lineNum 
     * @param {error reason or message} reason 
     * @param {severity or type of error} severity 
     * @param {line of code that has error} evidence 
     */
=======
     * @Javascript Validator:
     * @param {line number where error is being reported} lineNum 
     * @param {error reason} reason 
     * @param {severity of error} severity 
     * @param {line number content} evidence      
     */
    // function createAndPushErrorObject(lineNum, reason, severity, evidence)
>>>>>>> d85be5b05bb50041f2a3a65b6209f1eb43882bfe
    function createAndPushErrorObject(lineNum, reason, severity, evidence) {
        const error = {};
        if (lineNum) {
            error['lineNo'] = lineNum;
<<<<<<< HEAD
        } else if (lineNum) {
            error['lastLine'] = lineNum;
        }
        if (reason) {
            error['reason'] = reason;
        } else if (reason) {
=======
            error['lastline'] = lineNum;
        }
        if (reason) {
            error['reason'] = reason;
>>>>>>> d85be5b05bb50041f2a3a65b6209f1eb43882bfe
            error['message'] = reason;
        }
        if (severity) {
            error['severity'] = severity;
<<<<<<< HEAD
        } else if (severity) {
=======
>>>>>>> d85be5b05bb50041f2a3a65b6209f1eb43882bfe
            error['type'] = severity;
        }
        if (evidence) {
            error['evidence'] = evidence;
<<<<<<< HEAD
        } else if (evidence) {
=======
>>>>>>> d85be5b05bb50041f2a3a65b6209f1eb43882bfe
            error['extract'] = evidence;
        }
        result.push(error);
    }

    /**
     * first clears the error div and then create a table presenting all errors and add it to relevant div
     */
    function renderResult() {
<<<<<<< HEAD
=======
        // access modal content for number of errors found and set error count to result.lenght
        $("#total-errors-here").text(result.length);
        // access appropriate "number of errors" modal 
        const errorTotal = $("#number-of-errors-found")
            // display modal
        errorTotal.addClass("is-active");
        // when modal is clicked on 
        $(errorTotal).on("click", function() {
            // set modal to hidden
            errorTotal.removeClass("is-active");
        });
>>>>>>> d85be5b05bb50041f2a3a65b6209f1eb43882bfe

        removePreviouslyAppendedErrors();
        if (result && result.length) {
            const table = $("<table></table>");
            prepareErrorTableHead(table, result[0]);
            $.each(result, function(index, item) {
                const tableDataRow = $("<tr></tr>");
<<<<<<< HEAD
                // Print Javascript validator results object values
=======
>>>>>>> d85be5b05bb50041f2a3a65b6209f1eb43882bfe
                tableDataRow.append($("<td></td>").text(item.lineNo));
                tableDataRow.append($("<td></td>").text(item.reason));
                tableDataRow.append($("<td></td>").text(item.severity));
                tableDataRow.append($("<td></td>").text(item.evidence));
<<<<<<< HEAD
                // Print HTML validator results object values
                tableDataRow.append($("<td></td>").text(item.lastLine));
=======
                tableDataRow.append($("<td></td>").text(item.lastline));
>>>>>>> d85be5b05bb50041f2a3a65b6209f1eb43882bfe
                tableDataRow.append($("<td></td>").text(item.message));
                tableDataRow.append($("<td></td>").text(item.type));
                tableDataRow.append($("<td></td>").text(item.extract));
                table.append(tableDataRow);
            });
            $("#append-errors-here").append(table);
<<<<<<< HEAD
            // access modal content for number of errors found and set error count to result.lenght
            $("#total-errors-here").text(result.length);
            // access appropriate "number of errors" modal 
            const errorTotal = $("#number-of-errors-found")
                // display modal
            errorTotal.addClass("is-active");
            // when modal is clicked on 
            $(errorTotal).on("click", function() {
                // set modal to hidden
                errorTotal.removeClass("is-active");
            });
=======
>>>>>>> d85be5b05bb50041f2a3a65b6209f1eb43882bfe

        } else {
            // access appropriate modal div
            const noErrorsFoundModal = $("#no-errors-found")
                // display modal
            noErrorsFoundModal.addClass("is-active");
            // when modal is clicked on 
            $(noErrorsFoundModal).on("click", function() {
                // set modal to hidden
                noErrorsFoundModal.removeClass("is-active");
            })
        }
    }

    /**
<<<<<<< HEAD
     * prepares head row for error table.
     * @param {table whose head row need to be prepared} table 
     * @param {object which need to be referred to prepare head row} errorObj 
     */
    function prepareErrorTableHead(table, errorObj) {
        const tableHead = $("<tr></tr>");
        if (errorObj.lineNo || errorObj.lastLine) {
            tableHead.append($("<th class='has-text-primary'></th>").text("Line No."));
        }
        if (errorObj.reason || errorObj.message) {
            tableHead.append($("<th class='has-text-primary'></th>").text("Error Description"));
        }
        if (errorObj.severity || errorObj.type) {
            tableHead.append($("<th class='has-text-primary'></th>").text("Error Type"));
        }
        if (errorObj.evidence || errorObj.extract) {
=======
     * preaprs head row for error table.
     * @param {table whose head row need to be prepared} table 
     * @param {object which need to be referred to preare head row} errorObj 
     */
    function prepareErrorTableHead(table, errorObj) {
        const tableHead = $("<tr></tr>");
        if (errorObj.lineNo) {
            tableHead.append($("<th class='has-text-primary'></th>").text("Line No."));
        }
        if (errorObj.reason) {
            tableHead.append($("<th class='has-text-primary'></th>").text("Error Description"));
        }
        if (errorObj.severity) {
            tableHead.append($("<th class='has-text-primary'></th>").text("Error Type"));
        }
        if (errorObj.evidence) {
>>>>>>> d85be5b05bb50041f2a3a65b6209f1eb43882bfe
            tableHead.append($("<th class='has-text-primary'></th>").text("Code In Focus"));
        }
        table.append(tableHead);
    }

<<<<<<< HEAD
=======
    // HTML Validation function
    function validateHtml(html) {

        // emulate form post
        var formData = new FormData();
        formData.append('out', 'json');
        formData.append('content', html);

        // make ajax call
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/https://html5.validator.nu/",
            data: formData,
            dataType: "json",
            type: "POST",
            processData: false,
            contentType: false,
            success: function(data) {
                console.log(data.messages);
            },
            error: function() {
                console.warn(arguments);
            }
        });
    }

    function validateCss(inputtedCodeToBeValidated) {
        const outputFormat = "text/plain"
        const url = `https://cors-anywhere.herokuapp.com/http://jigsaw.w3.org/css-validator/validator?text=${encodeURIComponent(inputtedCodeToBeValidated)}&warning=0&profile=css2&output=${encodeURIComponent(outputFormat)}`
            // make ajax call
        $.ajax({
                url,
                method: "GET"
            })
            .then(function(response) {
                console.log(response);
            });
    };

>>>>>>> d85be5b05bb50041f2a3a65b6209f1eb43882bfe
    // add event listener to click of 'validate' button  
    $("#validate-code").on("click", accesCodeToBeValidated);

    // add event listener to click of clear button 
    $("#clear-page").on("click", removePreviouslyAppendedErrors)
});