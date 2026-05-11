// TASK FORM ELEMENTS
const taskForm = document.querySelector(".task-form");
const taskInput = document.querySelector(".task-input");
const taskList = document.querySelector(".task-list");

const completedCount = document.querySelector(".completed-count");
const totalCount = document.querySelector(".total-count");

// UPDATE TASK COUNTERS
function updateTaskCounters() {

    const allTasks = document.querySelectorAll(".task-item");
    const completedTasks = document.querySelectorAll(".task-item.completed");

    totalCount.textContent = allTasks.length;
    completedCount.textContent = completedTasks.length;
}

// FORM SUBMIT EVENT 
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    taskItem.innerHTML = `
        <span class="task-text"> ${taskText} </span>

        <div class="task-actions">
            <button class="complete-btn"> Complete </button>

            <button class="delete-btn"> Delete </button>
        </div>
    `;
    
    // REMOVE EMPTY STATE PLACEHOLDER
    const placeholder = document.querySelector(".task-placeholder");
    if (placeholder) {
        placeholder.remove();
    }
    
    taskList.appendChild(taskItem);

    taskInput.value = "";
    taskInput.focus();

    updateTaskCounters();
});

// TASK ACTION EVENTS
taskList.addEventListener("click", function(event) {
    
    if (event.target.classList.contains("delete-btn")) {
        
        const taskItem = event.target.closest(".task-item");
        taskItem.remove();

        updateTaskCounters();

        if(taskList.children.length === 0) {

            taskList.innerHTML = `
                <div class="task-placeholder"> No tasks added yet. </div>
            `;
        }
    }

    if (event.target.classList.contains("complete-btn")) {

        const taskItem = event.target.closest(".task-item");
        taskItem.classList.toggle("completed");

        updateTaskCounters();

        if(taskItem.classList.contains("completed")) {
            event.target.textContent = "Undo";
        } else {
            event.target.textContent = "Complete";
        }
    }
});