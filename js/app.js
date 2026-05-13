// HEADER ELEMENTS
const headerTitle = document.querySelector(".top-header h2");
const headerDescription = document.querySelector(".top-header p");

// NAVIGATION ELEMENTS
const navItems = document.querySelectorAll(".nav-item");
const dashboardPage = document.querySelector(".dashboard-page");
const timerPage = document.querySelector(".timer-page");
const tasksPage = document.querySelector(".tasks-page");
const analyticsPage = document.querySelector(".analytics-page");

// TASK FORM ELEMENTS
const taskForm = document.querySelector(".task-form");
const taskInput = document.querySelector(".task-input");
const taskList = document.querySelector(".task-list");

// COUNTER ELEMENTS
const completedCount = document.querySelector(".completed-count");
const totalCount = document.querySelector(".total-count");
const sessionCount = document.querySelector(".session-count");
const progressFill = document.querySelector(".progress-fill");
const sessionStatus = document.querySelector(".session-status");

// TIMER ELEMENTS
const timerDisplay = document.querySelector(".timer-display");
const timerButton = document.querySelector(".focus-section .primary-btn");
const resetButton = document.querySelector(".reset-btn");
const modeButtons = document.querySelectorAll(".mode-btn");
const notification = document.querySelector(".notification");
const themeButton = document.querySelector(".theme-btn");
const heroButton = document.querySelector(".hero-btn");

// TASK DATA
let tasks = [];

//TIMER DATA
let timerDuration = 1500;
let timerInterval = null;
let isTimerRunning = false;
let currentMode = "pomodoro";
let completedSessions = 0;

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

// UPDATE SESSION STATUS
function updateSessionStatus() {

    if (completedSessions === 0) sessionStatus.textContent = "No sessions completed yet...";
    else if (completedSessions < 5) sessionStatus.textContent = "Good start today!";
    else if (completedSessions < 10) sessionStatus.textContent = "Great productivity!!";
    else sessionStatus.textContent = "Amazing focus streak!!!🔥";
}

// UPDATE PROGRESS BAR
function updateProgressBar() {

    const progressPercent = Math.min((completedSessions / 10) * 100, 100);
    progressFill.style.width = `${progressPercent}%`; 
}

// SHOW SELECTED PAGE
function showPage(page) {
    dashboardPage.classList.add("hidden");
    timerPage.classList.add("hidden");
    tasksPage.classList.add("hidden");
    analyticsPage.classList.add("hidden");

    page.classList.remove("hidden");

    if (page === dashboardPage) {
        headerTitle.textContent = "Dashboard";
        headerDescription.textContent = "Track your productivity and stay focused.";
    } else if (page === timerPage) {
        headerTitle.textContent = "Focus Timer";
        headerDescription.textContent = "Stay focused with Pomodoro sessions.";
    } else if (page === tasksPage) {
        headerTitle.textContent = "Tasks";
        headerDescription.textContent = "Manage your daily tasks and goals.";
    } else if (page === analyticsPage) {
        headerTitle.textContent = "Analytics";
        headerDescription.textContent = "Track your productivity progress.";
    }
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

// SAVE SESSION DATA
function saveSessions() {
    localStorage.setItem("completedSessions", completedSessions);
}

// LOAD SESSION DATA
function loadSessions() {
    const savedSessions = localStorage.getItem("completedSessions");

    if (!savedSessions) return;

    completedSessions = Number(savedSessions);
    sessionCount.textContent = completedSessions;

    updateProgressBar();
    updateSessionStatus();
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

            if (currentMode === "pomodoro") {
                showNotification("Pomodoro session completed!");
                playNotificationSound();
                
                completedSessions++;
                sessionCount.textContent = completedSessions;

                saveSessions();
                updateProgressBar();
                updateSessionStatus();
            
            } else showNotification("Break session finished!");

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

// HERO BUTTON EVENT
heroButton.addEventListener("click", function() {

    showPage(timerPage);

    navItems.forEach(function(nav) {
        nav.classList.remove("active");
    });
    
    navItems[1].classList.add("active");
});

// NAVIGATION EVENTS
navItems.forEach(function(item) {
    item.addEventListener("click", function(event) {
        event.preventDefault();

        navItems.forEach(function(nav) {
            nav.classList.remove("active");
        });

        item.classList.add("active");

        const targetSection = item.dataset.section;
        
        if (targetSection === "dashboard") showPage(dashboardPage);
        else if (targetSection === "timer") showPage(timerPage);
        else if (targetSection === "tasks") showPage(tasksPage);
        else if (targetSection === "analytics") showPage(analyticsPage);
    });
});

loadSessions();
loadTasks();
loadTheme();