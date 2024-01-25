let balance;
let zelleBalance;
let binanceBalance;
let cashBalance;
let income;
let expense;
let transHistory;
let balanceDistChart;
let incExpChart;

//Transaction wrapper

const transactionUI = document.querySelector(".trans-wrapper");

//Spans from DOM where the app amounts are displayed.
const balanceUI = document.querySelector(".balance-amount");
const zelleUI = document.querySelector(".zelle-amount");
const binanceUI = document.querySelector(".binance-amount");
const cashUI = document.querySelector(".cash-amount");

//Income form DOM inputs.

const incDetailsUI = document.querySelector(".income-details");
const incAmountUI = document.querySelector(".income-amount");
const incDateUI = document.querySelector(".income-date");
const incPlatformUI = document.querySelector(".income-platform");
const incButtonUI = document.querySelector(".add-income");

//Expense form DOM inputs.

const expDetailsUI = document.querySelector(".expense-details");
const expAmountUI = document.querySelector(".expense-amount");
const expDateUI = document.querySelector(".expense-date");
const expPlatformUI = document.querySelector(".expense-platform");
const expButtonUI = document.querySelector(".add-expense");

//Delete history buttons (not created yet at this point, will use a function to update them at the bottom)

let deleteHistoryButtonsUI;

//Charts wrappers to hide and unhide them

const balanceChartUI = document.querySelector(".balanceChartWrapper");
const incExpChartUI = document.querySelector(".incExpChartWrapper");

//Charts buttons to unhide the clicked one and hide the rest

const balanceChartBtn = document.querySelector(".balance-distribution-btn");
const incExpChartBtn = document.querySelector(".income-expense-btn");

//Create new transaction function

const createTransaction = function (details, amount, date, platform, type) {
  let borderType;

  if (type === "income") {
    borderType = `border border-green-500`;
  } else {
    borderType = `border border-red-500`;
  }

  const HTML = `<div class="history-detailed flex flex-row items-center justify-between mx-auto text-white">
      <div class="w-2/12">
        <i class="fa-solid fa-trash text-white delete-history cursor-pointer"></i>
      </div>
      <div class="w-11/12 history-detail bg-gray-700 rounded ${borderType}">
        <div class="flex flex-col font-normal">
          <p class="px-4 py-3 flex flex-row justify-between"><span class="underlined font-bold">Details: </span>${details}</p>
          <hr class="border-gray-500">
          <p class="px-4 py-3 flex flex-row justify-between"><span class="underlined font-bold">Platform: </span>${platform}</p>
          <hr class="border-gray-500">
          <p class="px-4 py-3 flex flex-row justify-between"><span class="underlined font-bold">Date: </span>${date}</p>
          <hr class="border-gray-500">
          <p class="px-4 py-3 flex flex-row justify-between"><span class="underlined font-bold">Amount: </span>${
            "$" + amount
          }</p>
        </div>
      </div>
    </div>`;

  const transaction = document.createElement("div");

  transaction.innerHTML = HTML;

  transHistory.push({
    Amount: amount,
    Transaction: transaction.innerHTML,
    Platform: platform,
    Type: type,
  });

  transactionUI.appendChild(transaction);

  //Updates the delete buttons and adds event listener after adding a new transaction to be able to delete them.
  updateDeleteButtons();
  addEventToDeleteButtons();
};

//Loads local storage data.

const loadLocalStorage = function () {
  balance = JSON.parse(localStorage.getItem("Balance")) || 0;
  zelleBalance = JSON.parse(localStorage.getItem("Zelle")) || 0;
  binanceBalance = JSON.parse(localStorage.getItem("Binance")) || 0;
  cashBalance = JSON.parse(localStorage.getItem("Cash")) || 0;
  income = JSON.parse(localStorage.getItem("Income")) || 0;
  expense = JSON.parse(localStorage.getItem("Expense")) || 0;
  transHistory = JSON.parse(localStorage.getItem("History")) || [];
};

//First load when app runs.
loadLocalStorage();

//Load history UI on app run

const loadHistory = function () {
  for (i = 0; i < transHistory.length; i++) {
    const loadedTransaction = document.createElement("div");
    loadedTransaction.innerHTML = transHistory[i].Transaction;
    transactionUI.appendChild(loadedTransaction);
  }
};

