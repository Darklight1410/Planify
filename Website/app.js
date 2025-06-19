const gallery = document.getElementById('gallery');
const popup = document.getElementById('newListPopup');
const createBtn = document.getElementById('createListBtn');
const listNameInput = document.getElementById('listName');
const listEmojiInput = document.getElementById('listEmoji');

const todoView = document.getElementById('todoView');
const todoTitle = document.getElementById('todoTitle');
const todoItems = document.getElementById('todoItems');
const newTodoInput = document.getElementById('newTodoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const backBtn = document.getElementById('backBtn');

let lists = [];

function renderGallery() {
  gallery.innerHTML = '';

  lists.forEach((list, index) => {
    const btn = document.createElement('button');
    btn.className = 'list-button';
    btn.textContent = `${list.emoji} ${list.name}`;
    btn.onclick = () => openList(index);
    gallery.appendChild(btn);
  });

  // + Button
  const addBtn = document.createElement('button');
  addBtn.className = 'list-button';
  addBtn.textContent = '➕ Neue Liste';
  addBtn.onclick = () => popup.classList.toggle('hidden');
  gallery.appendChild(addBtn);
}

createBtn.onclick = () => {
  const name = listNameInput.value.trim();
  const emoji = listEmojiInput.value.trim();
  if (name && emoji) {
    lists.push({ name, emoji, todos: [] });
    listNameInput.value = '';
    listEmojiInput.value = '';
    popup.classList.add('hidden');
    renderGallery();
  }
};

function openList(index) {
  todoView.classList.remove('hidden');
  gallery.classList.add('hidden');
  popup.classList.add('hidden');
  const list = lists[index];
  todoTitle.textContent = `${list.emoji} ${list.name}`;
  todoItems.innerHTML = '';
  list.todos.forEach(todo => {
    const li = document.createElement('li');
    li.textContent = todo;
    todoItems.appendChild(li);
  });

  addTodoBtn.onclick = () => {
    const text = newTodoInput.value.trim();
    if (text) {
      list.todos.push(text);
      const li = document.createElement('li');
      li.textContent = text;
      todoItems.appendChild(li);
      newTodoInput.value = '';
    }
  };

  backBtn.onclick = () => {
    todoView.classList.add('hidden');
    gallery.classList.remove('hidden');
    renderGallery();
  };
}

renderGallery();
