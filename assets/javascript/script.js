// when document is ready, allow functions to run
$(document).ready(function() {
    // call NumberedTextArea function and add numbers to the text
    $('#code-to-analyse').numberedtextarea();


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

    }

    function selectTheLanguageAPI(languageSelectedByUser, inputtedCodeToBeValidated) {
        if (languageSelectedByUser == "Javascript") {
            validateJavaScript(inputtedCodeToBeValidated);
            renderResult();
        } else if (languageSelectedByUser == "HTML") {
            validateHtml(inputtedCodeToBeValidated);
            renderResult();
        } else if (languageSelectedByUser == "CSS") {
            validateCss(inputtedCodeToBeValidated);
            renderResult();
        } else {
            // access appropriate modal div
            const noLanguageModal = $("#no-language-selected-modal")
                // display modal
            noLanguageModal.addClass("is-active");
            // when modal is clicked on 
            $(noLanguageModal).on("click", function() {
                // set modal to hidden
                noLanguageModal.removeClass("is-active");
            })
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
            });
        }
    }

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

    /**
     * prepares error object using input fields and push it to result array.
     * @param {line number where error is being reported} lineNum 
     * @param {error reason} reason 
     * @param {severity of error} severity 
     * @param {line number content} evidence 
     */
    function createAndPushErrorObject(lineNum, reason, severity, evidence) {
        const error = {};
        if (lineNum) {
            error['lineNo'] = lineNum;
        }
        if (reason) {
            error['reason'] = reason;
        }
        if (severity) {
            error['severity'] = severity;
        }
        if (evidence) {
            error['evidence'] = evidence;
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

>>>>>>> VC.30.10 added validate HTML function
        removePreviouslyAppendedErrors();
        if (result && result.length) {
            const table = $("<table></table>");
            prepareErrorTableHead(table, result[0]);
            $.each(result, function(index, item) {
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
            const errorTotal = $("#number-of-errors-found")
            // display modal
            errorTotal.addClass("is-active");
            // when modal is clicked on 
            $(errorTotal).on("click", function () {
                // set modal to hidden
                errorTotal.removeClass("is-active");
            });

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
            tableHead.append($("<th class='has-text-primary'></th>").text("Error Severity"));
        }
        if (errorObj.evidence) {
            tableHead.append($("<th class='has-text-primary'></th>").text("Code In Focus"));
        }

        table.append(tableHead);
    }

    // add event listener to click of 'validate' button  
    $("#validate-code").on("click", accesCodeToBeValidated)

    // add event listener to click of clear button 
    $("#clear-page").on("click", removePreviouslyAppendedErrors)
});