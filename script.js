document.addEventListener("DOMContentLoaded", function(){
    const currDate = new Date();
    document.getElementById("month").value = currDate.getMonth() + 1;
    document.getElementById("year").value = currDate.getFullYear();

    const today = currDate.toISOString().split("T")[0];
    document.getElementById("expense-date").setAttribute("max", today);
    loadExpenses();
});

let expense_form = document.getElementById("expense-form");
let expense_list = document.getElementById("expense-list");
let expense_total = document.getElementById("total-expense");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

expense_form.addEventListener("submit",function(event){
    event.preventDefault();
    const expense_name = document.getElementById("expense-name").value;
    const expense_amount = document.getElementById("expense-amount").value;
    const expense_date = document.getElementById("expense-date").value;
    const expense_description = document.getElementById("expense-description").value;

    if(expense_name && expense_amount && expense_date){
        let expense = {
            id: Date.now(),
            expense_name,
            amount: Number(expense_amount),
            expense_date,
            expense_description
        }
        expenses.push(expense);
        saveExpense();
        displayExpenses(Number(document.getElementById("month").value),Number(document.getElementById("year").value));
        expense_form.reset();
    }
})

document.getElementById("filter").addEventListener("click", function() {
    const selectedMonth = Number(document.getElementById("month").value);
    const selectedYear = Number(document.getElementById("year").value);
    displayExpenses(selectedMonth, selectedYear);
})

function saveExpense(){
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function loadExpenses(){
    const currentDate = new Date();
    displayExpenses(currentDate.getMonth()+1,currentDate.getFullYear());
}

function displayExpenses(month, year){
    expense_list.innerHTML= "";
    let total=0;

    month = month ?? (currentDate.getMonth() + 1);
    year = year ?? (currentDate.getFullYear());

    const filteredExpense = expenses.filter(expense => {
        const expenseDate = new Date(expense.expense_date);
        return (
            expenseDate.getMonth()+1 === month &&
            expenseDate.getFullYear() === year
        );
    });

    filteredExpense.forEach(expense => {
    total+= expense.amount;
    const li = document.createElement("li");
    li.innerHTML = `
        ${expense.expense_name} - ${expense.amount} (${expense.expense_date}) ______ ${expense.expense_description}
       <button class=delete onclick="deleteExpense(${expense.id})" style="float: inline-end;">X</button>
       `;
    li.style.textTransform = "uppercase";
    li.style.marginBottom = "10px";
    expense_list.appendChild(li);
    });
    expense_total.textContent = total;
}
function deleteExpense(id){
    expenses = expenses.filter(expense => expense.id !== id);
    saveExpense();
    displayExpenses(Number(document.getElementById("month").value),Number(document.getElementById("year").value)); //debug this to understand better
}