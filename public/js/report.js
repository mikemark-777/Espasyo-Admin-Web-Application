// for testing downloading CSV or Excel file
var propertiesForImport = null;
var landlordsForImport = null;

//for tab manipulation =================================
var tabButtons = document.querySelectorAll(".tabContainer .buttonContainer button");
var tabPanels = document.querySelectorAll(".tabContainer  .tabPanel");

function showPanel(panelIndex) {
    tabButtons.forEach(function (node) {
        node.style.backgroundColor = "white";
        node.style.borderBottom = "";
        node.style.color = "#3E6565";
        node.style.fontWeight = "normal";
    });
    tabButtons[panelIndex].style.backgroundColor = "white";
    tabButtons[panelIndex].style.borderBottom = "5px solid #FF751F";
    tabButtons[panelIndex].style.color = "#273F3F";
    tabButtons[panelIndex].style.fontWeight = "bold";
    tabPanels.forEach(function (node) {
        node.style.display = "none";
    });
    tabPanels[panelIndex].style.display = "block";
    tabPanels[panelIndex].style.backgroundColor = "white";
    tabPanels[panelIndex].style.color = "black";


    if (panelIndex == 0) {
        showPropertyList();
    } else if (panelIndex == 1) {
        showLandlordList();
    }
}

// show property list
function showPropertyList() {
    fetchPropertyListInDatabase();
}

function showLandlordList() {
    fetchLandlordListInDatabase();
}

// for rendering the list of properties into the table ===============================

var propertiesTBody = document.getElementById('property-list-body');

function renderAllPropertiesToTable(properties, landlords) {

    propertiesForImport = properties;
    landlordsForImport = landlords;

    propertiesTBody.innerHTML = "";
    var count = 0;
    properties.forEach(property => {
        count = count + 1;
        renderPropertyToTable(count, property.name, property.owner, property.address, property.propertyType, landlords);
    })
}

function renderPropertyToTable(count, name, owner, address, type, landlords) {

    let trow = document.createElement("tr");
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    let td5 = document.createElement('td');


    td1.innerHTML = count;
    td2.innerHTML = name;
    td3.innerHTML = address;
    td4.innerHTML = type;

    landlords.forEach(function (landlord) {
        if (landlord.landlordID == owner) {
            td5.innerHTML = landlord.firstName + " " + landlord.lastName;
        }
    });

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    propertiesTBody.append(trow);
}


//for rendering the landlord list in the table==============================

var landlordsTBody = document.getElementById('landlord-list-body');

function renderAllLandlordsToTable(landlords) {
    landlordsTBody.innerHTML = "";
    var count = 0;
    landlords.forEach(landlord => {
        count = count + 1;
        renderLandlordToTable(count, landlord.firstName, landlord.lastName, landlord.email, landlord.phoneNumber);
    })
}

function renderLandlordToTable(count, firstName, lastName, email, phoneNumber) {

    let trow = document.createElement("tr");
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    let td5 = document.createElement('td');


    td1.innerHTML = count;
    td2.innerHTML = firstName;
    td3.innerHTML = lastName;
    td4.innerHTML = email;
    td5.innerHTML = "+63" + phoneNumber;

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    landlordsTBody.append(trow);
}

//testing if the properties has been loaded
function exportReportAsCSV() {
    if (propertiesForImport == null) {
        alert("Properties is still loading...");
    } else {

        var convertedArray = convertPropertyObjectToArray(propertiesForImport, landlordsForImport);

        var csv = 'Property Name, Address, Property Type, Landlord, Landlord PhoneNo.\n';
        convertedArray.forEach(function (row) {
            csv += row.join(',');
            csv += "\n";
        });

        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'Espasyo-Report-' + getExportDate() + '.csv';
        hiddenElement.click();
    }
}

function getExportDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return mm + '-' + dd + '-' + yyyy;
}

function convertPropertyObjectToArray(properties, landlords) {
    var count = 0;
    var convertedArray = [];

    properties.forEach(function (property) {

        var landlordName = "";
        var landlordPhoneNumber = "";
        landlords.forEach(function (landlord) {
            if (landlord.landlordID == property.owner) {
                landlordName = landlord.firstName + " " + landlord.lastName;
                landlordPhoneNumber = "0" + landlord.phoneNumber;
            }
        });

        //this will remove the commas of the address to not mistakenly convert by CSV converter as another column
        const addressWithoutComma = property.address.replace(/,/g, '');
        convertedArray[count] =
            [
                property.name,
                addressWithoutComma,
                property.propertyType,
                landlordName,
                landlordPhoneNumber
            ];
        count += 1;
    });

    return convertedArray;

}
