// TASK FORM ELEMENTS
const taskForm = document.querySelector(".task-form");
const taskInput = document.querySelector(".task-input");
const taskList = document.querySelector(".task-list");

const completedCount = document.querySelector(".completed-count");
const totalCount = document.querySelector(".total-count");

// TIMER ELEMENTS
const timerDisplay = document.querySelector(".timer-display");
const timerButton = document.querySelector(".focus-section .primary-btn");
const resetButton = document.querySelector(".reset-btn");
const modeButtons = document.querySelectorAll(".mode-btn");
const notification = document.querySelector(".notification");
const themeButton = document.querySelector(".theme-btn");

// TASK DATA
let tasks = [];

//TIMER DATA
let timerDuration = 1500;
let timerInterval = null;
let isTimerRunning = false;
let currentMode = "pomodoro";

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

// UPDATE TIMER DISPLAY
function updateTimerDisplay() {

    const minutes = Math.floor(timerDuration / 60);
    const seconds = timerDuration % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
    document.title = `Focusly • ${formattedMinutes}:${formattedSeconds}`;
}

// SAVE THEME
function saveTheme(theme) {
    localStorage.setItem("theme", theme);
}

// LOAD THEME
function loadTheme() {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        themeButton.textContent = "🌙";
    } else themeButton.textContent = "☀️";
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

// START TIMER
function startTimer() {

    if (timerInterval) return;

    if (timerDuration <= 0) {
        timerDuration = 1500;
        updateTimerDisplay();
    }

    isTimerRunning = true;
    timerButton.textContent = "Pause";

    timerInterval = setInterval(function() {

        timerDuration--;
        updateTimerDisplay();

        if (timerDuration <= 0) {

            clearInterval(timerInterval);

            if (currentMode === "pomodoro") showNotification("Pomodoro session completed!");
            else showNotification("Break session finished!");

            timerInterval = null;
            isTimerRunning = false;
            timerButton.textContent = "Start Session";

        }

    }, 1000);
}

// PAUSE TIMER
function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isTimerRunning = false;
    timerButton.textContent = "Resume";
}

// RESET TIMER
function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isTimerRunning = false;
    timerDuration = 1500;
    updateTimerDisplay();
    timerButton.textContent = "Start Session";
}

// SWITCH TIMER MODE 
function switchMode(mode) {
    currentMode = mode;

    modeButtons.forEach(function(button) {
        button.classList.remove("active-mode");
    });

    clearInterval(timerInterval);
    timerInterval = null;
    isTimerRunning = false;
    timerButton.textContent = "Start Session";

    if (mode === "pomodoro") {
        timerDuration = 1500;
        
        modeButtons[0].classList.add("active-mode");
    } 

    else if (mode === "shortBreak") {
        timerDuration = 300;

        modeButtons[1].classList.add("active-mode");
    }

    else {
        timerDuration = 900;

        modeButtons[2].classList.add("active-mode");
    }

    updateTimerDisplay();
}

// SHOW NOTIFICATION
function showNotification(message) {

    notification.textContent = message;
    notification.classList.remove("hidden");

    setTimeout(function() {
        notification.classList.add("hidden");
    }, 3000);

}

// PLAY NOTIFICATION SOUND
function playNotificationSound() {

    // create audio context
    const audioContext = new AudioContext();

    // create sound generator
    const oscillator = audioContext.createOscillator();

    // control sound volume
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // soft sound type
    oscillator.type = "triangle";

    // sound frequency
    oscillator.frequency.value = 880;

    // lower volume for subtle feedback
    gainNode.gain.value = 0.03;
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.15);
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

// TIMER BUTTON EVENT
timerButton.addEventListener("click", function() {
    playNotificationSound();
    isTimerRunning ? pauseTimer() : startTimer();
});

resetButton.addEventListener("click", function() {
    resetTimer();
});

// TIMER MODE EVENTS
modeButtons.forEach(function(button) {
    
    button.addEventListener("click", function() {
        
        const modeText = button.textContent.trim();

        if (modeText === "Pomodoro") switchMode("pomodoro");
        else if (modeText === "Short Break") switchMode("shortBreak");
        else switchMode("longBreak");
    });

});

// THEME TOGGLE EVENT
themeButton.addEventListener("click", function() {

    document.body.classList.toggle("light-theme");

    if (document.body.classList.contains("light-theme")) {
        themeButton.textContent = "🌙";
        saveTheme("light");
    }

    else {
        themeButton.textContent = "☀️";
        saveTheme("dark");
    }

});

loadTasks();
loadTheme();