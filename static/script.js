document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const workModeBtn = document.getElementById('work-mode-btn');
    const breakModeBtn = document.getElementById('break-mode-btn');
    
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const completedTaskList = document.getElementById('completed-task-list'); // New

    const themeToggleBtn = document.getElementById('theme-toggle');
    const settingsToggleBtn = document.getElementById('settings-toggle');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const workDurationInput = document.getElementById('work-duration');
    const breakDurationInput = document.getElementById('break-duration');
    const alarmSound = document.getElementById('alarm-sound');
    
    const digitalClock = document.getElementById('digital-clock');
    const monthNameEl = document.getElementById('month-name');
    const yearEl = document.getElementById('year');
    const calendarBody = document.getElementById('calendar-body');

    // --- State Variables ---
    let timerInterval;
    let timeLeft;
    let isRunning = false;
    let isWorkMode = true;

    // Default settings
    let settings = {
        workDuration: 25,
        breakDuration: 5,
        darkMode: false
    };

    // --- Initialization ---
    requestNotificationPermission();
    loadSettings();
    loadTasks();
    timeLeft = settings.workDuration * 60;
    updateDisplay();
    applyTheme();
    
    // Initialize Clock and Calendar
    updateClock();
    setInterval(updateClock, 1000);
    renderCalendar();

    // --- Notifications ---
    function requestNotificationPermission() {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }

    function sendNotification(message) {
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Pomodoro Timer", { body: message });
        } else {
            // Fallback if denied or not supported
            alert(message);
        }
    }

    // --- Timer Logic ---

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function updateDisplay() {
        timerDisplay.textContent = formatTime(timeLeft);
        document.title = `${formatTime(timeLeft)} - Study Timer`;
    }

    function switchMode(work) {
        isWorkMode = work;
        pauseTimer(); // Stop timer when switching
        
        if (isWorkMode) {
            timeLeft = settings.workDuration * 60;
            workModeBtn.classList.add('active');
            breakModeBtn.classList.remove('active');
        } else {
            timeLeft = settings.breakDuration * 60;
            breakModeBtn.classList.add('active');
            workModeBtn.classList.remove('active');
        }
        updateDisplay();
    }

    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();

            if (timeLeft <= 0) {
                completeTimer();
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }

    function resetTimer() {
        pauseTimer();
        timeLeft = isWorkMode ? settings.workDuration * 60 : settings.breakDuration * 60;
        updateDisplay();
    }

    function completeTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        
        // Play Sound
        try {
            alarmSound.play().catch(e => console.log("Audio play failed:", e));
        } catch (e) {
            console.error("Error playing audio:", e);
        }

        const msg = isWorkMode ? "Work session complete! Time for a break." : "Break over! Back to work.";
        sendNotification(msg);
    }

    // --- Clock & Calendar Logic ---

    function updateClock() {
        const now = new Date();
        digitalClock.textContent = now.toLocaleTimeString();
    }

    function renderCalendar() {
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        const today = now.getDate();

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        monthNameEl.textContent = monthNames[month];
        yearEl.textContent = year;

        // Clear previous cells
        calendarBody.innerHTML = '';

        // Headers (Su Mo Tu...)
        const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        days.forEach(day => {
            const div = document.createElement('div');
            div.classList.add('calendar-day-header');
            div.textContent = day;
            calendarBody.appendChild(div);
        });

        // Get first day of month and total days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Empty slots for days before the 1st
        for (let i = 0; i < firstDay; i++) {
            const div = document.createElement('div');
            div.classList.add('calendar-day', 'empty');
            calendarBody.appendChild(div);
        }

        // Day cells
        for (let i = 1; i <= daysInMonth; i++) {
            const div = document.createElement('div');
            div.classList.add('calendar-day');
            div.textContent = i;
            if (i === today) {
                div.classList.add('current-day');
            }
            calendarBody.appendChild(div);
        }
    }

    // --- Task Management (Persistence) ---

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('#task-list li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: false
            });
        });
        document.querySelectorAll('#completed-task-list li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: true
            });
        });
        localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const storedTasks = localStorage.getItem('pomodoroTasks');
        if (storedTasks) {
            const tasks = JSON.parse(storedTasks);
            tasks.forEach(task => createTaskElement(task.text, task.completed));
        }
    }

    function createTaskElement(text, completed = false) {
        const li = document.createElement('li');
        if (completed) li.classList.add('completed');
        
        const span = document.createElement('span');
        span.textContent = text;
        span.onclick = () => {
            li.classList.toggle('completed');
            // Move to appropriate list
            if (li.classList.contains('completed')) {
                completedTaskList.appendChild(li);
            } else {
                taskList.appendChild(li);
            }
            saveTasks();
        };
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>'; // FontAwesome Icon
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            li.style.animation = 'slideIn 0.3s reverse forwards'; 
            setTimeout(() => {
                li.remove();
                saveTasks();
            }, 300);
        };

        li.appendChild(span);
        li.appendChild(deleteBtn);
        
        if (completed) {
            completedTaskList.appendChild(li);
        } else {
            taskList.appendChild(li);
        }
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            createTaskElement(text);
            saveTasks();
            taskInput.value = '';
        }
    }

    // --- Settings & Theme Logic ---

    function loadSettings() {
        const storedSettings = localStorage.getItem('pomodoroSettings');
        if (storedSettings) {
            settings = { ...settings, ...JSON.parse(storedSettings) };
        }
        // Update Inputs
        workDurationInput.value = settings.workDuration;
        breakDurationInput.value = settings.breakDuration;
    }

    function saveSettings() {
        const newWork = parseFloat(workDurationInput.value);
        const newBreak = parseFloat(breakDurationInput.value);

        if (newWork > 0 && newBreak > 0) {
            settings.workDuration = newWork;
            settings.breakDuration = newBreak;
            localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
            
            // Close Modal
            settingsModal.style.display = "none";
            
            // Reset timer to reflect new settings immediately if paused
            if (!isRunning) {
                resetTimer();
            }
        } else {
            alert("Please enter valid positive numbers for duration.");
        }
    }

    function toggleTheme() {
        settings.darkMode = !settings.darkMode;
        applyTheme();
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    }

    function applyTheme() {
        if (settings.darkMode) {
            document.body.classList.add('dark-mode');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('dark-mode');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    // --- Event Listeners ---

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    workModeBtn.addEventListener('click', () => switchMode(true));
    breakModeBtn.addEventListener('click', () => switchMode(false));

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Settings Modal
    settingsToggleBtn.addEventListener('click', () => {
        settingsModal.style.display = "flex";
    });
    closeModalBtn.addEventListener('click', () => {
        settingsModal.style.display = "none";
    });
    window.addEventListener('click', (e) => {
        if (e.target == settingsModal) {
            settingsModal.style.display = "none";
        }
    });
    saveSettingsBtn.addEventListener('click', saveSettings);

    // Theme
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Initial State
    pauseBtn.disabled = true;
});
