//navigate from manage-admin page to delete admin page
function gotoDeleteAdminPage(adminID) {
    window.location.assign("/delete-admin.html");
    setAdminIDToDelete(adminID);
}

//will display the data of the admin whose email will be changed
function displayAdminData_deleteAdmin() {
    //from database
    fetchAndDisplayAdminData_deleteAdmin();
}


var btnDeleteAccount = document.getElementById("button-delete-account");
btnDeleteAccount.onclick = function () {
    const adminToDelete = secondAppAuth.currentUser;
    adminToDelete.delete()
        .then(() => {
            deleteAdminData();
        })
        .catch((error) => {
            window.alert(error);
        });
};

var btnCancelDeleteAccount = document.getElementById("button-cancel-delete");
btnCancelDeleteAccount.onclick = function () {
    secondAppAuth.signOut().then(() => {
        removeAdminIDToDelete();
        logoutAdminForChanges();
        window.location.replace("/manage-admin.html");
    });
}

function checkIfHasAdminToDelete() {
    if (getAdminIDToDelete() == null) {
        window.location.assign("/manage-admin.html");
    }
}

//setting adminID for deleting admin account
function setAdminIDToDelete(adminID) {
    localStorage.setItem("adminID-delete", adminID);
}

//getting the setted adminID for deleting admin account
function getAdminIDToDelete() {
    return localStorage.getItem("adminID-delete");
}

//removing the setted adminID for deleting admin account
function removeAdminIDToDelete() {
    localStorage.removeItem("adminID-delete");
}