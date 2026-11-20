
// task page greeting
const taskGreeting = document.getElementById("taskGreeting");
taskGreeting.textContent = `${savedName}'s tasks `;
const taskEmoji = document.getElementById("taskEmoji");
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
// generate random number between 0 and 51
const randomIndex = Math.floor(Math.random() * letters.length);
// place letter from letters using randomIndex into randomLetter 
const randomLetter = letters[randomIndex];
taskEmoji.textContent = randomLetter;


// new task button
const newTaskButton = document.getElementById("newTask");

const newTaskDialog = document.getElementById("newTaskDialogBox");

// focus dialog box
const focusDialogBox = document.getElementById("focusDialogBox");
const focusModeTaskName = document.getElementById("focusModeTaskName");

// delete button
const deleteTaskButton = document.getElementById("deleteTaskButton");

const deleteConfirmDialog = document.getElementById("deleteConfirmDialog");

deleteTaskButton.addEventListener("click", function(){
    deleteConfirmDialog.showModal();
});

// when new task button is clicked it will open dialog box
newTaskButton.addEventListener("click", function(){
    newTaskDialog.showModal();
    submitTaskButton.value = "Create Task"
    editingTask = null;
    deleteTaskButton.hidden = true;
    newTaskForm.reset();
});

// cancel delete button
const cancelDeleteTaskButton = document.getElementById("cancelDeleteTaskButton");

cancelDeleteTaskButton.addEventListener("click", function(){
    deleteConfirmDialog.close();
});

// actually delete task
const deleteTaskButtonConfirm = document.getElementById("deleteTaskButtonConfirm");

deleteTaskButtonConfirm.addEventListener("click", function(){
    let taskIndex = tasks.indexOf(editingTask);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        // convert array into a string so it can save to localStorage
        localStorage.setItem("tasks", JSON.stringify(tasks));
        // reloads
        refreshTasks();
        deleteConfirmDialog.close();
        newTaskDialog.close();
        editingTask = null;
    }
});

// submit task button
const submitTaskButton = document.getElementById("submitTaskButton");

// close dialog box when "x" or cancel is clicked
const closeDialogButton = document.getElementById("closeButton");
const cancelDialogButton = document.getElementById("cancelButton");

closeDialogButton.addEventListener("click", function(){
    newTaskDialog.close();
});

cancelDialogButton.addEventListener("click", function(){
    newTaskDialog.close();
});

// close focus dialog box when "x" or cancel is clicked
const closeFocusButtonDialog = document.getElementById("closeFocusButtonDialog");
const focusCancelButton = document.getElementById("focusCancelButton");

closeFocusButtonDialog.addEventListener("click", function(){
    focusDialogBox.close();
});

focusCancelButton.addEventListener("click", function(){
    focusDialogBox.close();
});

// when start is clicked on focus dialog box
const focusForm = document.getElementById("focusForm");
const focusTimerTaskName = document.getElementById("focusTimerTaskName");
// timer section
const focusTimer = document.getElementById("focusTimer");
let timeRemaining = 0;
let timerInterval = null;
const timerCountDown = document.getElementById("timerCountDown");
let initialTime = 0;
const savedFocusSession = localStorage.getItem("focusSession");
const loadedFocusSession = JSON.parse(savedFocusSession) || null;
const focusSession = loadedFocusSession || {
    // place to know which task is being focused on
    taskId: null,
    remainingTime: 0,
    isPaused: false,
    elapsedTime: 0,
};

focusForm.addEventListener("submit", function(event){
    event.preventDefault();
    focusSession.taskId = focusingTask.id;
    focusTimerTaskName.textContent = focusingTask.name;
    const focusLengthInput = document.getElementById("focusLength");
    // store selected duration
    const focusMinutes = focusLengthInput.value;
    // converts string to a number
    const timerLength = Number(focusMinutes);
    // multiply by 60 because javascript uses seconds
    /* 
    
    TEST CODE to MAKE TIMER BE JUST 1 MINUTE LONG 
    DELETE LATER
    
    */
    //  timeRemaining = 60;
    timeRemaining = timerLength * 60;
    initialTime = timeRemaining;
    focusSession.remainingTime = timeRemaining;
    // reset elapsed time to 0 for focusSession
    focusSession.elapsedTime = 0;
    focusSession.isPaused = false;
    // when focus session is started initial information is saved
    localStorage.setItem("focusSession", JSON.stringify(focusSession));
    updateTimerDisplay();
    focusDialogBox.close();
    // makes sure it says pause instead of resume when new focus session starts
    pauseButton.textContent = "Pause";
    // timer becomes visible
    focusTimer.hidden = false;
    // make the timer go down
    startTimer();
});

