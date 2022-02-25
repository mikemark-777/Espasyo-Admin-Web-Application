firstNameTextbox = document.getElementById('firstNameInput');
lastNameTextbox = document.getElementById('lastNameInput');
emailTextbox = document.getElementById('emailInput');
passwordTextbox = document.getElementById('passwordInput');

function isThereEmptyInput(firstName, lastName, email, password) {
    //check if inputs are empty
    if (isFirstNameEmpty(firstName) == true && isLastNameEmpty(lastName) == true && isEmailEmpty(email) == true && isPasswordEmpty(password) == true) {
        firstNameTextbox.style.border = '2px solid rgb(235, 72, 72)';
        lastNameTextbox.style.border = '2px solid rgb(235, 72, 72)';
        emailTextbox.style.border = '2px solid rgb(235, 72, 72)';
        passwordTextbox.style.border = '2px solid rgb(235, 72, 72)';
        showError("Please fill out everything");
        return true;
    } else {
        if (isFirstNameEmpty(firstName) == true) {
            firstNameTextbox.style.border = '2px solid rgb(235, 72, 72)';
            showError("Please enter first name");
            return true;
        }

        if (isLastNameEmpty(lastName) == true) {
            lastNameTextbox.style.border = '2px solid rgb(235, 72, 72)';
            showError("Please enter last name");
            return true;
        }

        if (isEmailEmpty(email) == true) {
            emailTextbox.style.border = '2px solid rgb(235, 72, 72)';
            showError("Please enter email");
            return true;
        }

        if (isPasswordEmpty(password) == true) {
            passwordTextbox.style.border = '2px solid rgb(235, 72, 72)';
            showError("Please enter password");
            return true;
        }
    }
}

function validateEmail(email) {
    var validRegex = /^[^@]+@\w+(\.\w+)+\w$/;
    if (validRegex.test(email)) {
        return true;
    } else {
        return false;
    }
}


function validatePassword(password) {
    if (password.length < 6) {
        return false;
    } else {
        return true;
    }
}

function confirmEmail(email) {
    var answer = window.confirm("We will send an email verification to the email you have provided. Make sure that the email is existing.\n\nAre you sure you will use the email " + email + " for this new admin account?");
    return answer;
}

//for errors
function showError(error_message) {
    var samp = document.getElementById("error-container");
    //show error box
    samp.style.display = "block";
    samp.innerText = error_message;
}

function hideErrorInSignUp() {
    var samp = document.getElementById("error-container");
    //hide error box
    samp.style.display = "none";
    firstNameTextbox.style.border = '1px solid #777';
    lastNameTextbox.style.border = '1px solid #777';
    emailTextbox.style.border = '1px solid #777';
    passwordTextbox.style.border = '1px solid #777';
}