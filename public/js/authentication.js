// This is for the authentication of users (signup, login, logout, sending email verifications)

firstNameTextbox = document.getElementById('firstNameInput');
lastNameTextbox = document.getElementById('lastNameInput');
emailTextbox = document.getElementById('emailInput');
passwordTextbox = document.getElementById('passwordInput');

var isLoggingIn = false;

function signUp() {
    //get all input from user
    hideErrorInSignUp();
    var firstName = firstNameTextbox.value;
    var lastName = lastNameTextbox.value;
    var email = emailTextbox.value;
    var password = passwordTextbox.value;


    //check if inputs are empty
    if (isThereEmptyInput(firstName, lastName, email, password) != true) {
        //check email if is in correct format
        if (validateEmail(email) == true) {
            //check password if greater than 6 (firebaseauth accepts >= 6 password)
            if (validatePassword(password) == true) {
                // //will check first if the email provided already exists
                secondAppAuth.fetchSignInMethodsForEmail(email)
                    .then(function (signInMethods) {
                        if (signInMethods.length < 1) {
                            confirm
                            //if email is existing
                            var isEmailConfirmed = confirmEmail(email);
                            if (isEmailConfirmed === true) {
                                //creates user with email and password using the secondaryAppAuth
                                secondAppAuth.createUserWithEmailAndPassword(email, password)
                                    .then(function () {
                                        var newAdmin = secondAppAuth.currentUser;
                                        var newAdminID = newAdmin.uid;

                                        //create a new admin object and will save the user to the firestore database
                                        const adminObj = new Admin(newAdminID, firstName, lastName, email, password, 1);
                                        saveUserDataToDatabase(adminObj);

                                        //this will send an email verification to the email of the admin and then logout it here
                                        secondAppAuth.currentUser.sendEmailVerification()
                                            .then(() => {
                                                secondAppAuth.signOut().then(() => {
                                                    window.alert("An email verification has been sent to " + email + ". Please check your email and click the link provided to complete setting up the admin account.\n\nThank you!");
                                                    //for reload of admin list
                                                    window.location.reload();
                                                })
                                                    .catch(error => {
                                                        var error_code = error.code;
                                                        var error_message = error.message;

                                                        window.alert(error_code);
                                                    });
                                            })
                                            .catch(error => {
                                                var error_code = error.code;
                                                var error_message = error.message;

                                                window.alert(error_code);
                                            });


                                    })
                                    .catch(function (error) {
                                        var error_code = error.code;
                                        var error_message = error.message;

                                        if (error_code == "auth/email-already-in-use") {
                                            emailTextbox.focus();
                                            emailTextbox.style.border = '2px solid rgb(235, 72, 72)';
                                            showError("Email already exists");
                                        }
                                    });
                            } else {
                                // focus on email textbox
                                emailTextbox.focus();
                                emailTextbox.style.border = '2px solid rgb(235, 72, 72)';
                                window.alert("email has been denied");
                            }
                        } else {
                            emailTextbox.focus();
                            emailTextbox.style.border = '2px solid rgb(235, 72, 72)';
                            showError("Email already exists");
                        }
                    })
                    .catch(function (error) {
                        var error_code = error.code;
                        var error_message = error.message;

                        if (error_code == "auth/email-already-in-use") {
                            emailTextbox.focus();
                            emailTextbox.style.border = '2px solid rgb(235, 72, 72)';
                            showError("Email already exists");
                        }
                    });
            } else {
                passwordTextbox.focus();
                passwordTextbox.style.border = '2px solid rgb(235, 72, 72)';
                showError("Password must be greater than 6");
                return;
            }
        } else {
            emailTextbox.focus();
            emailTextbox.style.border = '2px solid rgb(235, 72, 72)';
            showError("Email has an incorrect format");
            return;
        }
    }

}


