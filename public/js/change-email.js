var newEmailInput = document.getElementById("new-emailInput");

function gotoChangeAdminEmailPage(adminID) {
    window.location.assign("/change-admin-email.html");
    setAdminIDToChangeEmail(adminID);
}

//will display the data of the admin whose email will be changed
function displayAdminData_updateEmail() {
    //from database
    fetchAndDisplayAdminData_updateEmail();
}

var btnChangeEmail = document.getElementById("button-change-email");
btnChangeEmail.onclick = function () {
    changeEmail();
}

var btnCancelChangeEmail = document.getElementById("button-cancel-change-email");
btnCancelChangeEmail.onclick = function () {
    logoutAdminForChanges();
    removeAdminIDToChangeEmail();
    window.location.replace("/manage-admin.html");
}

function checkIfHasAdminToChangeEmail() {
    if (getAdminIDToUpdateEmail() == null) {
        window.location.assign("/manage-admin.html");
    }
}

//setting adminID for changing admin email
function setAdminIDToChangeEmail(adminID) {
    localStorage.setItem("adminID-changeEmail", adminID);
}

//getting the setted adminID for changing admin email
function getAdminIDToUpdateEmail() {
    return localStorage.getItem("adminID-changeEmail");
}

//removing the setted adminID for changing admin email
function removeAdminIDToChangeEmail() {
    localStorage.removeItem("adminID-changeEmail");
}

function changeEmail() {
    hideError();
    var newEmailInput = document.getElementById("new-emailInput");
    var newEmail = newEmailInput.value;

    if (validateInput(newEmail) == false) {
        showError("Please enter New Email");
        newEmailInput.style.border = '1px solid rgb(235, 72, 72)';
        return;
    }

    if (validateNewEmail(newEmail) == false) {
        showError("Email has an incorrect format");
        newEmailInput.style.border = '1px solid rgb(235, 72, 72)';
        return;
    }

    var adminToChangeEmail = secondAppAuth.currentUser;

    //will check if the email provided already exists in the system
    secondAppAuth.fetchSignInMethodsForEmail(newEmail)
        .then(function (signInMethods) {
            if (signInMethods.length < 1) {
                //if email is not existing (can proceed)
                var isEmailConfirmed = confirmNewEmail(newEmail);
                if (isEmailConfirmed == true) {

                    adminToChangeEmail.updateEmail(newEmail)
                        .then(() => {
                            //will change the email saved in the database
                            changeEmailInDatabase(adminToChangeEmail.uid, newEmail);
                            sendEmailVerificationToNewEmail(newEmail);
                        }).catch((error) => {
                            // An error occurred
                            window.alert(error.message);
                        });

                }
            } else {
                // focus on email textbox
                newEmailInput.focus();
                showError("Email already exists");
                newEmailInput.style.border = '1px solid rgb(235, 72, 72)';
            }
        })
        .catch(function (error) {
            var error_code = error.code;
            var error_message = error.message;

            if (error_code == "auth/email-already-in-use") {
                showError("Email already exists");
                newEmailInput.style.border = '1px solid rgb(235, 72, 72)';
            }
        });
}


function sendEmailVerificationToNewEmail(newEmail) {
    // code for send email verification to newly created email of landlord
    secondAppAuth.currentUser.sendEmailVerification()
        .then(() => {
            window.alert("Email Verification has been sent to email: " + newEmail + " Please check your email and click the link provided to authenticate the new email for the admin account.\n\nThank you!");
        })
        .catch((error) => {
            window.alert(error.message);
        });
}

function confirmNewEmail(newEmail) {
    var answer = window.confirm("We will send an email verification to the new email you have provided. Make sure that the email is existing.\n\nAre you sure you will use the new email " + newEmail + " for this admin account?");
    return answer;
}

// for input validations =============================

function validateNewEmail(newEmail) {
    var validRegex = /^[^@]+@\w+(\.\w+)+\w$/;
    if (validRegex.test(newEmail)) {
        return true;
    } else {
        return false;
    }
}

//will validate if there is an input or none
function validateInput(input) {
    if (input == null) {
        return false;
    }

    if (input.length <= 0) {
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

function hideError() {
    var samp = document.getElementById("error-container");
    //hide error box
    samp.style.display = "none";
    newEmailInput.style.border = '1px solid #777';
}