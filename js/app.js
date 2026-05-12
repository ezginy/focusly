// TASK FORM ELEMENTS
const taskForm = document.querySelector(".task-form");
const taskInput = document.querySelector(".task-input");
const taskList = document.querySelector(".task-list");

const completedCount = document.querySelector(".completed-count");
const totalCount = document.querySelector(".total-count");

// TASK DATA
let tasks = [];

// UPDATE TASK COUNTERS
function updateTaskCounters() {

    const allTasks = document.querySelectorAll(".task-item");
    const completedTasks = document.querySelectorAll(".task-item.completed");

    totalCount.textContent = allTasks.length;
    completedCount.textContent = completedTasks.length;
}

// RENDER TASK ITEM
function renderTask(task) {

    const taskItem = document.createElement("div");

    taskItem.classList.add("task-item");

    if (task.completed) {
        taskItem.classList.add("completed");
    }

    taskItem.innerHTML = `
        <span class="task-text"> ${task.text} </span>
        
        <div class="task-actions">
            <button class="complete-btn"> ${task.completed ? "Undo" : "Complete"} </button>
            <button class="delete-btn"> Delete </button>
        </div>
    `;

    // REMOVE EMPTY STATE PLACEHOLDER
    const placeholder = document.querySelector(".task-placeholder");
    if (placeholder) placeholder.remove();

    taskList.appendChild(taskItem);
}

// SAVE TASKS TO LOCAL STORAGE
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// LOAD TASKS FROM LOCAL STORAGE
function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");

    if (!storedTasks) return;

    tasks = JSON.parse(storedTasks);

    console.log(tasks);

    tasks.forEach(function(task) {
        renderTask(task);
    });

    updateTaskCounters();
}

// FORM SUBMIT EVENT 
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const task = {
        text: taskText,
        completed: false
    };

    tasks.push(task);

    renderTask(task);

    taskInput.value = "";
    taskInput.focus();

    updateTaskCounters();
    saveTasks();
});

// TASK ACTION EVENTS
taskList.addEventListener("click", function(event) {
    
    if (event.target.classList.contains("delete-btn")) {
        
        const taskItem = event.target.closest(".task-item");

        const taskText = taskItem.querySelector(".task-text").textContent.trim();

        tasks = tasks.filter(function(task) {
            return task.text !== taskText;
        });

        taskItem.remove();

        updateTaskCounters();
        saveTasks();

        if(taskList.children.length === 0) {

            taskList.innerHTML = `
                <div class="task-placeholder"> No tasks added yet. </div>
            `;
        }
    }

    if (event.target.classList.contains("complete-btn")) {

        const taskItem = event.target.closest(".task-item");
        taskItem.classList.toggle("completed");

        const taskText = taskItem.querySelector(".task-text").textContent.trim();

        tasks = tasks.map(function(task) {

            if (task.text === taskText) task.completed = !task.completed;

            return task;
        });

        updateTaskCounters();
        saveTasks();

        if(taskItem.classList.contains("completed")) {
            event.target.textContent = "Undo";
        } else {
            event.target.textContent = "Complete";
        }
    }
});

loadTasks();