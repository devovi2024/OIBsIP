
// DOM REFS
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const pendingList = document.getElementById('pending-list');
const completedList = document.getElementById('completed-list');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');
const emptyPending = document.getElementById('empty-pending');
const emptyCompleted = document.getElementById('empty-completed');
const themeCheck = document.getElementById('theme-check');

// STATE
let tasks = [];
let editingId = null;

// ================================================================
// LOAD FROM localStorage
// ================================================================
function loadTasks() {
    const stored = localStorage.getItem('tasks');
    if (stored) {
        tasks = JSON.parse(stored);
    } else {
        tasks = [];
    }
}

// ================================================================
// SAVE TO localStorage
// ================================================================
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ================================================================
// GENERATE UNIQUE ID
// ================================================================
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// ================================================================
// FORMAT TIME
// ================================================================
function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ================================================================
// RENDER TASKS
// ================================================================
function render() {
    const pending = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);

    // Pending
    if (pending.length === 0) {
        pendingList.innerHTML = '';
        emptyPending.classList.add('visible');
    } else {
        emptyPending.classList.remove('visible');
        pendingList.innerHTML = pending.map(task => createTaskHTML(task)).join('');
    }

    // Completed
    if (completed.length === 0) {
        completedList.innerHTML = '';
        emptyCompleted.classList.add('visible');
    } else {
        emptyCompleted.classList.remove('visible');
        completedList.innerHTML = completed.map(task => createTaskHTML(task)).join('');
    }

    // Counts
    pendingCount.textContent = pending.length;
    completedCount.textContent = completed.length;

    // Update add button state
    addBtn.disabled = taskInput.value.trim() === '';

    saveTasks();
}

// ================================================================
// CREATE TASK HTML
// ================================================================
function createTaskHTML(task) {
    const isEditing = editingId === task.id;
    const editClass = isEditing ? 'editing' : '';

    return `
        <li class="task-item ${editClass}" data-id="${task.id}">
            <span class="task-text ${task.completed ? 'completed' : ''}">${escapeHTML(task.text)}</span>
            <input type="text" class="edit-input" value="${escapeHTML(task.text)}" />
            <span class="task-time">${task.addedAt ? formatTime(task.addedAt) : ''}${task.completedAt ? ' ✓' + formatTime(task.completedAt) : ''}</span>
            <div class="actions">
                <button class="complete-btn" title="Toggle complete"><i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i></button>
                <button class="edit-btn" title="Edit"><i class="fas fa-pen"></i></button>
                <button class="delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        </li>
    `;
}

// ================================================================
// ESCAPE HTML (prevent XSS)
// ================================================================
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ================================================================
// ADD TASK
// ================================================================
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    const newTask = {
        id: generateId(),
        text: text,
        completed: false,
        addedAt: Date.now(),
        completedAt: null
    };

    tasks.push(newTask);
    taskInput.value = '';
    render();
    taskInput.focus();
}

// ================================================================
// DELETE TASK
// ================================================================
function deleteTask(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return;

    // Remove with animation
    const item = document.querySelector(`.task-item[data-id="${id}"]`);
    if (item) {
        item.classList.add('removing');
        setTimeout(() => {
            tasks.splice(index, 1);
            if (editingId === id) editingId = null;
            render();
        }, 250);
    } else {
        tasks.splice(index, 1);
        if (editingId === id) editingId = null;
        render();
    }
}

// ================================================================
// TOGGLE COMPLETE
// ================================================================
function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    task.completedAt = task.completed ? Date.now() : null;
    if (editingId === id) editingId = null;
    render();
}

// ================================================================
// EDIT TASK (Enter to save, Escape to cancel)
// ================================================================
function startEdit(id) {
    const task = tasks.find(t => t.id === id);
    if (!task || task.completed) return; // Don't edit completed tasks

    editingId = id;
    render();

    // Focus the edit input
    const item = document.querySelector(`.task-item[data-id="${id}"]`);
    if (item) {
        const input = item.querySelector('.edit-input');
        if (input) {
            input.focus();
            input.select();
        }
    }
}

function saveEdit(id, newText) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const trimmed = newText.trim();
    if (trimmed === '') {
        // If empty, delete the task
        deleteTask(id);
        return;
    }

    task.text = trimmed;
    editingId = null;
    render();
}

function cancelEdit() {
    editingId = null;
    render();
}

// ================================================================
// EVENT DELEGATION (Click & Keydown)
// ================================================================
document.addEventListener('click', (e) => {
    const target = e.target.closest('button');
    if (!target) return;

    const item = target.closest('.task-item');
    if (!item) return;

    const id = item.dataset.id;

    if (target.classList.contains('complete-btn')) {
        toggleComplete(id);
    } else if (target.classList.contains('delete-btn')) {
        deleteTask(id);
    } else if (target.classList.contains('edit-btn')) {
        startEdit(id);
    }
});

// Keyboard events for edit mode
document.addEventListener('keydown', (e) => {
    if (editingId === null) return;

    const item = document.querySelector(`.task-item[data-id="${editingId}"]`);
    if (!item) return;

    const input = item.querySelector('.edit-input');
    if (!input) return;

    if (e.key === 'Enter') {
        e.preventDefault();
        saveEdit(editingId, input.value);
    } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelEdit();
    }
});

// Add task on Enter
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
    }
});

// Enable/disable add button based on input
taskInput.addEventListener('input', () => {
    addBtn.disabled = taskInput.value.trim() === '';
});

// Add button click
addBtn.addEventListener('click', addTask);

// ================================================================
// THEME TOGGLE (with localStorage)
// ================================================================
const savedTheme = localStorage.getItem('todo-theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeCheck.checked = true;
}

themeCheck.addEventListener('change', () => {
    const isLight = themeCheck.checked;
    document.body.classList.toggle('light-mode', isLight);
    localStorage.setItem('todo-theme', isLight ? 'light' : 'dark');
});

// ================================================================
// INIT
// ================================================================
loadTasks();
render();
document.getElementById('year').textContent = new Date().getFullYear();