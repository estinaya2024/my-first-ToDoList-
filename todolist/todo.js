 // Application State
        const state = {
            currentView: 'year',
            currentYear: new Date().getFullYear(),
            currentMonth: new Date().getMonth(),
            currentWeek: null,
            currentDay: null,
            breadcrumb: ['Year'],
            goals: JSON.parse(localStorage.getItem('goals')) || {},
            tasks: JSON.parse(localStorage.getItem('tasks')) || {},
            notes: JSON.parse(localStorage.getItem('notes')) || [],
            pomodoro: {
                timer: null,
                timeLeft: 25 * 60,
                isRunning: false,
                currentMode: 'pomodoro',
                completedPomodoros: parseInt(localStorage.getItem('completedPomodoros')) || 3,
                focusTime: parseInt(localStorage.getItem('focusTime')) || 135
            },
            settings: {
                pomodoroDuration: 25,
                shortBreakDuration: 5,
                longBreakDuration: 15
            },
            darkMode: localStorage.getItem('darkMode') === 'true'
        };

        // DOM Elements
        const elements = {
            // Views
            yearView: document.getElementById('yearView'),
            monthDetailView: document.getElementById('monthDetailView'),
            weekDetailView: document.getElementById('weekDetailView'),
            dayDetailView: document.getElementById('dayDetailView'),
            notesView: document.getElementById('notesView'),
            contentArea: document.getElementById('contentArea'),

            
            // Navigation
            navItems: document.querySelectorAll('.nav-item'),
            viewBtns: document.querySelectorAll('.view-btn'),
            
            // Header
            viewTitle: document.getElementById('viewTitle'),
            breadcrumb: document.getElementById('breadcrumb'),
            
            // Year Selection
            yearSelection: document.getElementById('yearSelection'),
            yearSelect: document.getElementById('yearSelect'),
            
            // Month Detail View
            prevMonth: document.getElementById('prevMonth'),
            nextMonth: document.getElementById('nextMonth'),
            currentMonth: document.getElementById('currentMonth'),
            weeksContainer: document.getElementById('weeksContainer'),
            addGoalBtn: document.getElementById('addGoalBtn'),
            
            // Week Detail View
            weekDetailTitle: document.getElementById('weekDetailTitle'),
            daysContainer: document.getElementById('daysContainer'),
            addTaskBtn: document.getElementById('addTaskBtn'),
            
            // Day Detail View
            dayDetailTitle: document.getElementById('dayDetailTitle'),
            dayTimeSlots: document.getElementById('dayTimeSlots'),
            addDayTaskBtn: document.getElementById('addDayTaskBtn'),
            
            // Notes View
            notesContainer: document.getElementById('notesContainer'),
            addNoteBtn: document.getElementById('addNoteBtn'),
            
            // Theme Toggle
            themeToggle: document.getElementById('themeToggle'),
            
            // Goal Modal
            goalModal: document.getElementById('goalModal'),
            closeGoalModal: document.getElementById('closeGoalModal'),
            cancelGoalBtn: document.getElementById('cancelGoalBtn'),
            goalForm: document.getElementById('goalForm'),
            goalId: document.getElementById('goalId'),
            goalWeek: document.getElementById('goalWeek'),
            goalDescription: document.getElementById('goalDescription'),
            goalPriority: document.getElementById('goalPriority'),
            saveGoalBtn: document.getElementById('saveGoalBtn'),
            goalModalTitle: document.getElementById('goalModalTitle'),
            
            // Task Modal
            taskModal: document.getElementById('taskModal'),
            closeTaskModal: document.getElementById('closeTaskModal'),
            cancelTaskBtn: document.getElementById('cancelTaskBtn'),
            taskForm: document.getElementById('taskForm'),
            taskId: document.getElementById('taskId'),
            taskDay: document.getElementById('taskDay'),
            taskTitle: document.getElementById('taskTitle'),
            taskDescription: document.getElementById('taskDescription'),
            taskDueTime: document.getElementById('taskDueTime'),
            taskPriority: document.getElementById('taskPriority'),
            taskCategory: document.getElementById('taskCategory'),
            taskDuration: document.getElementById('taskDuration'),
            saveTaskBtn: document.getElementById('saveTaskBtn'),
            taskModalTitle: document.getElementById('taskModalTitle'),
            
            // Note Modal
            noteModal: document.getElementById('noteModal'),
            closeNoteModal: document.getElementById('closeNoteModal'),
            cancelNoteBtn: document.getElementById('cancelNoteBtn'),
            noteForm: document.getElementById('noteForm'),
            noteId: document.getElementById('noteId'),
            noteTitle: document.getElementById('noteTitle'),
            noteContent: document.getElementById('noteContent'),
            saveNoteBtn: document.getElementById('saveNoteBtn'),
            noteModalTitle: document.getElementById('noteModalTitle'),
            
            // Pomodoro
            timerDisplay: document.getElementById('timerDisplay'),
            startBtn: document.getElementById('startBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            resetBtn: document.getElementById('resetBtn'),
            modeBtns: document.querySelectorAll('.mode-btn'),
            pomodoroCount: document.getElementById('pomodoroCount'),
            focusTime: document.getElementById('focusTime'),
            
            // Progress
            progressPercentage: document.getElementById('progressPercentage'),
            progressFill: document.getElementById('progressFill'),
            progressStats: document.getElementById('progressStats'),
            
            // Notification
            notification: document.getElementById('notification'),
            notificationText: document.getElementById('notificationText'),
            
        };

        // Initialize the application
        function init() {
            // Set dark mode if enabled
            if (state.darkMode) {
                document.body.classList.add('dark-mode');
            }
            
            setupEventListeners();
            renderYearView();
            updateProgress();
            updatePomodoroStats();
            createFloatingElements();
            populateYearSelect();
        }

        // Set up event listeners
        function setupEventListeners() {
            // Navigation
            elements.navItems.forEach(item => {
                item.addEventListener('click', () => switchView(item.dataset.view));
            });
            
            elements.viewBtns.forEach(btn => {
                btn.addEventListener('click', () => switchView(btn.dataset.view));
            });
            
            // Theme toggle
            elements.themeToggle.addEventListener('click', toggleDarkMode);
            
            // Year selection
            elements.yearSelect.addEventListener('change', (e) => {
                state.currentYear = parseInt(e.target.value);
                renderYearView();
            });
            
            // Month navigation
            elements.prevMonth.addEventListener('click', () => navigateMonth(-1));
            elements.nextMonth.addEventListener('click', () => navigateMonth(1));
            
            // Goal management
            elements.addGoalBtn.addEventListener('click', openAddGoalModal);
            elements.closeGoalModal.addEventListener('click', closeGoalModal);
            elements.cancelGoalBtn.addEventListener('click', closeGoalModal);
            elements.goalForm.addEventListener('submit', saveGoal);
            
            // Task management
            elements.addTaskBtn.addEventListener('click', openAddTaskModal);
            elements.addDayTaskBtn.addEventListener('click', openAddTaskModal);
            elements.closeTaskModal.addEventListener('click', closeTaskModal);
            elements.cancelTaskBtn.addEventListener('click', closeTaskModal);
            elements.taskForm.addEventListener('submit', saveTask);
            
            // Note management
            elements.addNoteBtn.addEventListener('click', openAddNoteModal);
            elements.closeNoteModal.addEventListener('click', closeNoteModal);
            elements.cancelNoteBtn.addEventListener('click', closeNoteModal);
            elements.noteForm.addEventListener('submit', saveNote);
            
            // Pomodoro timer
            elements.startBtn.addEventListener('click', startTimer);
            elements.pauseBtn.addEventListener('click', pauseTimer);
            elements.resetBtn.addEventListener('click', resetTimer);
            
            elements.modeBtns.forEach(btn => {
                btn.addEventListener('click', () => switchMode(btn.dataset.mode));
            });
        }

        // Switch between views
        function switchView(view) {
            state.currentView = view;
            
            // Update active nav items
            elements.navItems.forEach(item => {
                item.classList.toggle('active', item.dataset.view === view);
            });
            
            // Update active view buttons
            elements.viewBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.view === view);
            });
            
            // Show/hide year selection
            if (view === 'year') {
                elements.yearSelection.style.display = 'flex';
            } else {
                elements.yearSelection.style.display = 'none';
            }
            
            // Hide all views
            elements.yearView.style.display = 'none';
            elements.monthDetailView.style.display = 'none';
            elements.weekDetailView.style.display = 'none';
            elements.dayDetailView.style.display = 'none';
            elements.notesView.style.display = 'none';
            
            // Show current view
            switch(view) {
                case 'year':
                    elements.yearView.style.display = 'grid';
                    elements.viewTitle.textContent = "Year Planner";
                    updateBreadcrumb(['Year']);
                    renderYearView();
                    break;
                case 'month':
                    elements.monthDetailView.style.display = 'flex';
                    elements.viewTitle.textContent = "Month Planner";
                    updateBreadcrumb(['Year', getMonthName(state.currentMonth) + ' ' + state.currentYear]);
                    renderMonthDetailView();
                    break;
                case 'week':
                    elements.weekDetailView.style.display = 'flex';
                    elements.viewTitle.textContent = "Week Planner";
                    updateBreadcrumb(['Year', getMonthName(state.currentMonth) + ' ' + state.currentYear, 'Week ' + getWeekNumber(state.currentWeek)]);
                    renderWeekDetailView();
                    break;
                case 'day':
                    elements.dayDetailView.style.display = 'grid';
                    elements.viewTitle.textContent = "Day Planner";
                    updateBreadcrumb(['Year', getMonthName(state.currentMonth) + ' ' + state.currentYear, 'Week ' + getWeekNumber(state.currentWeek), formatDate(state.currentDay)]);
                    renderDayDetailView();
                    break;
                case 'notes':
                    elements.notesView.style.display = 'flex';
                    elements.viewTitle.textContent = "Notes";
                    updateBreadcrumb(['Notes']);
                    renderNotesView();
                    break;
            }
        }

        // Toggle dark mode
        function toggleDarkMode() {
            state.darkMode = !state.darkMode;
            document.body.classList.toggle('dark-mode', state.darkMode);
            localStorage.setItem('darkMode', state.darkMode);
        }

        // Populate year select dropdown
        function populateYearSelect() {
            const currentYear = new Date().getFullYear();
            const years = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
            
            elements.yearSelect.innerHTML = years.map(year => 
                `<option value="${year}" ${year === state.currentYear ? 'selected' : ''}>${year}</option>`
            ).join('');
        }

        // Update breadcrumb
        function updateBreadcrumb(items) {
            state.breadcrumb = items;
            elements.breadcrumb.innerHTML = '';
            
            items.forEach((item, index) => {
                const breadcrumbItem = document.createElement('div');
                breadcrumbItem.className = 'breadcrumb-item';
                breadcrumbItem.textContent = item;
                breadcrumbItem.dataset.level = index === 0 ? 'year' : 
                                              index === 1 ? 'month' : 
                                              index === 2 ? 'week' : 'day';
                
                breadcrumbItem.addEventListener('click', () => {
                    switch(breadcrumbItem.dataset.level) {
                        case 'year':
                            switchView('year');
                            break;
                        case 'month':
                            switchView('month');
                            break;
                        case 'week':
                            switchView('week');
                            break;
                        case 'day':
                            switchView('day');
                            break;
                    }
                });
                
                elements.breadcrumb.appendChild(breadcrumbItem);
                
                if (index < items.length - 1) {
                    const separator = document.createElement('div');
                    separator.className = 'breadcrumb-separator';
                    separator.innerHTML = '<i class="fas fa-chevron-right"></i>';
                    elements.breadcrumb.appendChild(separator);
                }
            });
        }

        // Render year view
        function renderYearView() {
            const year = state.currentYear;
            
            elements.yearView.innerHTML = `
                <div class="year-card" data-year="${year}">
                    <div class="year-header">
                        <div class="year-name">${year}</div>
                        <div class="year-stats">Planning Year</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                    <ul class="month-list">
                        ${Array.from({length: 12}, (_, i) => {
                            const monthName = new Date(year, i).toLocaleDateString('en-US', { month: 'long' });
                            const monthTasks = Object.values(state.tasks).flat().filter(task => {
                                const taskDate = new Date(task.day);
                                return taskDate.getFullYear() === year && taskDate.getMonth() === i;
                            });
                            
                            const monthCompleted = monthTasks.filter(task => task.completed).length;
                            
                            return `
                                <li class="month-item" data-year="${year}" data-month="${i}">
                                    <span>${monthName}</span>
                                    <span>${monthCompleted}/${monthTasks.length}</span>
                                </li>
                            `;
                        }).join('')}
                    </ul>
                </div>
            `;
            
            // Add event listeners to month items
            document.querySelectorAll('.month-item').forEach(item => {
                item.addEventListener('click', () => {
                    const year = parseInt(item.dataset.year);
                    const month = parseInt(item.dataset.month);
                    state.currentYear = year;
                    state.currentMonth = month;
                    switchView('month');
                });
            });
        }

        // Render month detail view
        function renderMonthDetailView() {
            const year = state.currentYear;
            const month = state.currentMonth;
            
            // Update month header
            const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            elements.currentMonth.textContent = monthName;
            
            // Get weeks in the month
            const weeks = getWeeksInMonth(year, month);
            
            // Render week cards
            elements.weeksContainer.innerHTML = weeks.map(week => {
                const weekKey = getWeekKey(week.start);
                const weekGoals = state.goals[weekKey] || [];
                const completedGoals = weekGoals.filter(goal => goal.completed).length;
                
                return `
                    <div class="week-card" data-week="${weekKey}">
                        <div class="week-header">
                            <div class="week-title">Week ${getWeekNumber(week.start)}</div>
                            <div class="week-dates">${formatDate(week.start)} - ${formatDate(week.end)}</div>
                        </div>
                        <ul class="week-goals">
                            ${weekGoals.length > 0 ? 
                                weekGoals.map(goal => `
                                    <li class="week-goal">
                                        <div class="week-goal-checkbox ${goal.completed ? 'checked' : ''}" data-goal-id="${goal.id}">
                                            ${goal.completed ? '<i class="fas fa-check"></i>' : ''}
                                        </div>
                                        <div class="week-goal-text ${goal.completed ? 'completed' : ''}">${goal.description}</div>
                                    </li>
                                `).join('') :
                                `<div class="empty-state">
                                    <i class="fas fa-bullseye"></i>
                                    <p>No goals yet. Add your first goal!</p>
                                </div>`
                            }
                        </ul>
                        ${weekGoals.length > 0 ? 
                            `<div class="progress-bar">
                                <div class="progress-fill" style="width: ${weekGoals.length > 0 ? Math.round((completedGoals / weekGoals.length) * 100) : 0}%"></div>
                            </div>` : ''
                        }
                    </div>
                `;
            }).join('');
            
            // Add event listeners to week cards
            document.querySelectorAll('.week-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('week-goal-checkbox')) {
                        const weekKey = card.dataset.week;
                        state.currentWeek = new Date(weekKey);
                        switchView('week');
                    }
                });
            });
            
            // Add event listeners to goal checkboxes
            document.querySelectorAll('.week-goal-checkbox').forEach(checkbox => {
                checkbox.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const goalId = checkbox.dataset.goalId;
                    toggleGoalCompletion(goalId);
                });
            });
        }

        // Navigate month
        function navigateMonth(direction) {
            state.currentMonth += direction;
            if (state.currentMonth < 0) {
                state.currentMonth = 11;
                state.currentYear--;
            } else if (state.currentMonth > 11) {
                state.currentMonth = 0;
                state.currentYear++;
            }
            renderMonthDetailView();
        }

        // Render week detail view
        function renderWeekDetailView() {
            const weekStart = state.currentWeek;
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            
            // Update week header
            elements.weekDetailTitle.textContent = `Week ${getWeekNumber(weekStart)}: ${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
            
            // Get days in the week
            const days = getDaysInWeek(weekStart);
            
            // Render day cards
            elements.daysContainer.innerHTML = days.map(day => {
                const dayKey = formatDate(day);
                const dayTasks = state.tasks[dayKey] || [];
                const completedTasks = dayTasks.filter(task => task.completed).length;
                
                return `
                    <div class="day-card" data-day="${dayKey}">
                        <div class="day-header">
                            <div class="day-title">${day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            <div class="day-date">${formatDate(day)}</div>
                        </div>
                        <div class="day-tasks">
                            ${dayTasks.length > 0 ? 
                                dayTasks.map(task => `
                                    <div class="day-task">
                                        <div class="day-task-checkbox ${task.completed ? 'checked' : ''}" data-task-id="${task.id}">
                                            ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                                        </div>
                                        <div class="day-task-text ${task.completed ? 'completed' : ''}">${task.title}</div>
                                    </div>
                                `).join('') :
                                `<div class="empty-state">
                                    <i class="fas fa-tasks"></i>
                                    <p>No tasks yet</p>
                                </div>`
                            }
                        </div>
                        ${dayTasks.length > 0 ? 
                            `<div class="progress-bar">
                                <div class="progress-fill" style="width: ${dayTasks.length > 0 ? Math.round((completedTasks / dayTasks.length) * 100) : 0}%"></div>
                            </div>` : ''
                        }
                    </div>
                `;
            }).join('');
            
            // Add event listeners to day cards
            document.querySelectorAll('.day-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('day-task-checkbox')) {
                        const dayKey = card.dataset.day;
                        state.currentDay = new Date(dayKey);
                        switchView('day');
                    }
                });
            });
            
            // Add event listeners to task checkboxes
            document.querySelectorAll('.day-task-checkbox').forEach(checkbox => {
                checkbox.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const taskId = checkbox.dataset.taskId;
                    toggleTaskCompletion(taskId);
                });
            });
        }

        // Render day detail view
        function renderDayDetailView() {
            const day = state.currentDay;
            const dayKey = formatDate(day);
            
            // Update day header
            elements.dayDetailTitle.textContent = day.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            
            // Get tasks for this day
            const dayTasks = state.tasks[dayKey] || [];
            
            // Create time slots
            let dayHTML = '';
            for (let hour = 0; hour < 24; hour++) {
                const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
                
                // Get tasks for this hour
                const hourTasks = dayTasks.filter(task => {
                    if (!task.dueTime) return false;
                    const taskHour = parseInt(task.dueTime.split(':')[0]);
                    return taskHour === hour;
                });
                
                dayHTML += `
                    <div class="time-slot-full">
                        <div class="time-label">${timeLabel}</div>
                        <div class="task-slot ${hourTasks.length > 0 ? 'has-task' : ''}" data-hour="${hour}">
                            ${hourTasks.map(task => `
                                <div class="task-item" data-id="${task.id}">
                                    <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTaskCompletion('${task.id}')">
                                        ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                                    </div>
                                    <div class="task-content">
                                        <div class="task-title">${task.title}</div>
                                        <div class="task-meta">
                                            ${task.dueTime ? `<span><i class="far fa-clock"></i> ${task.dueTime}</span>` : ''}
                                            <span class="task-priority priority-${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                                        </div>
                                    </div>
                                    <div class="task-actions">
                                        <button class="task-action-btn" onclick="editTask('${task.id}')"><i class="fas fa-edit"></i></button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            
            elements.dayTimeSlots.innerHTML = dayHTML;
            
            // Add event listeners to empty task slots
            document.querySelectorAll('.task-slot:not(.has-task)').forEach(slot => {
                slot.addEventListener('click', () => {
                    const hour = parseInt(slot.dataset.hour);
                    openAddTaskModal();
                    const dueTimeInput = document.getElementById('taskDueTime');
                    dueTimeInput.value = `${hour.toString().padStart(2, '0')}:00`;
                });
            });
        }

        // Render notes view
        function renderNotesView() {
            const notes = state.notes;
            
            if (notes.length === 0) {
                elements.notesContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-sticky-note"></i>
                        <p>No notes yet. Add your first note!</p>
                    </div>
                `;
                return;
            }
            
            elements.notesContainer.innerHTML = notes.map(note => `
                <div class="note-card" data-note-id="${note.id}">
                    <div class="note-header">
                        <div class="note-title">${note.title}</div>
                        <div class="note-date">${new Date(note.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div class="note-content">${note.content}</div>
                    <div class="note-actions">
                        <button class="note-action-btn" onclick="editNote('${note.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="note-action-btn" onclick="deleteNote('${note.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Open add goal modal
        function openAddGoalModal() {
            elements.goalModalTitle.textContent = "Add Week Goal";
            elements.goalForm.reset();
            elements.goalId.value = '';
            elements.goalWeek.value = getWeekKey(state.currentWeek);
            elements.goalModal.style.display = 'flex';
        }

        // Close goal modal
        function closeGoalModal() {
            elements.goalModal.style.display = 'none';
        }

        // Save goal
        function saveGoal(e) {
            e.preventDefault();
            
            const goalData = {
                id: elements.goalId.value || generateId(),
                description: elements.goalDescription.value,
                priority: elements.goalPriority.value,
                week: elements.goalWeek.value,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            if (elements.goalId.value) {
                // Update existing goal
                const weekGoals = state.goals[goalData.week] || [];
                const index = weekGoals.findIndex(goal => goal.id === elements.goalId.value);
                weekGoals[index] = goalData;
                state.goals[goalData.week] = weekGoals;
                showNotification('Goal updated successfully!');
            } else {
                // Add new goal
                if (!state.goals[goalData.week]) {
                    state.goals[goalData.week] = [];
                }
                state.goals[goalData.week].push(goalData);
                showNotification('Goal added successfully!');
            }
            
            saveToLocalStorage();
            renderMonthDetailView();
            closeGoalModal();
        }

        // Toggle goal completion
        function toggleGoalCompletion(goalId) {
            // Find the goal in state.goals
            for (const weekKey in state.goals) {
                const goals = state.goals[weekKey];
                const goal = goals.find(g => g.id === goalId);
                if (goal) {
                    goal.completed = !goal.completed;
                    saveToLocalStorage();
                    renderMonthDetailView();
                    
                    if (goal.completed) {
                        showNotification('Goal completed! Great job! 🌸');
                    }
                    return;
                }
            }
        }

        // Open add task modal
        function openAddTaskModal() {
            elements.taskModalTitle.textContent = "Add New Task";
            elements.taskForm.reset();
            elements.taskId.value = '';
            elements.taskDay.value = formatDate(state.currentDay);
            elements.taskModal.style.display = 'flex';
        }

        // Close task modal
        function closeTaskModal() {
            elements.taskModal.style.display = 'none';
        }

        // Save task
        function saveTask(e) {
            e.preventDefault();
            
            const taskData = {
                id: elements.taskId.value || generateId(),
                title: elements.taskTitle.value,
                description: elements.taskDescription.value,
                dueTime: elements.taskDueTime.value,
                priority: elements.taskPriority.value,
                category: elements.taskCategory.value,
                duration: elements.taskDuration.value,
                day: elements.taskDay.value,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            if (elements.taskId.value) {
                // Update existing task
                const dayTasks = state.tasks[taskData.day] || [];
                const index = dayTasks.findIndex(task => task.id === elements.taskId.value);
                dayTasks[index] = taskData;
                state.tasks[taskData.day] = dayTasks;
                showNotification('Task updated successfully!');
            } else {
                // Add new task
                if (!state.tasks[taskData.day]) {
                    state.tasks[taskData.day] = [];
                }
                state.tasks[taskData.day].push(taskData);
                showNotification('Task added successfully!');
            }
            
            saveToLocalStorage();
            renderWeekDetailView();
            renderDayDetailView();
            updateProgress();
            closeTaskModal();
        }

        // Edit task
        function editTask(id) {
            // Find the task in state.tasks
            for (const dayKey in state.tasks) {
                const tasks = state.tasks[dayKey];
                const task = tasks.find(t => t.id === id);
                if (task) {
                    elements.taskModalTitle.textContent = "Edit Task";
                    elements.taskId.value = task.id;
                    elements.taskTitle.value = task.title;
                    elements.taskDescription.value = task.description || '';
                    elements.taskDueTime.value = task.dueTime || '';
                    elements.taskPriority.value = task.priority;
                    elements.taskCategory.value = task.category;
                    elements.taskDuration.value = task.duration || '';
                    elements.taskDay.value = task.day;
                    
                    elements.taskModal.style.display = 'flex';
                    return;
                }
            }
        }

        // Toggle task completion
        function toggleTaskCompletion(id) {
            // Find the task in state.tasks
            for (const dayKey in state.tasks) {
                const tasks = state.tasks[dayKey];
                const task = tasks.find(t => t.id === id);
                if (task) {
                    task.completed = !task.completed;
                    saveToLocalStorage();
                    renderWeekDetailView();
                    renderDayDetailView();
                    updateProgress();
                    
                    if (task.completed) {
                        showNotification('Task completed! Great job! 🌸');
                    }
                    return;
                }
            }
        }

        // Open add note modal
        function openAddNoteModal() {
            elements.noteModalTitle.textContent = "Add New Note";
            elements.noteForm.reset();
            elements.noteId.value = '';
            elements.noteModal.style.display = 'flex';
        }

        // Close note modal
        function closeNoteModal() {
            elements.noteModal.style.display = 'none';
        }

        // Save note
        function saveNote(e) {
            e.preventDefault();
            
            const noteData = {
                id: elements.noteId.value || generateId(),
                title: elements.noteTitle.value,
                content: elements.noteContent.value,
                createdAt: new Date().toISOString()
            };
            
            if (elements.noteId.value) {
                // Update existing note
                const index = state.notes.findIndex(note => note.id === elements.noteId.value);
                state.notes[index] = noteData;
                showNotification('Note updated successfully!');
            } else {
                // Add new note
                state.notes.push(noteData);
                showNotification('Note added successfully!');
            }
            
            saveToLocalStorage();
            renderNotesView();
            closeNoteModal();
        }

        // Edit note
        function editNote(id) {
            const note = state.notes.find(n => n.id === id);
            if (note) {
                elements.noteModalTitle.textContent = "Edit Note";
                elements.noteId.value = note.id;
                elements.noteTitle.value = note.title;
                elements.noteContent.value = note.content;
                elements.noteModal.style.display = 'flex';
            }
        }

        // Delete note
        function deleteNote(id) {
            if (confirm('Are you sure you want to delete this note?')) {
                state.notes = state.notes.filter(note => note.id !== id);
                saveToLocalStorage();
                renderNotesView();
                showNotification('Note deleted successfully!');
            }
        }

        // Generate unique ID
        function generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        // Update progress
        function updateProgress() {
            const allTasks = Object.values(state.tasks).flat();
            const totalTasks = allTasks.length;
            const completedTasks = allTasks.filter(task => task.completed).length;
            const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            elements.progressPercentage.textContent = `${percentage}%`;
            elements.progressFill.style.width = `${percentage}%`;
            elements.progressStats.textContent = `Completed: ${completedTasks}/${totalTasks} tasks`;
        }

        // Pomodoro timer functions
        function startTimer() {
            if (state.pomodoro.isRunning) return;
            
            state.pomodoro.isRunning = true;
            state.pomodoro.timer = setInterval(() => {
                state.pomodoro.timeLeft--;
                updateTimerDisplay();
                
                if (state.pomodoro.timeLeft === 0) {
                    clearInterval(state.pomodoro.timer);
                    state.pomodoro.isRunning = false;
                    
                    if (state.pomodoro.currentMode === 'pomodoro') {
                        state.pomodoro.completedPomodoros++;
                        state.pomodoro.focusTime += state.settings.pomodoroDuration;
                        updatePomodoroStats();
                        savePomodoroToLocalStorage();
                        
                        if (state.pomodoro.completedPomodoros % 4 === 0) {
                            switchMode('longBreak');
                            showNotification('Great work! Time for a long break! 🌸');
                        } else {
                            switchMode('shortBreak');
                            showNotification('Pomodoro completed! Time for a short break! 🌸');
                        }
                    } else {
                        switchMode('pomodoro');
                        showNotification('Break is over! Time to focus! 💪');
                    }
                    
                    // Play notification sound
                    playNotificationSound();
                }
            }, 1000);
        }

        function pauseTimer() {
            clearInterval(state.pomodoro.timer);
            state.pomodoro.isRunning = false;
        }

        function resetTimer() {
            clearInterval(state.pomodoro.timer);
            state.pomodoro.isRunning = false;
            setTimerDuration();
            updateTimerDisplay();
        }

        function switchMode(mode) {
            state.pomodoro.currentMode = mode;
            resetTimer();
            
            // Update active mode button
            elements.modeBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.mode === mode);
            });
        }

        function setTimerDuration() {
            switch(state.pomodoro.currentMode) {
                case 'pomodoro':
                    state.pomodoro.timeLeft = state.settings.pomodoroDuration * 60;
                    break;
                case 'shortBreak':
                    state.pomodoro.timeLeft = state.settings.shortBreakDuration * 60;
                    break;
                case 'longBreak':
                    state.pomodoro.timeLeft = state.settings.longBreakDuration * 60;
                    break;
            }
        }

        function updateTimerDisplay() {
            const minutes = Math.floor(state.pomodoro.timeLeft / 60);
            const seconds = state.pomodoro.timeLeft % 60;
            elements.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        function updatePomodoroStats() {
            elements.pomodoroCount.textContent = state.pomodoro.completedPomodoros;
            
            const hours = Math.floor(state.pomodoro.focusTime / 60);
            const minutes = state.pomodoro.focusTime % 60;
            
            if (hours > 0) {
                elements.focusTime.textContent = `${hours}h ${minutes}m`;
            } else {
                elements.focusTime.textContent = `${minutes}m`;
            }
        }

        function playNotificationSound() {
            // In a real app, you would play a sound here
            console.log("Notification sound played");
        }

        // Helper functions
        function getMonthName(monthIndex) {
            return new Date(2000, monthIndex).toLocaleDateString('en-US', { month: 'long' });
        }

        function formatDate(date) {
            if (!date) return '';
            const d = new Date(date);
            return d.toISOString().split('T')[0];
        }

        function getWeekNumber(date) {
            const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
            const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
            return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        }

        function getWeekKey(date) {
            return formatDate(date);
        }

        function getWeeksInMonth(year, month) {
            const weeks = [];
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            
            let currentWeekStart = new Date(firstDay);
            // Adjust to Sunday as start of week
            currentWeekStart.setDate(firstDay.getDate() - firstDay.getDay());
            
            while (currentWeekStart <= lastDay) {
                const currentWeekEnd = new Date(currentWeekStart);
                currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
                
                // Only add weeks that include days from the current month
                if (currentWeekStart.getMonth() === month || currentWeekEnd.getMonth() === month) {
                    weeks.push({
                        start: new Date(currentWeekStart),
                        end: new Date(currentWeekEnd)
                    });
                }
                
                currentWeekStart.setDate(currentWeekStart.getDate() + 7);
            }
            
            return weeks;
        }

        function getDaysInWeek(weekStart) {
            const days = [];
            const currentDay = new Date(weekStart);
            
            for (let i = 0; i < 7; i++) {
                days.push(new Date(currentDay));
                currentDay.setDate(currentDay.getDate() + 1);
            }
            
            return days;
        }

        // Show notification
        function showNotification(message) {
            elements.notificationText.textContent = message;
            elements.notification.classList.add('show');
            
            setTimeout(() => {
                elements.notification.classList.remove('show');
            }, 3000);
        }

        // Create floating elements
        function createFloatingElements() {
            const floatingContainer = document.getElementById('floatingElements');
            const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--primary-light)'];
            
            for (let i = 0; i < 15; i++) {
                const element = document.createElement('div');
                const size = Math.random() * 80 + 20;
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                element.classList.add('floating-element');
                element.style.width = `${size}px`;
                element.style.height = `${size}px`;
                element.style.background = color;
                element.style.top = `${Math.random() * 100}%`;
                element.style.left = `${Math.random() * 100}%`;
                element.style.animationDelay = `${Math.random() * 10}s`;
                element.style.animationDuration = `${Math.random() * 30 + 20}s`;
                
                floatingContainer.appendChild(element);
            }
        }

        // Local storage functions
        function saveToLocalStorage() {
            localStorage.setItem('goals', JSON.stringify(state.goals));
            localStorage.setItem('tasks', JSON.stringify(state.tasks));
            localStorage.setItem('notes', JSON.stringify(state.notes));
        }

        function savePomodoroToLocalStorage() {
            localStorage.setItem('completedPomodoros', state.pomodoro.completedPomodoros.toString());
            localStorage.setItem('focusTime', state.pomodoro.focusTime.toString());
        }

        document.addEventListener('DOMContentLoaded', init);