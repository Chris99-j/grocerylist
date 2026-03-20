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

  const priceInput = row.querySelector('input[placeholder="Price"]');
  const qtyInput = row.querySelector('input[placeholder="Qty"]');
  const totalInput = row.querySelector('input[readonly]');

  if (!priceInput || !qtyInput || !totalInput) return;

  const price = parseFloat(priceInput.value) || 0;
  const qty = parseFloat(qtyInput.value) || 0;
  totalInput.value = (price * qty).toFixed(2);

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
    const nameInput = row.querySelector('input[placeholder="Item name"]');
    const priceInput = row.querySelector('input[placeholder="Price"]');
    const qtyInput = row.querySelector('input[placeholder="Qty"]');
    const totalInput = row.querySelector('input[readonly]');

    // safety check: skip row if any input missing
    if (!nameInput || !priceInput || !qtyInput || !totalInput) return;

    data.push({
      name: nameInput.value,
      price: priceInput.value,
      qty: qtyInput.value,
      total: totalInput.value
    });
  });

  localStorage.setItem("groceryItems", JSON.stringify(data));
}

// 🔹 Warn before refresh/close
window.onload = function () {
  const savedData = localStorage.getItem("groceryItems");

  if (savedData) {
    const confirmClear = confirm("Your data will be lost if you reload. Do you want to continue?");
    if (confirmClear) {
      localStorage.removeItem("groceryItems"); // clear if user confirms
    } else {
      const items = JSON.parse(savedData); // keep saved data
      items.forEach(item => addItem(item));
      calculateGrandTotal();
    }
  }
};

function calculateChange() {
  const grandTotal = parseFloat(document.getElementById("grandTotal").innerText) || 0;
  const amountGiven = parseFloat(document.getElementById("amountGiven").value) || 0;

  const change = amountGiven - grandTotal;
  document.getElementById("change").value = change >= 0 ? change.toFixed(2) : "0.00";
}