document.addEventListener("DOMContentLoaded", function () {
    // Retrieve data from local storage
    if (localStorage.getItem('incomeTaxData')) {
        incomeTaxData = JSON.parse(localStorage.getItem('incomeTaxData'));
    }

    // Display the table with the provided data
    displayIncomeTaxTable();

    // Display total income
    displayTotalIncome();

    //display rem money
    dismoneyleftover();
});

let incomeTaxData = [];

var maxCost = parseFloat(localStorage.getItem("maxCost")) || 3500.00;
document.getElementById("maxCost").innerText = maxCost.toFixed(2);

// Function to update the maximum cost in localStorage and return the updated value
function updateMaxCost() {
    var userInput = prompt("Enter new Maximum Cost:", maxCost.toFixed(2));

    if (userInput && !isNaN(userInput)) {
        localStorage.setItem("maxCost", userInput);
        maxCost = parseFloat(userInput);
        document.getElementById("maxCost").innerText = maxCost.toFixed(2);
        alert("Maximum Cost updated successfully!");
    } else {
        alert("Please enter a valid number for Maximum Cost.");
    }

    return maxCost;
}


//Add taxpayer
function addTaxpayer() {
    const taxpayerIDInput = prompt('Enter Serial No:');
    const taxpayerID = parseInt(taxpayerIDInput);

    // Validate taxpayer ID
    if (isNaN(taxpayerID) || taxpayerID <= 0) {
        alert('Please enter a valid positive Serial No.');
        return;
    }

    // Check if the entered taxpayer ID already exists
    if (incomeTaxData.some(taxpayer => taxpayer.TaxpayerID === taxpayerID)) {
        alert('Serial No already exists. Please enter a unique Serial No.');
        return;
    }

    const taxpayerName = document.getElementById('taxpayerName').value;
    const income = parseFloat(document.getElementById('income').value);
    if (isNaN(income) || income <= 0) {
        alert('Please enter a valid positive income amount.');
        return;
    }
    const remarks = document.getElementById('remarks').value;

    // Get user input for the date
    const userEnteredDate = document.getElementById('userEnteredDate').value;

    if (!isValidDate(userEnteredDate)) {
        alert('Please enter a valid date in the format YYYY-MM-DD.');
        return;
    }

    const taxpayer = {
        TaxpayerID: taxpayerID,
        TaxpayerName: taxpayerName,
        UniqueID: userEnteredDate,
        Income: income,
        Remarks: remarks,
    };

    incomeTaxData.push(taxpayer);

    // Save data to local storage
    localStorage.setItem('incomeTaxData', JSON.stringify(incomeTaxData));

    // Refresh the displayed table
    displayIncomeTaxTable();

    // Display total income
    displayTotalIncome();

    //rem money
    dismoneyleftover();
}

// Helper function to check if the entered date is valid
function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}

function calculateTotalIncome() {
    const totalIncome = incomeTaxData.reduce((sum, taxpayer) => sum + taxpayer.Income, 0);
    return totalIncome;
}

function displayTotalIncome() {
    const totalIncomeAmount = document.getElementById("totalIncomeAmount");
    const totalIncome = calculateTotalIncome();
    totalIncomeAmount.textContent = totalIncome.toFixed(2); // Display total income with two decimal places
}
//money left
function calmoneyleftover(){
    const rem =  maxCost - calculateTotalIncome();
    return rem;
}
function dismoneyleftover(){
    const rem = document.getElementById("monyleft");
    const reminder = calmoneyleftover();
    rem.textContent = reminder.toFixed(2);
}

function displayIncomeTaxTable() {
    const tableBody = document.querySelector("#taxationTable tbody");
    tableBody.innerHTML = "";

    // Sort the incomeTaxData array based on the UniqueID (date)
    incomeTaxData.sort((a, b) => new Date(a.UniqueID) - new Date(b.UniqueID));

    incomeTaxData.forEach((taxpayer, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = taxpayer.TaxpayerID;
        row.insertCell(1).textContent = taxpayer.TaxpayerName;
        row.insertCell(2).textContent = taxpayer.UniqueID;
        row.insertCell(3).textContent = taxpayer.Income.toFixed(2); // Display income with two decimal places
        row.insertCell(4).textContent = taxpayer.Remarks;
        row.insertCell(5).innerHTML = `<button onclick="editTaxpayer(${index})">Edit</button>`;
        row.insertCell(6).innerHTML = `<button onclick="deleteTaxpayer(${index})">Delete</button>`;
    });
}

function editTaxpayer(index) {
    // Populate the form with selected row's data for editing
    const selectedTaxpayer = incomeTaxData[index];
    document.getElementById('taxpayerName').value = selectedTaxpayer.TaxpayerName;
    document.getElementById('income').value = selectedTaxpayer.Income;
    document.getElementById('remarks').value = selectedTaxpayer.Remarks;

    // Calculate the TaxpayerID based on the maximum existing TaxpayerID
    const maxTaxpayerID = incomeTaxData.reduce((maxID, taxpayer) => Math.max(maxID, taxpayer.TaxpayerID), 0);

    // Assign the calculated TaxpayerID to the selected taxpayer
    selectedTaxpayer.TaxpayerID = maxTaxpayerID + 1;

    // Save the modified data to local storage
    localStorage.setItem('incomeTaxData', JSON.stringify(incomeTaxData));

    // Refresh the displayed table
    displayIncomeTaxTable();

    // Display total income
    displayTotalIncome();
}

function deleteTaxpayer(index) {
    // Remove the selected row from the array
    incomeTaxData.splice(index, 1);

    // Save the modified data to local storage
    localStorage.setItem('incomeTaxData', JSON.stringify(incomeTaxData));

    // Refresh the displayed table
    displayIncomeTaxTable();

    // Display total income
    displayTotalIncome();
}

// Function to clear all data from the table and local storage
function clearAllData() {
    incomeTaxData = [];
    localStorage.removeItem('incomeTaxData');
    displayIncomeTaxTable();
    displayTotalIncome();
}