loadHistory();

//Saves / updates local storage data.

const saveLocalStorage = function () {
  localStorage.setItem("Balance", JSON.stringify(balance));
  localStorage.setItem("Zelle", JSON.stringify(zelleBalance));
  localStorage.setItem("Binance", JSON.stringify(binanceBalance));
  localStorage.setItem("Cash", JSON.stringify(cashBalance));
  localStorage.setItem("Income", JSON.stringify(income));
  localStorage.setItem("Expense", JSON.stringify(expense));
  localStorage.setItem("History", JSON.stringify(transHistory));
};

//Updates balance UI

const updateBalanceUI = function () {
  balanceUI.textContent = balance;
  zelleUI.textContent = zelleBalance;
  binanceUI.textContent = binanceBalance;
  cashUI.textContent = cashBalance;
};

//First UI update when app runs.
updateBalanceUI();

//Update balance function to re-utilize in addIncome and addExpense functions to not repeat ourselves

const updateBalance = function (amount, type) {
  if (type === "income") {
    balance += amount;
  } else if (type === "expense") {
    balance -= amount;
  }
  saveLocalStorage();
  updateBalanceUI();
};

//Add income function

const addIncome = function (details, amount, date, platform) {
  const type = "income";
  amount = parseInt(amount);
  income += amount;
  switch (platform) {
    case "Zelle":
      zelleBalance += amount;
      createTransaction(details, amount, date, platform, type);
      updateBalance(amount, type);
      break;
    case "Binance":
      binanceBalance += amount;
      createTransaction(details, amount, date, platform, type);
      updateBalance(amount, type);
      break;
    case "Cash":
      cashBalance += amount;
      createTransaction(details, amount, date, platform, type);
      updateBalance(amount, type);
      break;
  }
};

//Add expense function

const addExpense = function (details, amount, date, platform) {
  const type = "expense";
  amount = parseInt(amount);
  expense += amount;
  switch (platform) {
    case "Zelle":
      zelleBalance -= amount;
      createTransaction(details, amount, date, platform, type);
      updateBalance(amount, type);
      break;
    case "Binance":
      binanceBalance -= amount;
      createTransaction(details, amount, date, platform, type);
      updateBalance(amount, type);
      break;
    case "Cash":
      cashBalance -= amount;
      createTransaction(details, amount, date, platform, type);
      updateBalance(amount, type);
      break;
  }
};

//Event listener for the add income form.

incButtonUI.addEventListener("click", function () {
  addIncome(
    incDetailsUI.value,
    incAmountUI.value,
    incDateUI.value,
    incPlatformUI.value
  );

  //Updates the balance distribution chart
  balanceDistChart = updateChart(
    balanceDistChart,
    [zelleBalance, binanceBalance, cashBalance],
    ["#7123D4", "#F1BB13", "#6a8649"],
    "balanceDistChart"
  );

  //Updates the income and expenses chart

  incExpChart = updateChart(
    incExpChart,
    [income, expense],
    ["#22C55E", "#EF4444"],
    "incExpChart"
  );

  incDetailsUI.value = "";
  incAmountUI.value = "";
  incDateUI.value = "";
  incPlatformUI.selectedIndex = 0;
});

//Event listener for the add expense form.

expButtonUI.addEventListener("click", function () {
  addExpense(
    expDetailsUI.value,
    expAmountUI.value,
    expDateUI.value,
    expPlatformUI.value
  );

  //Updates the balance distribution chart
  balanceDistChart = updateChart(
    balanceDistChart,
    [zelleBalance, binanceBalance, cashBalance],
    ["#7123D4", "#F1BB13", "#6a8649"],
    "balanceDistChart",
    ["Zelle", "Binance", "Cash"]
  );

  expDetailsUI.value = "";
  expAmountUI.value = "";
  expDateUI.value = "";
  expPlatformUI.selectedIndex = 0;
});

//Function to update delete history buttons

const updateDeleteButtons = function () {
  deleteHistoryButtonsUI = document.querySelectorAll(".delete-history");
};

updateDeleteButtons();

//Event listener for the delete history buttons

