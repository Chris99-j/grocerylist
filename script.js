const itemsDiv = document.getElementById("items");

// 🔹 Load saved data on page load
window.onload = function () {
  const savedData = localStorage.getItem("groceryItems");

  if (savedData) {
    const items = JSON.parse(savedData);
    items.forEach(item => addItem(item));
    calculateGrandTotal();
  }
};

// 🔹 Add item (with optional data)
function addItem(data = {}) {
  const div = document.createElement("div");
  div.className = "item";

  div.innerHTML = `
    <input type="text" placeholder="Item name" value="${data.name || ''}">
    <input type="number" placeholder="Price" value="${data.price || ''}" oninput="calculateItem(this)">
    <input type="number" placeholder="Qty" value="${data.qty || ''}" oninput="calculateItem(this)">
    <input type="text" placeholder="Total" value="${data.total || ''}" readonly>
    <button class="remove-btn" onclick="removeItem(this)">X</button>
  `;

  itemsDiv.appendChild(div);
}

// 🔹 Remove item
function removeItem(button) {
  button.parentElement.remove();
  calculateGrandTotal();
  saveToLocalStorage();
}

// 🔹 Calculate per item
function calculateItem(input) {
  const row = input.parentElement;
  const price = row.children[1].value;
  const qty = row.children[2].value;
  const totalField = row.children[3];

  const total = (parseFloat(price) || 0) * (parseFloat(qty) || 0);
  totalField.value = total.toFixed(2);

  calculateGrandTotal();
  saveToLocalStorage();
}

// 🔹 Calculate grand total
function calculateGrandTotal() {
  const totals = document.querySelectorAll(".item input[readonly]");
  let grandTotal = 0;

  totals.forEach(input => {
    grandTotal += parseFloat(input.value) || 0;
  });

  document.getElementById("grandTotal").innerText = grandTotal.toFixed(2);
}

// 🔹 Save to localStorage
function saveToLocalStorage() {
  const rows = document.querySelectorAll(".item");
  const data = [];

  rows.forEach(row => {
    const inputs = row.querySelectorAll("input");
    data.push({
      name: inputs[0].value,
      price: inputs[1].value,
      qty: inputs[2].value,
      total: inputs[3].value
    });
  });

  localStorage.setItem("groceryItems", JSON.stringify(data));
}

// 🔹 Warn before refresh/close
window.addEventListener("beforeunload", function (e) {
  if (document.querySelectorAll(".item").length > 0) {
    e.preventDefault();
    e.returnValue = "";
  }
});