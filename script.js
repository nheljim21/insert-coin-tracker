const form = document.getElementById("coin-form");
const tableBody = document.getElementById("coin-table-body");
const totalCoinsEl = document.getElementById("total-coins");
const averageEl = document.getElementById("average");

let entries = JSON.parse(localStorage.getItem("coinEntries") || "[]");

function updateTable() {
  tableBody.innerHTML = "";
  let runningTotal = 0;

  const dailyMap = new Map();

  entries.forEach((entry, index) => {
    runningTotal += entry.coins;
    dailyMap.set(entry.date, (dailyMap.get(entry.date) || 0) + entry.coins);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.coins}</td>
      <td>${runningTotal}</td>
      <td>
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  totalCoinsEl.textContent = runningTotal;
  averageEl.textContent = (runningTotal / dailyMap.size || 0).toFixed(2);

  // Attach event listeners to Edit and Delete buttons
  document.querySelectorAll(".delete-btn").forEach(btn =>
    btn.addEventListener("click", e => {
      const idx = e.target.dataset.index;
      entries.splice(idx, 1);
      localStorage.setItem("coinEntries", JSON.stringify(entries));
      updateTable();
    })
  );

  document.querySelectorAll(".edit-btn").forEach(btn =>
    btn.addEventListener("click", e => {
      const idx = e.target.dataset.index;
      startEditEntry(idx);
    })
  );
}

function startEditEntry(index) {
  const entry = entries[index];
  // Fill the form with the current entry data
  document.getElementById("date").value = entry.date;
  document.getElementById("coins").value = entry.coins;

  // Change the form button to "Update"
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.textContent = "Update";

  // Remove old submit listener so we don't add duplicates
  form.removeEventListener("submit", handleSubmit);

  // Add new submit handler for update
  form.addEventListener("submit", function handleUpdate(e) {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const coins = parseInt(document.getElementById("coins").value, 10);

    if (!date || coins <= 0) return alert("Please enter valid date and coins.");

    // Update the entry
    entries[index] = { date, coins };
    entries.sort((a, b) => new Date(a.date) - new Date(b.date));

    localStorage.setItem("coinEntries", JSON.stringify(entries));
    updateTable();

    form.reset();
    submitButton.textContent = "Add";

    // Remove this update listener and re-add original submit listener
    form.removeEventListener("submit", handleUpdate);
    form.addEventListener("submit", handleSubmit);
  });
}

function handleSubmit(e) {
  e.preventDefault();

  const date = document.getElementById("date").value;
  const coins = parseInt(document.getElementById("coins").value, 10);

  if (!date || coins <= 0) return alert("Please enter valid date and coins.");

  entries.push({ date, coins });
  entries.sort((a, b) => new Date(a.date) - new Date(b.date));

  localStorage.setItem("coinEntries", JSON.stringify(entries));
  updateTable();

  form.reset();
}

form.addEventListener("submit", handleSubmit);

updateTable();
