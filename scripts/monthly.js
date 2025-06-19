const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("month-title");
const popup = document.getElementById("popup");
const popupDate = document.getElementById("popupDate");
const eventText = document.getElementById("eventText");
const eventTime = document.getElementById("eventTime");
const saveBtn = document.getElementById("saveBtn");
const closeBtn = document.getElementById("closeBtn");
const popupEventList = document.getElementById("popupEventList");

let selectedDate = "";

function generateCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const monthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];
  const weekdays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];


  monthTitle.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sonntag
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendar.innerHTML = "";

  // Leere Kästchen vor dem 1. Tag
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    const empty = document.createElement("div");
    calendar.appendChild(empty);
  }

  // Tageskästchen mit Events
  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${year}-${month + 1}-${day}`;
    const events = JSON.parse(localStorage.getItem(key)) || [];
    const date = new Date(year, month, day);
    const weekdayShort = weekdays[date.getDay()];

    const weekdayDiv = document.createElement("div");
    weekdayDiv.className = "weekday-short";
    weekdayDiv.textContent = weekdayShort;
    div.appendChild(weekdayDiv);

    const div = document.createElement("div");
    div.className = "day";
    div.addEventListener("click", () => openPopup(day, month, year));

    const number = document.createElement("div");
    number.className = "date-number";
    number.textContent = day;
    div.appendChild(number);

    if (events.length > 0) {
      events.forEach(event => {
        const preview = document.createElement("div");
        preview.className = "event-preview";
        preview.textContent = `${event.time} – ${event.text}`;
        div.appendChild(preview);
      });
    } else {
      const emptyNote = document.createElement("div");
      emptyNote.className = "event-empty";
      emptyNote.textContent = "Hier sieht’s aber leer aus...";
      div.appendChild(emptyNote);
    }

    calendar.appendChild(div);
  }

}

const isToday =
  day === today.getDate() &&
  month === today.getMonth() &&
  year === today.getFullYear();

if (isToday) {
  div.classList.add("today");
}

saveBtn.addEventListener("click", () => {
  const time = eventTime.value;
  const text = eventText.value.trim();

  if (time && text) {
    const existing = JSON.parse(localStorage.getItem(selectedDate)) || [];
    existing.push({ time, text });
    localStorage.setItem(selectedDate, JSON.stringify(existing));
  }

  popup.classList.add("hidden");
  generateCalendar();
});

function openPopup(day, month, year) {
  selectedDate = `${year}-${month + 1}-${day}`;
  popupDate.textContent = `Ereignisse für ${selectedDate}`;
  popup.classList.remove("hidden");

  eventText.value = "";
  eventTime.value = "";

  // Alte Events laden
  const events = JSON.parse(localStorage.getItem(selectedDate)) || [];
  popupEventList.innerHTML = "";

  events.forEach((event, index) => {
    const li = document.createElement("li");
    li.textContent = `${event.time} – ${event.text}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.addEventListener("click", () => deleteEvent(index));

    li.appendChild(deleteBtn);
    popupEventList.appendChild(li);
  });
}

function deleteEvent(index) {
  const events = JSON.parse(localStorage.getItem(selectedDate)) || [];
  events.splice(index, 1); // Event an Index löschen
  localStorage.setItem(selectedDate, JSON.stringify(events));
  openPopup(...selectedDate.split("-").map(Number)); // Pop-up neu laden
  generateCalendar(); // Kalender aktualisieren
}

closeBtn.addEventListener("click", () => {
  popup.classList.add("hidden");
});

generateCalendar();


