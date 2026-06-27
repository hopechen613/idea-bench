const todoForm = document.getElementById('todo-form');
const todosContainer = document.getElementById('todos-container');

console.log('todoForm:', todoForm);
console.log('todosContainer:', todosContainer);

async function loadTodos() {
  console.log('loadTodos called');
  const result = await db
    .from('to-dos')
    .select('*, "to-do_links"(*)')
    .order('created_at', { ascending: false });

  const data = result.data;
  const error = result.error;

  if (error) {
    console.error('Error loading todos:', error.message, error.details, error.hint, error.code);
    return;
  }

  console.log('Loaded todos:', data);
  todosContainer.innerHTML = '';
  data.forEach(renderTodo);
}

function renderTodo(todo) {
  const card = document.createElement('div');
  card.className = 'todo-card';

  const links = todo['to-do_links'] || [];
  let linksHtml = '';
  links.forEach(function (link) {
    linksHtml += '<li><a href="' + link.url + '" target="_blank" rel="noopener">' +
      (link.description || link.url) + '</a></li>';
  });

  card.innerHTML =
    '<h3>' + todo['project name'] + '</h3>' +
    '<ul class="links-list">' + linksHtml + '</ul>' +
    '<button class="add-link-btn">+ Add link</button>' +
    '<div class="add-link-form" style="display: none;">' +
      '<input type="url" class="new-link-url" placeholder="URL">' +
      '<input type="text" class="new-link-desc" placeholder="Description">' +
      '<button class="save-link-btn">Save link</button>' +
    '</div>';

  const addLinkBtn = card.querySelector('.add-link-btn');
  const addLinkForm = card.querySelector('.add-link-form');
  const saveLinkBtn = card.querySelector('.save-link-btn');

  addLinkBtn.addEventListener('click', function () {
    addLinkForm.style.display = 'block';
  });

  saveLinkBtn.addEventListener('click', async function () {
    const urlInput = card.querySelector('.new-link-url');
    const descInput = card.querySelector('.new-link-desc');

    const result = await db
      .from('to-do_links')
      .insert([{ 'to-do_id': todo.id, url: urlInput.value, description: descInput.value }]);

    if (result.error) {
      console.error('Error adding link:', result.error.message, result.error.details, result.error.hint, result.error.code);
      return;
    }

    loadTodos();
  });

  todosContainer.appendChild(card);
}

todoForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const projectName = document.getElementById('project-name-input').value;
  console.log('Adding todo:', projectName);

  const result = await db
    .from('to-dos')
    .insert([{ 'project name': projectName }])
    .select();

  if (result.error) {
    console.error('Error adding todo:', result.error.message, result.error.details, result.error.hint, result.error.code);
    return;
  }

  todoForm.reset();
  loadTodos();
});

loadTodos();
