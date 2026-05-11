// TASK FORM ELEMENTS
const taskForm = document.querySelector(".task-form");
const taskInput = document.querySelector(".task-input");
const taskList = document.querySelector(".task-list");
const taskPlaceholder = document.querySelector(".task-placeholder");

console.log(taskForm);
console.log(taskInput);
console.log(taskList);

// FORM SUBMIT EVENT 
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskText = taskInput.value;
    if (taskText === "") return;

    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.textContent = taskText;
    
    taskPlaceholder.remove();
    
    taskList.appendChild(taskItem);

    taskInput.value = "";
});