// reusable function for start and resume button
function startTimer() {
    // stop any existing interval
    clearInterval(timerInterval);
    // stores when timer was started or resumed into startTime ** Date.now gives milliseconds
    const startTime = Date.now();
    // stores how much time was left when startTimer was called
    const startTimeRemaining = timeRemaining;
    // make the timer go down
    timerInterval = setInterval(function(){
        // stores what time it is now in currentTime
        const currentTime = Date.now();
        // calculate time passed and store into elapsed seconds (1000 used to convert milliseconds into seconds)
        const elapsedSeconds = (currentTime - startTime) / 1000;
        // update the countdown, rounds remaining seconds to whole number using Math.ceil, and prevents remaining time from being negative using Math.max
        timeRemaining = Math.max(0, Math.ceil(startTimeRemaining - elapsedSeconds));
        focusSession.remainingTime = timeRemaining;
        focusSession.elapsedTime = initialTime - timeRemaining;
        localStorage.setItem("focusSession", JSON.stringify(focusSession));
        updateTimerDisplay();
        // stops time from counting down past 0
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            endButton.click();
        }
    }, 1000);
};

// function that calls formatTime to update the timer
function updateTimerDisplay() {
    timerCountDown.textContent = formatTime(timeRemaining);
};

// pause button
const pauseButton = document.getElementById("pause");

pauseButton.addEventListener("click", function(){
    if (pauseButton.textContent === "Pause") {
        clearInterval(timerInterval);
        focusSession.isPaused = true;
        localStorage.setItem("focusSession", JSON.stringify(focusSession));
        // change button to say Resume
        pauseButton.textContent = "Resume";
    }
    else {
        startTimer();
        pauseButton.textContent = "Pause";
        focusSession.isPaused = false;
        localStorage.setItem("focusSession", JSON.stringify(focusSession));
    }
});

// end button
const endButton = document.getElementById("end");
const completeTaskDialog = document.getElementById("completeTaskDialog");
const elapsedTime = document.getElementById("elapsedTime");
const totalTimeSpent = document.getElementById("totalTimeSpent");

endButton.addEventListener("click", function(){
    // stop timer
    clearInterval(timerInterval);
    // hide focus timer
    focusTimer.hidden = true;
    // calculate how many seconds user spent focusing
    const elapsedSeconds = initialTime - timeRemaining;
    // use formatTime() to properly format time spent focusing
    elapsedTime.textContent = formatTime(elapsedSeconds);
    // if task has a total focus time keep it, if not initialize to 0 so NaN doesn't show up
    focusingTask.totalFocusTime = focusingTask.totalFocusTime ?? 0;
    // adding time elapsed to totalFocusTime
    focusingTask.totalFocusTime += elapsedSeconds;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.removeItem("focusSession");
    focusSession.taskId = null;
    // refresh to update task data
    refreshTasks();
    // using formatTime() to properly display total time spent
    totalTimeSpent.textContent = formatTime(focusingTask.totalFocusTime);
    // show complete focus dialog box
    completeTaskDialog.showModal();
    const completeFocusTask = document.getElementById("completeFocusTask");
    // task name
    completeFocusTask.textContent = focusingTask.name;
});

// close "Good Job!" timer dialog box when "x" or close is clicked
const closeFinishedFocusButton = document.getElementById("closeFinishedFocusButton");
const closeFinishedFocusButton2 = document.getElementById("closeFinishedFocusButton2");

closeFinishedFocusButton.addEventListener("click", function(){
    completeTaskDialog.close();
});

closeFinishedFocusButton2.addEventListener("click", function(){
    completeTaskDialog.close();
});

// add time button
const addTime = document.getElementById("addTime");
const addTimeBox = document.getElementById("addTimeBox");
const addTimeForm = document.getElementById("addTimeForm");

addTime.addEventListener("click", function(){
    addTimeBox.showModal();
});

// add time cancel button
const addTimeCancelButton = document.getElementById("addTimeCancelButton");

addTimeCancelButton.addEventListener("click", function(){
    addTimeBox.close();
});

