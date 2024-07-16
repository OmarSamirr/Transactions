//Global Variables
const Search = document.getElementById("search");
const Table = document.getElementById("tableData");
const canvas = document.getElementById("canvas");
const Warning = document.getElementById("warning");
let customers = [];
let transactions = [];
let customerTransactionHistory = [];

//Events
Search.addEventListener("input", () => {
  canvas.classList.add("d-none");
  getCustomers(Search.value);
});

//Top Level
getTransactions();

//API
async function getCustomers(searchParameter = "") {
  let data = await fetch(
    "https://omarsamirr.github.io/Transactions/customers.json"
  );
  customers = await data.json();
  customers = customers["customers"];
  showData(searchParameter);
}
async function getTransactions() {
  let data = await fetch(
    "https://omarsamirr.github.io/Transactions/transactions.json"
  );
  transactions = await data.json();
  transactions = transactions["transactions"];
  getCustomers();
}

//Functions
function showData(searchParameter) {
  let container = "";
  customers.forEach((customer) => {
    if (
      customer.name.toLowerCase().includes(searchParameter.toLowerCase()) ||
      `${getTransactionsTotal(customer.id)}` == searchParameter
    ) {
      container += `
          <tr onclick="renderChart(${customer.id})">
                  <td>${customer.name}</td>
                  <td>${getTransactionsTotal(customer.id)}</td>
                  <td><button class="btn btn-outline-primary">Show</button></td>
              </tr>
      `;
    }
  });
  if (container == "") {
    Warning.classList.remove("d-none");
  } else {
    Warning.classList.add("d-none");
  }
  Table.innerHTML = container;
}

function saveTransactions(customerID) {
  transactions.forEach((transaction) => {
    if (transaction.customer_id == customerID) {
      customerTransactionHistory.push(transaction);
    }
  });
}

function getTransactionsTotal(customerID) {
  let total = 0;
  transactions.forEach((transaction) => {
    if (transaction.customer_id == customerID) {
      total += transaction.amount;
    }
  });
  return total;
}

function renderChart(customerID) {
  //Arrays
  customerTransactionHistory = [];
  customerTransactionDates = [];
  customerTransactionAmounts = [];

  //get customer's Transactions
  saveTransactions(customerID);

  //sort transactions by date
  customerTransactionHistory.sort((a, b) => a.date.localeCompare(b.date));

  //push Dates and Amounts in new array
  customerTransactionHistory.forEach((transaction) => {
    customerTransactionDates.push(transaction.date);
    customerTransactionAmounts.push(transaction.amount);
  });

  //show Chart
  canvas.classList.remove("d-none");

  //chart font
  //   Chart.defaults.global.defaultFontFamily = 'monospace';
  Chart.defaults.global.defaultFontSize = 18;
  Chart.defaults.global.defaultFontColor = "#777";

  //render Chart
  let mychart = new Chart(canvas, {
    type: "line",
    data: {
      labels: customerTransactionDates,
      datasets: [
        {
          fill: false,
          label: "EGP",
          lineTension: 0.2,
          data: customerTransactionAmounts,
          backgroundColor: "rgba(13,110,253,0.7)",
          borderColor: "rgba(13,110,253,0.7)",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${customers[customerID - 1].name}'s Transaction History`,
        fontSize: 25,
      },
    },
  });
}