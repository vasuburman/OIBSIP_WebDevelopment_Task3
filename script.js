var tasks = [];

var taskIdCounter = 1;

var editingTaskId = null;


function getCurrentDateTime() {
  var now = new Date();

  var day   = now.getDate();
  var year  = now.getFullYear();
  var hours = now.getHours();
  var mins  = now.getMinutes();

  var months = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec'
  ];
  var month = months[now.getMonth()];

  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) { hours = 12; }

  if (mins < 10) { mins = '0' + mins; }

  return day + ' ' + month + ' ' + year + ', ' + hours + ':' + mins + ' ' + ampm;
}


function addTask() {

  var input     = document.getElementById('taskInput');
  var errorMsg  = document.getElementById('errorMsg');
  var taskText  = input.value.trim();

  if (taskText === '') {
    errorMsg.textContent = '⚠️ Please enter a task before adding!';
    return;
  }

  errorMsg.textContent = '';

  var newTask = {
    id          : taskIdCounter,
    text        : taskText,
    completed   : false,
    addedAt     : getCurrentDateTime(),
    completedAt : null
  };

  tasks.push(newTask);

  taskIdCounter++;

  input.value = '';

  renderTasks();
}


function renderTasks() {

  var pendingList   = document.getElementById('pendingList');
  var completedList = document.getElementById('completedList');

  pendingList.innerHTML   = '';
  completedList.innerHTML = '';

  var pendingCount   = 0;
  var completedCount = 0;

  for (var i = 0; i < tasks.length; i++) {

    var task = tasks[i];

    var li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed-item' : '');

    li.innerHTML =
      '<input ' +
        'type="checkbox" ' +
        'class="task-checkbox" ' +
        (task.completed ? 'checked' : '') +
        ' onchange="toggleComplete(' + task.id + ')"' +
      '/>' +
      '<div class="task-info">' +
        '<p class="task-text' + (task.completed ? ' done' : '') + '">' +
          task.text +
        '</p>' +
        '<div class="task-meta">' +
          '📅 Added: ' + task.addedAt +
          (task.completedAt
            ? '<br>✅ Completed: ' + task.completedAt
            : '') +
        '</div>' +
      '</div>' +
      '<div class="task-actions">' +
        '<button class="btn-edit"   onclick="openEdit(' + task.id + ')">✏️ Edit</button>' +
        '<button class="btn-delete" onclick="deleteTask(' + task.id + ')">🗑️ Delete</button>' +
      '</div>';

    if (task.completed) {
      completedList.appendChild(li);
      completedCount++;
    } else {
      pendingList.appendChild(li);
      pendingCount++;
    }
  }

  document.getElementById('totalCount').textContent     = tasks.length;
  document.getElementById('pendingCount').textContent   = pendingCount;
  document.getElementById('completedCount').textContent = completedCount;

  document.getElementById('pendingEmpty').style.display =
    pendingCount === 0 ? 'block' : 'none';

  document.getElementById('completedEmpty').style.display =
    completedCount === 0 ? 'block' : 'none';

  document.getElementById('clearCompletedBtn').style.display =
    completedCount === 0 ? 'none' : 'inline-block';
}


function toggleComplete(id) {

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {

      tasks[i].completed = !tasks[i].completed;

      if (tasks[i].completed) {
        tasks[i].completedAt = getCurrentDateTime();
      } else {
        tasks[i].completedAt = null;
      }

      break;
    }
  }

  renderTasks();
}


function deleteTask(id) {

  var confirmed = confirm('Are you sure you want to delete this task?');

  if (confirmed) {
    tasks = tasks.filter(function(task) {
      return task.id !== id;
    });

    // Re-render both lists
    renderTasks();
  }
}


function openEdit(id) {

  editingTaskId = id;

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      document.getElementById('editInput').value = tasks[i].text;
      break;
    }
  }

  document.getElementById('editModal').classList.add('active');

  document.getElementById('editInput').focus();
}


function saveEdit() {

  var newText = document.getElementById('editInput').value.trim();

  if (newText === '') {
    alert('Task cannot be empty!');
    return;
  }

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === editingTaskId) {
      tasks[i].text = newText;
      break;
    }
  }

  closeModal();

  renderTasks();
}


function closeModal() {
  document.getElementById('editModal').classList.remove('active');
  editingTaskId = null;
}


function clearAllCompleted() {

  var confirmed = confirm('Delete all completed tasks?');

  if (confirmed) {
    // Keep only tasks that are NOT completed
    tasks = tasks.filter(function(task) {
      return task.completed === false;
    });

    renderTasks();
  }
}


document.getElementById('taskInput').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    addTask();
  }
});


document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
});


document.getElementById('editModal').addEventListener('click', function(event) {
  if (event.target === this) {
    closeModal();
  }
});


renderTasks();