// add time form
addTimeForm.addEventListener("submit", function(event){
    event.preventDefault();
    const addTimeAmount = document.getElementById("addTimeAmount");
    const additionalMinutes = Number(addTimeAmount.value);
    const additionalSeconds = additionalMinutes * 60;
    // adds time selected to timer
    timeRemaining += additionalSeconds;
    // update initial time as well so the timer wont reflect that you spent an inaccurate amount of time
    initialTime += additionalSeconds;
    focusSession.remainingTime = timeRemaining;
    localStorage.setItem("focusSession", JSON.stringify(focusSession));
    // use function to update timer
    updateTimerDisplay();
    if (pauseButton.textContent === "Pause") {
        startTimer()
    }
    addTimeBox.close();
});



// place string into savedTasks
const savedTasks = localStorage.getItem("tasks");
// place savedTasks back into an array and includes OR operator so it doesn't return null
const loadedTasks = JSON.parse(savedTasks) || [];
// readability
const tasks = loadedTasks;

let editingTask = null;
let focusingTask = null;

// retrieve task name
const taskNameInput = document.getElementById("taskName");

// date
const taskDateInput = document.getElementById("taskDate");

// recurring
const recurringInput = document.getElementById("recurring");

// detect when user submits form
const newTaskForm = document.getElementById("newTaskForm");

// finds the tables body
const taskTableBody = document.querySelector("tbody");

// function for displaying tasks
function displayTask(task) {
    // show tasks on HTML table
    // creates new table row and table data
    const taskRow = document.createElement("tr");
    // cell to hold name column
    const taskNameCell = document.createElement("td");
    // cell to hold date column
    const taskDateCell = document.createElement("td");
    // cell to hold progress column (time spent)
    const taskFocusCell = document.createElement("td");
    // edit button
    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.setAttribute("aria-label", "Edit");
    // focus button
    const focusButton = document.createElement("button");
    focusButton.classList.add("focus-button");
    focusButton.setAttribute("aria-label", "Focus");
    // complete button
    const completeButton = document.createElement("button");
    completeButton.classList.add("complete-button");
    completeButton.setAttribute("aria-label", "Complete");
    // places new row inside table body
    taskNameCell.textContent = task.name;
    // places focus time spent into taskFocusCell with proper formatting using formatTime()
    taskFocusCell.textContent = formatTime(task.totalFocusTime);
    // changing date format
    const dateParts = task.date.split("-");
    const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
    taskDateCell.textContent = formattedDate;
    taskRow.appendChild(taskNameCell);
    taskRow.appendChild(taskDateCell);
    taskRow.appendChild(taskFocusCell);
    // edit button in task name column
    taskNameCell.appendChild(editButton);
    // focus button in progress column
    taskFocusCell.appendChild(focusButton);
    taskFocusCell.appendChild(completeButton);
    taskTableBody.appendChild(taskRow);

    // when edit button is clicked
    editButton.addEventListener("click", function(){
        console.log(task.name);
        newTaskDialog.showModal();
        submitTaskButton.value = "Save Changes"
        taskNameInput.value = task.name;
        taskDateInput.value = task.date;
        recurringInput.value = task.recurring;
        editingTask = task;
        deleteTaskButton.hidden = false;
    });

    // when focus button is clicked
    focusButton.addEventListener("click", function(){
        focusDialogBox.showModal();
        focusingTask = task;
        focusModeTaskName.textContent = task.name;
    });

    const completeTaskConfirmDialog = document.getElementById("completeTaskConfirmDialog");
    const completeConfirmButton = document.getElementById("completeConfirm");
    const cancelCompleteButton = document.getElementById("cancelComplete");

    // when complete button is clicked
    completeButton.addEventListener("click", function(){
        completeTaskConfirmDialog.showModal()
        // confirm complete task
        completeConfirmButton.addEventListener("click", function(){
            // if task is not recurring
            if (task.recurring === "None") {
                // sets whether it is completed to true
                task.completed = true;
                const today = new Date();
                // get month from Date and add 1 because months start at 0
                const month = today.getMonth() + 1;
                // get year
                const year = today.getFullYear();
                // get current day, convert to string, and add a 0 if needed
                const formattedDay = String(today.getDate()).padStart(2, "0");
                // convert month to string, and add a 0 if needed
                const formattedMonth = String(month).padStart(2, "0");
                // store date in YYYY-MM-DD format before formatting it for display on webpage
                const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
                // place formattedDate (date completed) into dateCompleted in task object
                task.dateCompleted = formattedDate;
                // saves updated task array to local storage
                localStorage.setItem("tasks", JSON.stringify(tasks));
                // refreshes page and now shows incomplete tasks
                refreshTasks();
            }
            else {
                // for recurring tasks
                const nextDate = new Date(task.date);
                // if tasks recurs daily
                if (task.recurring === "Daily") {
                    // getUTCDate retrieves date and adds 1 day, update the Date object with new day using setUTCDate
                    nextDate.setUTCDate(nextDate.getUTCDate() + 1);
                }
                // if tasks recurs weekly
                else if (task.recurring === "Weekly") {
                    // getUTCDate retrieves date and adds 7 days, update the Date object with new day using setUTCDate
                    nextDate.setUTCDate(nextDate.getUTCDate() + 7);
                }
                // if task recurs monthly
                else if (task.recurring === "Monthly") {
                    // find last day of the following month
                    const lastDayOfNextMonth = new Date(Date.UTC(nextDate.getUTCFullYear(), nextDate.getUTCMonth() + 2, 0));
                    // retrieve the day of the month and place in variable last day
                    const lastDay = lastDayOfNextMonth.getUTCDate();
                    // use the user's original day selected unless the month doesn't have that many days, else use last available day
                    const targetDay = Math.min(task.originalDay, lastDay);
                    // changes nextDate to the 1st day of its current month
                    nextDate.setUTCDate(1);
                     // getUTCMonth retrieves month, update the Date object with the next month using setUTCMonth
                    nextDate.setUTCMonth(nextDate.getUTCMonth() + 1);
                    // changes nextDate to targetDay after it rolls over to the next month
                    nextDate.setUTCDate(targetDay);
                }
                // nextDate.toISOString converts Date into String, .slice takes the 1st 10 characters and updates task's due date
                task.date = nextDate.toISOString().slice(0,10);
                localStorage.setItem("tasks", JSON.stringify(tasks));
                refreshTasks();
            }
            completeTaskConfirmDialog.close();
        });

        cancelCompleteButton.addEventListener("click", function() {
            completeTaskConfirmDialog.close();
        });
        
    });
};

