const itemsDiv = document.getElementById("items");

// Get inputs for live total calculation
const newItemPrice = document.getElementById("newItemPrice");
const newItemQty = document.getElementById("newItemQty");
const totalInput = document.getElementById("totalInput");

// 🔹 Update totalInput live
function updateTotalInput() {
  const price = parseFloat(newItemPrice.value) || 0;
  const qty = parseFloat(newItemQty.value) || 0;
  const total = Math.round(price * qty * 100) / 100;
  totalInput.value = total.toFixed(2);
}

// Event listeners for live total
newItemPrice.addEventListener("input", updateTotalInput);
newItemQty.addEventListener("input", updateTotalInput);

// 🔹 Load saved data and warn on reload
window.onload = function () {
  const savedData = localStorage.getItem("groceryItems");

  if (savedData) {
    const confirmClear = confirm(
      "Your data will be lost if you reload. Do you want to continue?"
    );
    if (confirmClear) {
      localStorage.removeItem("groceryItems");
    } else {
      const items = JSON.parse(savedData);
      items.forEach(item => addItem(item));
      calculateGrandTotal();
    }
  }
};

// 🔹 Add item (editable or from saved data)
function addItem(data = {}) {
  const div = document.createElement("div");
  div.className = "item";

  // Calculate total for this item
  let total = 0;
  if (data.price && data.qty) total = parseFloat(data.price) * parseFloat(data.qty);
  else if (data.total) total = parseFloat(data.total);

  div.innerHTML = `
    <input type="text" placeholder="Item name" value="${data.name || ''}" ${data.name ? "readonly" : ""}>
    <input type="number" placeholder="Price" value="${data.price || ''}" ${data.price ? "readonly" : ""} oninput="calculateItem(this)">
    <input type="number" placeholder="Qty" value="${data.qty || ''}" ${data.qty ? "readonly" : ""} oninput="calculateItem(this)">
    <input type="text" class="item-total" placeholder="Total" value="${total.toFixed(2)}" readonly>
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
  const price = parseFloat(row.querySelector('input[placeholder="Price"]').value) || 0;
  const qty = parseFloat(row.querySelector('input[placeholder="Qty"]').value) || 0;
  const totalInputField = row.querySelector('input[readonly]');
  totalInputField.value = (Math.round(price * qty * 100) / 100).toFixed(2);

  calculateGrandTotal();
  saveToLocalStorage();
}

// 🔹 Calculate grand total
function calculateGrandTotal() {
  const totals = document.querySelectorAll("#items .item input[disabled]");
  let grandTotalCents = 0;

  totals.forEach(input => {
    const total = parseFloat(input.value) || 0;
    grandTotalCents += Math.round(total * 100);
  });

  const grandTotal = grandTotalCents / 100;
  document.getElementById("grandTotal").innerText = grandTotal.toFixed(2);
}

// 🔹 Save to localStorage
function saveToLocalStorage() {
  const rows = document.querySelectorAll(".item");
  const data = [];

  rows.forEach(row => {
    const nameInput = row.querySelector('.item-name');
    const priceInput = row.querySelector('.item-price');
    const qtyInput = row.querySelector('.item-qty');
    const totalInput = row.querySelector('.item-total');

    // Only save if all elements exist
    if (nameInput && priceInput && qtyInput && totalInput) {
      const name = nameInput.value;
      const price = parseFloat(priceInput.value) || 0;
      const qty = parseFloat(qtyInput.value) || 0;
      const total = parseFloat(totalInput.value) || 0;

      data.push({ name, price, qty, total });
    }
  });

  localStorage.setItem("groceryItems", JSON.stringify(data));
}

// 🔹 Calculate change
function calculateChange() {
  const grandTotal = parseFloat(document.getElementById("grandTotal").innerText) || 0;
  const amountGiven = parseFloat(document.getElementById("amountGiven").value) || 0;
  const changeField = document.getElementById("change");
  const message = document.getElementById("paymentMessage");
  const change = Math.round((amountGiven - grandTotal) * 100) / 100;

  if (amountGiven === 0) {
    changeField.value = "0.00";
    message.innerText = "";
  } else if (change < 0) {
    changeField.value = "0.00";
    message.innerText = "Insufficient amount!";
    message.style.color = "red";
  } else if (change === 0) {
    changeField.value = "0.00";
    message.innerText = "Exact amount, no change.";
    message.style.color = "green";
  } else {
    changeField.value = change.toFixed(2);
    message.innerText = `Change to return: ${change.toFixed(2)}`;
    message.style.color = "blue";
  }
}

// 🔹 Add item from input fields
function addItemFromFields() {
  const name = document.getElementById("newItemName").value.trim();
  const price = parseFloat(document.getElementById("newItemPrice").value) || 0;
  const qty = parseFloat(document.getElementById("newItemQty").value) || 0;
  const totalInput = document.getElementById("totalInput"); // live total

  if (!name) {
    alert("Please enter item name");
    return;
  }

  const total = parseFloat(totalInput.value) || 0; // get total from input

  // Create the item row
  const div = document.createElement("div");
  div.className = "item";

  div.innerHTML = `
    <input type="text" placeholder="Item name" value="${name}" readonly>
    <input type="number" placeholder="Price" value="${price}" readonly>
    <input type="number" placeholder="Qty" value="${qty}" readonly>
    <input type="text" placeholder="Total" value="${total.toFixed(2)}" disabled>
    <button class="remove-btn" onclick="removeItem(this)">X</button>
  `;

  itemsDiv.appendChild(div);

  // Clear input fields
  document.getElementById("newItemName").value = "";
  document.getElementById("newItemPrice").value = "";
  document.getElementById("newItemQty").value = "";
  totalInput.value = "";

  calculateGrandTotal();
  saveToLocalStorage();
}