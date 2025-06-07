const form = document.getElementById("coin-form");
const tableBody = document.getElementById("coin-table-body");
const totalCoinsEl = document.getElementById("total-coins");
const averageEl = document.getElementById("average");

let entries = JSON.parse(localStorage.getItem("coinEntries") || "[]");

function updateTable() {
  tableBody.innerHTML = "";
  let runningTotal = 0;

  const dailyMap = new Map();

  entries.forEach(entry => {
    runningTotal += entry.coins;

    // Count entries per day for average
    dailyMap.set(entry.date, (dailyMap.get(entry.date) || 0) + entry.coins);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.coins}</td>
      <td>${runningTotal}</td>
    `;
    tableBody.appendChild(row);
  });

  totalCoinsEl.textContent = runningTotal;
  averageEl.textContent = (runningTotal / dailyMap.size || 0).toFixed(2);
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const date = document.getElementById("date").value;
  const coins = parseInt(document.getElementById("coins").value, 10);

  if (!date || coins <= 0) return;

  entries.push({ date, coins });
  entries.sort((a, b) => new Date(a.date) - new Date(b.date));

  localStorage.setItem("coinEntries", JSON.stringify(entries));
  updateTable();

  form.reset();
});

updateTable();