// new task submit
newTaskForm.addEventListener("submit", function(event){
    // no reloading
    event.preventDefault();
    const taskName = taskNameInput.value;
    const taskDate = taskDateInput.value;
    const recurring = recurringInput.value;

    // object containing the pieces
    const newTask = {
        // id to recognize which tasks belongs
        id: crypto.randomUUID(),
        name: taskName,
        date: taskDate,
        recurring: recurring,
        totalFocusTime: 0,
        completed: false,
        // keep track of date set on task
        // split the fate into an array and retrieve the day
        // Number() converts the day from a string into a number
        originalDay: Number(taskDate.split("-")[2]),
        dateCompleted: null
    };

    if (editingTask !== null){
        editingTask.name = taskName;
        editingTask.date = taskDate;
        editingTask.recurring = recurring;
        // if task due date is edited, this will update the original day
        editingTask.originalDay = Number(taskDate.split("-")[2]);
    }
    else {
        // placing new task into tasks array
        tasks.push(newTask);
    };

    // convert array into a string so it can save to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // clears and rebuilds the table
    refreshTasks();
    // close the dialog after submitting
    newTaskDialog.close();
    newTaskForm.reset();
});

function refreshTasks(){
    // clear the table
    taskTableBody.innerHTML = "";
    // sorts tasks into earliest date first
    tasks.sort(function(a, b){
        return a.date.localeCompare(b.date);
    });

    // finds the table's body
    tasks.forEach(function(task){
        if (!task.completed) {
            displayTask(task);
        };
    });
}

// reloads
refreshTasks();


if (focusSession.taskId !== null) {
    const foundTask = tasks.find(function(task) {
        return task.id === focusSession.taskId;
    });
    if (foundTask) {
        focusingTask = foundTask;
        timeRemaining = focusSession.remainingTime;
        initialTime = focusSession.elapsedTime + timeRemaining;
        updateTimerDisplay();
        focusTimer.hidden = false;
        pauseButton.textContent = "Resume";
        focusSession.isPaused = true;
        localStorage.setItem("focusSession", JSON.stringify(focusSession));
        focusTimerTaskName.textContent = focusingTask.name;
    }
}