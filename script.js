document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTaskBtn = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const filters = document.querySelectorAll('.btn-filter');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const renderTasks = (filter = 'all') => {
        taskList.innerHTML = '';
        let filteredTasks = tasks;

        if (filter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }

        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('todo-item');
            if (task.completed) taskItem.classList.add('completed');

            taskItem.setAttribute('draggable', 'true');
            taskItem.dataset.index = index;

            taskItem.innerHTML = `
                <span>${task.text}</span>
                <div>
                    <button class="btn-cute edit">Edit</button>
                    <button class="btn-cute complete">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="btn-cute delete">Delete</button>
                </div>
            `;

            taskList.appendChild(taskItem);
        });
    };

    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            tasks.push({ text: taskText, completed: false });
            taskInput.value = '';
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }
    };

    const handleTaskAction = (e) => {
        const target = e.target;
        const taskItem = target.closest('.todo-item');
        const taskIndex = taskItem.dataset.index;

        if (target.classList.contains('edit')) {
            const newText = prompt('Edit your task:', tasks[taskIndex].text);
            if (newText !== null) {
                tasks[taskIndex].text = newText;
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTasks();
            }
        }

        if (target.classList.contains('complete')) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }

        if (target.classList.contains('delete')) {
            tasks.splice(taskIndex, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }
    };

    const applyFilter = (e) => {
        const filter = e.target.id.replace('filter-', '');
        renderTasks(filter);
    };

    addTaskBtn.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskAction);
    filters.forEach(filterBtn => filterBtn.addEventListener('click', applyFilter));

    renderTasks();
});
