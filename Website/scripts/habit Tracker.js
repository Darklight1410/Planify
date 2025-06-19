const startDate = new Date("2024-12-30"); // Start mit Montag vor 01.01.2025
const endDate = new Date("2026-01-04");   // Sonntag nach 31.12.2025

let habits = JSON.parse(localStorage.getItem("habits")) || ["Trinken", "Sport"];
let habitData = JSON.parse(localStorage.getItem("habitData")) || {};

let currentWeek = getCurrentWeekOffset();

function getCurrentWeekOffset() {
  const now = new Date();
  const firstMonday = getMondayOfWeek(startDate);
  const diffDays = Math.floor((now - firstMonday) / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
}

function getMondayOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function getWeekDates(weekOffset) {
  const weekStart = new Date(startDate);
  weekStart.setDate(weekStart.getDate() + weekOffset * 7);
  const week = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    week.push(day);
  }
  return week;
}

function formatDate(date) {
  return `${date.toLocaleDateString('de-DE', { weekday: 'short' })}, ${date.toLocaleDateString('de-DE')}`;
}

function renderTable() {
  const table = document.getElementById("habitTable");
  table.innerHTML = "";

  const weekDates = getWeekDates(currentWeek);

  const headerRow = document.createElement("tr");
  const emptyCell = document.createElement("th");
  emptyCell.textContent = "Datum";
  headerRow.appendChild(emptyCell);

  habits.forEach(habit => {
    const th = document.createElement("th");
    const span = document.createElement("span");
    span.textContent = habit;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.style.marginLeft = "5px";
    deleteBtn.style.color = "red";
    deleteBtn.onclick = () => {
      if (confirm(`Habit "${habit}" wirklich löschen?`)) {
        habits = habits.filter(h => h !== habit);
        localStorage.setItem("habits", JSON.stringify(habits));
        renderTable();
      }
    };

    th.appendChild(span);
    th.appendChild(deleteBtn);
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  weekDates.forEach(date => {
    const dateStr = date.toISOString().split("T")[0];
    const row = document.createElement("tr");

    const dateCell = document.createElement("td");
    dateCell.textContent = formatDate(date);
    row.appendChild(dateCell);

    habits.forEach(habit => {
      const cell = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";

      const key = `${dateStr}-${habit}`;
      checkbox.checked = habitData[key] || false;

      checkbox.addEventListener("change", () => {
        habitData[key] = checkbox.checked;
        localStorage.setItem("habitData", JSON.stringify(habitData));
      });

      cell.appendChild(checkbox);
      row.appendChild(cell);
    });

    table.appendChild(row);
  });
}

function addHabit() {
  const input = document.getElementById("newHabit");
  const habit = input.value.trim();
  if (habit && !habits.includes(habit)) {
    habits.push(habit);
    localStorage.setItem("habits", JSON.stringify(habits));
    input.value = "";
    renderTable();
  }
}

document.getElementById("prevWeek").addEventListener("click", () => {
  if (currentWeek > 0) {
    currentWeek--;
    renderTable();
  }
});

document.getElementById("nextWeek").addEventListener("click", () => {
  const nextDate = new Date(startDate);
  nextDate.setDate(nextDate.getDate() + (currentWeek + 1) * 7);
  if (nextDate <= endDate) {
    currentWeek++;
    renderTable();
  }
});

renderTable();
