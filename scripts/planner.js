// von Mia
// Ein Objekt, das den aktuellen Zustand des Planers speichert.
const Planner = {
  lists: [],

  // Liste erstellen
  addList(title) {
    if (title) {
      this.lists.push({ title, todos: [] });
      renderGallery(); // Nach dem Hinzufügen wird die Ansicht aktualisiert
    }
  },

  // Liste löschen
  deleteList(index) {
    this.lists.splice(index, 1);
    renderGallery(); // Nach dem Löschen wird die Ansicht aktualisiert
  },

  // To-Do hinzufügen
  addTodo(listIndex, text) {
    this.lists[listIndex].todos.push({ text, done: false });
    renderGallery(); // Galerie nach dem Hinzufügen neu rendern
    renderTodos(listIndex); // Todo-Liste auch neu rendern
  },

  // To-Do abhaken oder entmarkieren
  toggleTodo(listIndex, todoIndex) {
    const todo = this.lists[listIndex].todos[todoIndex];
    todo.done = !todo.done;
    renderTodos(listIndex); // Nach der Änderung wird die Liste aktualisiert
  },

  // Alle To-Do-Elemente der aktuellen Liste zurückgeben
  getTodos(listIndex) {
    return this.lists[listIndex].todos;
  },

  // Alle Listen zurückgeben
  getLists() {
    return this.lists;
  }
};

// DOM-Elemente
const listGallery = document.getElementById("listGallery");
const addListBtn = document.getElementById("addListBtn");
const listModal = document.getElementById("listModal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const todoList = document.getElementById("todoList");
const newTodoInput = document.getElementById("newTodoInput");
const addTodoBtn = document.getElementById("addTodoBtn");

// Neue Liste hinzufügen
addListBtn.addEventListener("click", () => {
  const title = prompt("Titel der neuen Liste:");
  if (title) {
    Planner.addList(title);
  }
});

// Listenanzeige mit Vorschau des ersten To-Dos
function renderGallery() {
  listGallery.innerHTML = "";  // Leert die Galerie, um sie neu zu rendern
  Planner.getLists().forEach((list, index) => {
    const card = document.createElement("div");
    card.className = "list-card";

    // Hole die Vorschau des ersten To-Dos (oder eine Nachricht, wenn keine vorhanden sind)
    const previewText = list.todos.length > 0
      ? list.todos[0].text
      : "Keine To-Dos";  // Wenn keine To-Dos existieren, zeigen wir "Keine To-Dos" an

    card.innerHTML = `
      <h3> ${list.title} </h3>
      <p class="todo-preview">${previewText}</p>  <!-- Vorschau des ersten To-Dos -->
      <button class="delete-btn" onclick="deleteList(event, ${index})">×</button>
    `;

    // Funktion zum Öffnen der Liste bei Klick
    card.onclick = () => openList(index);  // Öffnet die Liste beim Klicken
    listGallery.appendChild(card);  // Fügt die Karte in die Galerie ein
  });
}

// Liste löschen
function deleteList(e, index) {
  e.stopPropagation(); // Verhindert, dass die Liste geöffnet wird
  if (confirm("Liste wirklich löschen?")) {
    Planner.deleteList(index);
  }
}

// Liste öffnen
function openList(index) {
  modalTitle.textContent = Planner.getLists()[index].title;
  renderTodos(index);
  listModal.style.display = "flex";
}

// Todos anzeigen
function renderTodos(index) {
  const currentTodos = Planner.getTodos(index);
  todoList.innerHTML = "";
  currentTodos.forEach((todo, i) => {
    const li = document.createElement("li");
    li.className = todo.done ? "completed" : "";
    li.innerHTML = `
      <span>${todo.text}</span>
      <input type="checkbox" ${todo.done ? "checked" : ""} onchange="toggleTodo(${index}, ${i})" />
    `;
    todoList.appendChild(li);
  });
}

// Todo abhaken
function toggleTodo(listIndex, todoIndex) {
  Planner.toggleTodo(listIndex, todoIndex);
}

// Todo hinzufügen
addTodoBtn.onclick = () => {
  const text = newTodoInput.value.trim();
  if (text) {
    const listIndex = Planner.getLists().findIndex(list => list.title === modalTitle.textContent);
    Planner.addTodo(listIndex, text);
    newTodoInput.value = "";
  }
};

// Modal schließen
closeModal.onclick = () => {
  listModal.style.display = "none";
};

// Wenn außerhalb des Modals geklickt wird, schließt es
window.onclick = (e) => {
  if (e.target === listModal) listModal.style.display = "none";
};

// Initial anzeigen
renderGallery();