const addEventToDeleteButtons = function () {
  deleteHistoryButtonsUI.forEach((button) => {
    button.addEventListener("click", function (e) {
      //Removes the element from the DOM
      e.target.parentElement.parentElement.parentElement.remove();
      for (i = 0; i < transHistory.length; i++) {
        const targetElement =
          e.target.parentElement.parentElement.parentElement.innerHTML;
        const transHistoryElement = transHistory[i].Transaction;
        if (targetElement === transHistoryElement) {
          //If it's an income being deleted balance needs to be subtracted back
          if (transHistory[i].Type === "income") {
            //Checks which platform to subtract from
            income -= transHistory[i].Amount;
            balance -= transHistory[i].Amount;
            switch (transHistory[i].Platform) {
              case "Zelle":
                zelleBalance -= transHistory[i].Amount;
                updateBalanceUI();
                break;
              case "Binance":
                binanceBalance -= transHistory[i].Amount;
                updateBalanceUI();
                break;
              case "Cash":
                cashBalance -= transHistory[i].Amount;
                updateBalanceUI();
                break;
            }
            //If it's an expense being deleted balance needs to be added back
          } else if (transHistory[i].Type === "expense") {
            expense -= transHistory[i].Amount;
            balance += transHistory[i].Amount;
            switch (transHistory[i].Platform) {
              case "Zelle":
                zelleBalance += transHistory[i].Amount;
                updateBalanceUI();
                break;
              case "Binance":
                binanceBalance += transHistory[i].Amount;
                updateBalanceUI();
                break;
              case "Cash":
                cashBalance += transHistory[i].Amount;
                updateBalanceUI();
                break;
            }
          }
          //Removes the element from the trans history array and updates local storage to remove it from there.
          const index = transHistory.indexOf(transHistory[i]);
          transHistory.splice(index, 1);
          saveLocalStorage();
        }
      }
      //Updates the balance distribution chart

      balanceDistChart = updateChart(
        balanceDistChart,
        [zelleBalance, binanceBalance, cashBalance],
        ["#7123D4", "#F1BB13", "#6a8649"],
        "balanceDistChart",
        ["Zelle", "Binance", "Cash"]
      );
      //Updates the income and expenses chart

      incExpChart = updateChart(
        incExpChart,
        [income, expense],
        ["#22C55E", "#EF4444"],
        "incExpChart"
      );
      //Updates the delete buttons after removing one
      updateDeleteButtons();
    });
  });
};

//Add event listener to delete buttons
addEventToDeleteButtons();

//Chart JS code

const runGraph = function (data, id, colors) {
  const ctx = document.getElementById(id);

  let balanceDistChart = new Chart(ctx, {
    type: "pie",
    data: {
      datasets: [
        {
          data: data,
          borderWidth: 1,
          backgroundColor: colors,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
  return balanceDistChart;
};

const updateChart = function (chart, data, colors, id) {
  //Updates the distribution chart after destroying the current one
  chart.destroy();
  chart = runGraph(data, id, colors);
  return chart;
};

// Balance distribution chart first run
balanceDistChart = runGraph(
  [
    JSON.parse(localStorage.getItem("Zelle")),
    JSON.parse(localStorage.getItem("Binance")),
    JSON.parse(localStorage.getItem("Cash")),
  ],
  "balanceDistChart",
  ["#7123D4", "#F1BB13", "#6a8649"]
);

incExpChart = runGraph(
  [
    JSON.parse(localStorage.getItem("Income")),
    JSON.parse(localStorage.getItem("Expense")),
  ],
  "incExpChart",
  ["#22C55E", "#EF4444"]
);

//Event listener for chart buttons

balanceChartBtn.addEventListener("click", function () {
  balanceChartUI.classList.forEach((classFound) => {
    if (classFound === "hidden") {
      balanceChartUI.classList.remove("hidden");
      incExpChartUI.classList.add("hidden");
    }
  });
});

incExpChartBtn.addEventListener("click", function () {
  incExpChartUI.classList.forEach((classFound) => {
    if (classFound === "hidden") {
      incExpChartUI.classList.remove("hidden");
      balanceChartUI.classList.add("hidden");
    }
  });
});