function login() {
    hideErrorInLogin();
    //get input from user
    emailTextBox = document.getElementById('email_field');
    passwordTextBox = document.getElementById('password_field');

    var email = emailTextBox.value;
    var password = passwordTextBox.value;

    if (isThereEmptyInLogin(email, password) != true) {
        if (isEmailInCorrectFormat(email) == true) {
            if (isPasswordGreaterThanOrEqualToSix(password)) {
                auth.signInWithEmailAndPassword(email, password)
                    .then(function () {
                        var user = auth.currentUser;
                        isLoggingIn = true;
                        var adminDocRef = database.collection("users").doc(user.uid);
                        adminDocRef.get().then((doc) => {
                            if (doc.exists) {
                                var userRole = doc.data().userRole
                                if (userRole == 0) {
                                    //go to super admin
                                    window.alert("Welcome Super Admin!");
                                    window.location.assign("/home.html");
                                    setIsSuperAdmin(true);
                                    loggedSuperAdmin = user;
                                } else if (userRole == 1) {
                                    //go to admin
                                    if (user.emailVerified === true) {
                                        window.alert("Welcome Admin!");
                                        setIsSuperAdmin(false);
                                        window.location.assign("/home.html");
                                    } else {
                                        window.alert("Your email is not yet verified. We have sent an email verification to " + email + " Please check your email and click the link provided to complete setting up your account\n\nThank you");
                                        logout();
                                    }

                                } else {
                                    //invalid access to other users with other codes
                                    showError("No admin with such credentials");
                                }

                            } else {
                                window.alert("No such document!");
                                //console.log("No such document!");
                            }
                        }).catch((error) => {
                            console.log("Error getting document:", error);
                        });
                    })
                    .catch(function (error) {
                        var error_code = error.code;
                        var error_message = error.message;

                        if (error_code == "auth/invalid-email") {
                            showError("Invalid Email");
                        } else if (error_code == "auth/wrong-password") {
                            showError("Incorrect Password");
                        } else if (error_code == "auth/user-not-found") {
                            showError("No admin with such credentials");
                        }

                    });
            } else {
                passwordTextBox.style.border = '2px solid rgb(235, 72, 72)';
                showError("Password is less than 6 characters");
            }
        } else {
            emailTextBox.style.border = '2px solid rgb(235, 72, 72)';
            showError("Email has an incorrect format");
        }
    }

}

function logout() {
    auth.signOut().then(() => {
        setIsSuperAdmin(false);
        removeIsSuperAdmin();
        window.alert("Logging out...");
        window.location.replace("/index.html");
    });
}

// for signup ============================================================================
function sendEmailVerification() {
    // code for send email verification to newly created email of landlord
    auth.currentUser.sendEmailVerification()
        .then(() => {
            window.alert("Verification has been sent to email: " + user.email);
        })
        .catch(error => {

        });
}


function isFirstNameEmpty(firstName) {
    if (firstName == null) {
        return true;
    }

    if (firstName.length <= 0) {
        return true;
    } else {
        return false;
    }
}

function isLastNameEmpty(lastName) {
    if (lastName == null) {
        return true;
    }

    if (lastName.length <= 0) {
        return true;
    } else {
        return false;
    }
}

function isEmailEmpty(email) {
    if (email == null) {
        return true;
    }

    if (email.length <= 0) {
        return true;
    } else {
        return false;
    }
}

function isPasswordEmpty(password) {
    if (password == null) {
        return true;
    }

    if (password.length <= 0) {
        return true;
    } else {
        return false;
    }
}

// ===============================================================================

auth.onAuthStateChanged(function (user) {
    if (user != null) {
        if (isLoggingIn == false) {
            if (window.location.pathname == "/public/index.html") {
                if (user != null) {
                    window.location.replace("/public/home.html");
                } else {
                    window.history.back();
                }

            }
        } else {
            //logging in
        }
    } else {
        if (window.location.pathname != "/public/index.html") {
            window.location.replace("/public/index.html");
        }
    }
});

function setIsSuperAdmin(isSuperAdmin) {
    localStorage.setItem("isSuperAdmin", isSuperAdmin);
}

function getIsSuperAdmin() {
    return localStorage.getItem("isSuperAdmin");
}

function removeIsSuperAdmin() {
    localStorage.removeItem("isSuperAdmin");
}

//for deleting and updating admin email, password
function loginAdminForChanges(email, password) {
    secondAppAuth.signInWithEmailAndPassword(email, password)
        .then(function () {
            //nothing will happen
        })
        .catch((error) => {
            window.alert(error);
        });
}

function logoutAdminForChanges() {
    secondAppAuth.signOut()
        .then(() => {
            //this will just logout the admin that is subject to changes
        })
        .catch((error) => {
            window.alert(error.message);
        });
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