const dateDisplay = document.getElementById("dateDisplay");
const timeDisplay = document.getElementById("timeDisplay");
const eventList = document.getElementById("eventList");
const countdown = document.getElementById("countdown");

let currentDate = new Date();

function updateDateDisplay() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateDisplay.textContent = currentDate.toLocaleDateString('de-DE', options);
}

function updateTimeDisplay() {
  const now = new Date();
  now.setSeconds(0, 0); // Sekunden und Millisekunden auf null setzen

  timeDisplay.textContent = now.toLocaleTimeString('de-DE');
}

function loadEvents() {
  const key = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
  const events = JSON.parse(localStorage.getItem(key)) || [];

  const now = new Date();
  now.setSeconds(0, 0); // Bugfix: Sekunden auf 0

  eventList.innerHTML = "";
  let nextEventTime = null;

  if (events.length === 0) {
    const li = document.createElement("li");
    li.textContent = "🥳 Super, alles erledigt für heute!";
    li.style.color = "green";
    eventList.appendChild(li);
    countdown.textContent = "Nächstes Event in: –";
    return;
  }

  events
    .sort((a, b) => a.time.localeCompare(b.time))
    .forEach(event => {
      const [h, m] = event.time.split(":").map(Number);
      const eventDate = new Date(currentDate);
      eventDate.setHours(h, m, 0, 0); // Sekundengenauigkeit fixen

      if (eventDate >= now && !nextEventTime) {
        nextEventTime = eventDate;
      }

      const li = document.createElement("li");
      li.textContent = `${event.time} – ${event.text}`;
      eventList.appendChild(li);
    });

  if (nextEventTime) {
    startCountdown(nextEventTime);
  } else {
    countdown.textContent = "Nächstes Event in: –";
  }
}


function startCountdown(targetTime) {
  function updateCountdown() {
    const now = new Date();
    const diff = targetTime - now;

    if (diff <= 0) {
      countdown.textContent = "Nächstes Event beginnt jetzt!";
      clearInterval(countdownInterval);
      return;
    }

    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    countdown.textContent = `Nächstes Event in: ${mins}min ${secs}s`;
  }

  updateCountdown();
  clearInterval(countdownInterval);
  countdownInterval = setInterval(updateCountdown, 1000);
}

let countdownInterval = null;

document.getElementById("prevDay").addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() - 1);
  refreshView();
});

document.getElementById("nextDay").addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() + 1);
  refreshView();
});

function refreshView() {
  updateDateDisplay();
  loadEvents();
}

// Uhrzeit live aktualisieren
setInterval(updateTimeDisplay, 1000);
updateTimeDisplay();

// Initial laden
refreshView();
