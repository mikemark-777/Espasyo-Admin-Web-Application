var newPasswordInput = document.getElementById("new-passwordInput");
var confirmPasswordInput = document.getElementById("confirm-passwordInput");

function gotoChangeAdminPasswordPage(adminID) {
    window.location.assign("/change-admin-password.html");
    setAdminIDToChangePassword(adminID);
}

//will display the data of the admin whose password will be changed
function displayAdminData_updatePassword() {
    //from database
    fetchAndDisplayAdminData_updatePassword();
}

var btnChangePassword = document.getElementById("button-change-password");
btnChangePassword.onclick = function() {
    changePassword();
    // window.alert("Change password clicked");
}

var btnCancelChangePassword = document.getElementById("button-cancel-change-password");
btnCancelChangePassword.onclick = function() {
    logoutAdminForChanges();
    removeAdminIDToChangePassword();
    window.location.replace("/manage-admin.html");
}

function checkIfHasAdminToChangePassword() {
    if (getAdminIDToUpdatePassword() == null) {
        window.location.assign("/manage-admin.html");
    }
}

function changePassword() {

    hideError();
    var newPasswordInput = document.getElementById("new-passwordInput");
    var confirmPasswordInput = document.getElementById("confirm-passwordInput");
    var newPassword = newPasswordInput.value;
    var confirmPassword = confirmPasswordInput.value;

    if (isThereEmptyPasswordInput(newPassword, confirmPassword) != true) {
        if (arePasswordsValid(newPassword, confirmPassword) == true) {
            if (arePasswordsMatch(newPassword, confirmPassword) == true) {
                secondAppAuth.currentUser.updatePassword(newPassword)
                    .then(() => {
                        // Update successful
                        //change email in admin and users collection
                        var adminID = getAdminIDToUpdatePassword();
                        changePasswordInDatabase(adminID, newPassword);
                        removeAdminIDToChangePassword();
                    }).catch((error) => {
                        window.alert(error.message);
                    });
            }
        }
    }

}

// eyelash for confirm password =============================================================
var toggleNewPassword = document.getElementById("toggleNewPassword");
toggleNewPassword.onclick = function() {
    // toggle the type attribute
    var newPasswordInput = document.getElementById("new-passwordInput");
    const type = newPasswordInput.getAttribute("type") === "password" ? "text" : "password";
    newPasswordInput.setAttribute("type", type);

    // toggle the icon
    this.classList.toggle("bi-eye");
};

// eyelash for confirm password =============================================================
var toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
toggleConfirmPassword.onclick = function() {
    // toggle the type attribute
    var confirmPasswordInput = document.getElementById("confirm-passwordInput");
    const type = confirmPasswordInput.getAttribute("type") === "password" ? "text" : "password";
    confirmPasswordInput.setAttribute("type", type);

    // toggle the icon
    this.classList.toggle("bi-eye");
};



function isNewPasswordEmpty(newPassword) {
    if (newPassword == null) {
        return true;
    }

    if (newPassword.length <= 0) {
        return true;
    } else {
        return false;
    }
}

function isConfirmPasswordEmpty(confirmPassword) {
    if (confirmPassword == null) {
        return true;
    }

    if (confirmPassword.length <= 0) {
        return true;
    } else {
        return false;
    }
}

function isThereEmptyPasswordInput(newPassword, confirmPassword) {

    if (isNewPasswordEmpty(newPassword) == true && isConfirmPasswordEmpty(confirmPassword) == true) {
        newPasswordInput.style.border = '1px solid rgb(235, 72, 72)';
        confirmPasswordInput.style.border = '1px solid rgb(235, 72, 72)';
        showError("New Password and Confirm Password are Empty");
        return true;
    } else {
        if (isNewPasswordEmpty(newPassword) == true) {
            newPasswordInput.style.border = '1px solid rgb(235, 72, 72)';
            showError("New Password is Empty");
            return true;
        }

        if (isConfirmPasswordEmpty(confirmPassword) == true) {
            confirmPasswordInput.style.border = '1px solid rgb(235, 72, 72)';
            showError("Confirm Password is Empty");
            return true;
        }

    }

}

function validatePassword(password) {
    if (password.length < 6) {
        return false;
    } else {
        return true;
    }
}

function arePasswordsValid(newPassword, confirmPassword) {
    if (validatePassword(newPassword) == true) {
        if (validatePassword(confirmPassword) == true) {
            return true;
        } else {
            confirmPasswordInput.style.border = '1px solid rgb(235, 72, 72)';
            showError("Confirm Password is less than 6 characters");
            //must highlight the password box
            return false;
        }
    } else {
        newPasswordInput.style.border = '1px solid rgb(235, 72, 72)';
        showError("New Password is less than 6 characters");
        return false;
    }
}

function arePasswordsMatch(newPassword, confirmPassword) {
    if (newPassword === confirmPassword) {
        return true;
    } else {
        showError("Passwords not match");
        newPasswordInput.style.border = '1px solid rgb(235, 72, 72)';
        confirmPasswordInput.style.border = '1px solid rgb(235, 72, 72)';
        return false;
    }
}


//setting adminID for changing admin password
function setAdminIDToChangePassword(adminID) {
    localStorage.setItem("adminID-changePassword", adminID);
}

//getting the setted adminID for changing admin password
function getAdminIDToUpdatePassword() {
    return localStorage.getItem("adminID-changePassword");
}

//removing the setted adminID for changing admin password
function removeAdminIDToChangePassword() {
    localStorage.removeItem("adminID-changePassword");
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
    newPasswordInput.style.border = '1px solid #777';
    confirmPasswordInput.style.border = '1px solid #777';
}