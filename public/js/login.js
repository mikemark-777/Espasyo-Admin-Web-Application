emailLoginTextbox = document.getElementById('email_field');
passwordLoginTextbox = document.getElementById('password_field');

function isThereEmptyInLogin(email, password) {
    //check if inputs are empty
    if (isEmailLoginEmpty(email) == true && isPasswordLoginEmpty(password) == true) {
        emailLoginTextbox.style.border = '2px solid rgb(235, 72, 72)';
        passwordLoginTextbox.style.border = '2px solid rgb(235, 72, 72)';
        showError("Please fill out everything");
        return true;
    } else {

        if (isEmailLoginEmpty(email) == true) {
            emailLoginTextbox.style.border = '2px solid rgb(235, 72, 72)';
            showError("Please enter email");
            return true;
        }

        if (isPasswordLoginEmpty(password) == true) {
            passwordLoginTextbox.style.border = '2px solid rgb(235, 72, 72)';
            showError("Please enter password");
            return true;
        }
    }
}

function isEmailLoginEmpty(email) {
    if (email == null) {
        return true;
    }

    if (email.length <= 0) {
        return true;
    } else {
        return false;
    }
}

function isPasswordLoginEmpty(password) {
    if (password == null) {
        return true;
    }

    if (password.length <= 0) {
        return true;
    } else {
        return false;
    }
}

function isEmailInCorrectFormat(email) {
    var validRegex = /^[^@]+@\w+(\.\w+)+\w$/;
    if (validRegex.test(email)) {
        return true;
    } else {
        return false;
    }
}

function isPasswordGreaterThanOrEqualToSix(password) {
    if (password.length < 6) {
        passwordLoginTextbox.style.border = '2px solid rgb(235, 72, 72)';
        return false;
    } else {
        return true;
    }
}


//for errors
function showError(error_message) {
    var samp = document.getElementById("error-container");
    //show error box
    samp.style.display = "block";
    samp.innerText = error_message;
}

function hideErrorInLogin() {
    var samp = document.getElementById("error-container");
    //hide error box
    samp.style.display = "none";
    emailLoginTextbox.style.border = '1px solid #777';
    passwordLoginTextbox.style.border = '1px solid #777';
}