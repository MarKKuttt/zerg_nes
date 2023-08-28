$(document).ready(function () {
    // Prevent input in fields that have reached maximum length
    $("input[maxlength]").on("input", function (event) {
        var maxLength = parseInt($(this).attr("maxlength"));
        if ($(this).val().length >= maxLength) {
            event.preventDefault();
        }
    });

    // Limit the length of the name field to 30 characters
    $("input[name='username']").on("input", function (event) {
        var maxLength = 30;
        if ($(this).val().length >= maxLength) {
            $(this).val($(this).val().substring(0, maxLength));
        }
        updateSubmitButton();
    });

    // Limit the length of the email field to 30 characters
    $("input[name='email']").on("input", function (event) {
        var maxLength = 50;
        if ($(this).val().length >= maxLength) {
            $(this).val($(this).val().substring(0, maxLength));
        }
        updateSubmitButton();
    });

    // Limit the length of the comment field to 300 characters
    $("input[name='comment']").on("input", function (event) {
        var maxLength = 300;
        if ($(this).val().length >= maxLength) {
            $(this).val($(this).val().substring(0, maxLength));
        }
        updateSubmitButton();
    });

    // Function to check if input value matches allowed characters
    function isValidInput(value, allowedCharacters) {
        var regex = new RegExp("^[ " + allowedCharacters.replace('-', '\\-') + "]+$");

        return regex.test(value);
    }

    // Function to check if input is a valid email
    function isValidEmail(email) {
        var regex = /^[A-Za-z0-9][A-Za-z0-9_.-]*@[A-Za-z0-9.-]+[.][A-Za-z]{2,4}$/;
        return regex.test(email);
    }

    // Function to update submit button and field styling
    function updateSubmitButton() {
        var $submitButton = $("input[type='submit']");
        var $nameField = $("input[name='username']");
        var $emailField = $("input[name='email']");
        var $commentField = $("input[name='comment']");

        var nameValid = $nameField.val().length >= 2 && isValidInput($nameField.val(), "A-Za-zА-Яа-я0-9 -");
        var emailValid = isValidEmail($emailField.val());
        var commentValid = $commentField.val().length >= 2 && isValidInput($commentField.val(), "A-Za-zА-Яа-я0-9,.-_!? ");

        // Set button state and style
        if (nameValid && emailValid && commentValid) {
            $submitButton.prop("disabled", false).addClass("enabled");
        } else {
            $submitButton.prop("disabled", true).removeClass("enabled");
        }

        // Update field messages and styles
        updateFieldValidation($nameField, nameValid);
        updateFieldValidation($emailField, emailValid);
        updateFieldValidation($commentField, commentValid);
    }

    // Function to update field validation message and styling
    function updateFieldValidation($field, isValid) {
        var $messageSpan = $field.next(".msg");
        if ($field.val().length === 0) {
            $field.removeClass("invalid");
            $messageSpan.text("").removeClass("red green");
            return;
        }

        if (isValid) {
            $field.addClass("valid").removeClass("invalid");
            $messageSpan.text("Valid").addClass("green").removeClass("red");
        } else {
            $field.addClass("invalid").removeClass("valid");
            $messageSpan.text("Invalid input").addClass("red").removeClass("green");
        }
    }

    // Update fields and submit button on input change
    $("input[name='username'], input[name='email'], input[name='comment']").on("input", function () {
        updateSubmitButton();
    });

    // Prevent input in fields that have reached maximum length
    $("input[maxlength]").on("input", function (event) {
        var maxLength = parseInt($(this).attr("maxlength"));
        if ($(this).val().length >= maxLength) {
            event.preventDefault();
        }
    });

    // Allow only one "@" character in the email field
    $("input[name='email']").on("input", function () {
        var emailValue = $(this).val();
        var atIndex = emailValue.indexOf("@");
        if (atIndex !== -1) {
            var afterAt = emailValue.substring(atIndex + 1);
            if (afterAt.includes("@")) {
                afterAt = afterAt.replace("@", "");
                $(this).val(emailValue.substring(0, atIndex) + "@" + afterAt);
            }
        }
        
        updateSubmitButton();
    });
    
    // Allow only specified characters in the comment field
    $("input[name='comment']").on("input", function () {
        var commentValue = $(this).val();
        var validCharacters = /^[a-zA-Z0-9@,\.\-_!? ]*$/;

        
        updateSubmitButton();
    });

    // Form submission
    $("#comment-form").on("submit", function (event) {
        event.preventDefault();

        var form_data = $(this).serialize();

        $.ajax({
            type: "POST",
            url: $(this).attr("action"),
            data: form_data,
            success: function (response) {
                if (response.success) {
                    // Create HTML for the new comment
                    var commentHtml = `
                        <li>
                            <article class="comment">
                                <section class="comment-details">
                                    <div class="author-name">
                                        <h5><a>${response.username}</a></h5>
                                        <p>${response.created_at}</p>
                                    </div>
                                    <div class="comment-body">
                                        <p>${response.comment}</p>
                                    </div>
                                </section>
                            </article>
                        </li>
                    `;

                    // Append the new comment HTML to the comment list
                    $(".commentlist").prepend(commentHtml);

                    // Reset styles and enable submit button
                    $("#comment-form")[0].reset();
                    $(".msg").text("").removeClass("green red");
                    $("input").removeClass("invalid valid");
                    $("input[type='submit']").removeClass("enabled").prop("disabled", true);
                }
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            },
        });
    });
});
