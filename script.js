
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
let timeRemaining = 0;
let timerInterval = null;
const timerCountDown = document.getElementById("timerCountDown");
let initialTime = 0;

focusForm.addEventListener("submit", function(event){
    event.preventDefault();
    // focusTimerTaskName.textContent = task.name;
    const focusLengthInput = document.getElementById("focusLength");
    // store selected duration
    const focusMinutes = focusLengthInput.value;
    // converts string to a number
    const timerLength = Number(focusMinutes);
    // multiply by 60 because javascript uses seconds
    timeRemaining = timerLength * 60;
    initialTime = timeRemaining;
    updateTimerDisplay();
    focusDialogBox.close();
    // timer section becomes visible
    const focusTimer = document.getElementById("focusTimer");
    focusTimer.hidden = false;
    // make the timer go down
    startTimer();
});

// reusable function for start and resume button
function startTimer() {
    // stop any existing interval
    clearInterval(timerInterval);
    // make the timer go down
    timerInterval = setInterval(function(){
    // stops time from counting down past 0
    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        endButton.click();
    }
    else {
        timeRemaining--;
        updateTimerDisplay();
    }
    }, 1000);
};

// reusable function for formatting timer calculations
function updateTimerDisplay() {
     // 3600 seconds in an hour, using math.floor to calculate the amount of hours so time can display as 1:00:00
     const hours = Math.floor(timeRemaining / 3600);
     // find leftover seconds
     const leftoverSeconds = timeRemaining % 3600;
     // convert seconds into minutes
     const minutes = Math.floor(leftoverSeconds / 60);
     // last bit of seconds remainder
     const seconds = timeRemaining % 60;
     // format minutes and seconds to display a 0 in front of single digit numbers
     const formattedMinutes = String(minutes).padStart(2, "0");
     const formattedSeconds = String(seconds).padStart(2, "0");
     if (hours > 0) {
         timerCountDown.textContent = `${hours}:${formattedMinutes}:${formattedSeconds}`;
     }
     else {
         timerCountDown.textContent = `${formattedMinutes}:${formattedSeconds}`;
     }
};

// pause button
const pauseButton = document.getElementById("pause");

pauseButton.addEventListener("click", function(){
    if (pauseButton.textContent === "Pause") {
        clearInterval(timerInterval);
        // change button to say Resume
        pauseButton.textContent = "Resume";
    }
    else {
        startTimer();
        pauseButton.textContent = "Pause";
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
    // calculate time focused
    const elapsedSeconds = initialTime - timeRemaining;
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedRemainingSeconds = elapsedSeconds % 60;
    const formattedElapsedSeconds = String(elapsedRemainingSeconds).padStart(2, "0");
    elapsedTime.textContent = `${elapsedMinutes}:${formattedElapsedSeconds}`;
    focusingTask.totalFocusTime = focusingTask.totalFocusTime ?? 0;
    // adding time elapsed to totalFocusTime
    focusingTask.totalFocusTime += elapsedSeconds;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    const totalMinutes = Math.floor(focusingTask.totalFocusTime / 60);
    const totalRemainingSeconds = focusingTask.totalFocusTime % 60;
    const formattedTotalSeconds = String(totalRemainingSeconds).padStart(2, "0");
    totalTimeSpent.textContent = `${totalMinutes}:${formattedTotalSeconds}`;
    // show complete focus dialog box
    completeTaskDialog.showModal();
    const completeFocusTask = document.getElementById("completeFocusTask");
    completeFocusTask.textContent = focusingTask.name;
});

// close timer dialog box when "x" or close is clicked
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
    // use function to update timer
    updateTimerDisplay();
    addTimeBox.close();
});


// place string into savedTasks
const savedTasks = localStorage.getItem("tasks");
// place savedTasks back into an array and includes OR operator so it doesn't return null
const loadedTasks = JSON.parse(savedTasks) || [];
// array for tasks to go into
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
    const taskNameCell = document.createElement("td");
    const taskDateCell = document.createElement("td");
    const taskRecurringCell = document.createElement("td");
    // cell to hold edit button
    const taskActionsCell = document.createElement("td");
    // edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    // focus button
    const focusButton = document.createElement("button");
    focusButton.textContent = "Focus";
    // places new row inside table body
    taskNameCell.textContent = task.name;
    // changing date format
    const dateParts = task.date.split("-");
    const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
    taskDateCell.textContent = formattedDate;
    taskRecurringCell.textContent = task.recurring;
    taskRow.appendChild(taskNameCell);
    taskRow.appendChild(taskDateCell);
    taskRow.appendChild(taskRecurringCell);
    taskActionsCell.appendChild(editButton);
    taskActionsCell.appendChild(focusButton);
    taskRow.appendChild(taskActionsCell);

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
};

newTaskForm.addEventListener("submit", function(event){
    // no reloading
    event.preventDefault();
    const taskName = taskNameInput.value;
    const taskDate = taskDateInput.value;
    const recurring = recurringInput.value;

    // object containing the pieces
    const newTask = {
        name: taskName,
        date: taskDate,
        recurring: recurring,
        totalFocusTime: 0
    };

    if (editingTask !== null){
        editingTask.name = taskName;
        editingTask.date = taskDate;
        editingTask.recurring = recurring;
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
        displayTask(task);
    });
}

// reloads
refreshTasks();