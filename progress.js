/* progress page javascript */

const savedTasks = localStorage.getItem("tasks");
// place savedTasks back into an array and includes OR operator so it doesn't return null
const loadedTasks = JSON.parse(savedTasks) || [];

// filters to return incomplete tasks with focus time more than 0
const inProgressTasks = loadedTasks.filter(function(task){
    return task.completed === false && task.totalFocusTime > 0;
});

// filters to just return completed tasks
const completedTasks = loadedTasks.filter(function(task){
    return task.completed;
});

 // get current date (month and year) and format it
 const now = new Date();
 const month = String(now.getMonth() + 1).padStart(2, '0');
 const year = now.getFullYear();
 const formatted = `${year}-${month}`

// filters to just return completed tasks during the month
const monthlyCompletedTasks = completedTasks.filter(function(task){
    return task.dateCompleted && task.dateCompleted.slice(0, 7) === formatted;
});

// places amount of completed tasks in monthlyCompletedCount
const monthlyCompletedCount = monthlyCompletedTasks.length;
const numberCompleted = document.getElementById("numberCompleted");
numberCompleted.textContent = monthlyCompletedCount;

// in progress task table
const inProgressTaskTableBody = document.querySelector("#inProgressBody");

function inProgressTask(task) {
    const inProgressTaskRow = document.createElement("tr");
    // cell to hold in progress column
    const inProgressTaskCell = document.createElement("td");
    // cell to hold in progress time spent column
    const inProgressTimeSpentCell = document.createElement("td");

    inProgressTaskCell.textContent = task.name;
    inProgressTimeSpentCell.textContent = formatTime(task.totalFocusTime);

    inProgressTaskRow.appendChild(inProgressTaskCell);
    inProgressTaskRow.appendChild(inProgressTimeSpentCell);
    inProgressTaskTableBody.appendChild(inProgressTaskRow);
};

// sorts tasks from most time spent to least
inProgressTasks.sort(function(a, b){
    return b.totalFocusTime - a.totalFocusTime;
});

// loop through filtered array
inProgressTasks.forEach(function(task){
    inProgressTask(task);
});

// collapsible button for progress table
const progressTableButton = document.getElementById("progressTableButton");

progressTableButton.addEventListener("click", function(){
    // ! reverses boolean value, if hidden is false it becomes true, vice versa
    inProgressTaskTableBody.hidden = !inProgressTaskTableBody.hidden;
    // change aria-expanded for screen readers to know if table is open or closed
    progressTableButton.setAttribute("aria-expanded", !inProgressTaskTableBody.hidden);
});

// completed task table
const completedTaskTableBody = document.querySelector("#completedBody");

// progress page completed task table
function completedTask(task) {
    const completedTaskRow = document.createElement("tr");
    // cell to hold completed column
    const completedTaskCell = document.createElement("td");
    // cell to hold time spent column
    const completedTimeSpentCell = document.createElement("td");
    // cell to hold date completed column
    const completedDateCell = document.createElement("td");

    completedTaskCell.textContent = task.name;
    // places focus time spent into completedTimeSpentCell with proper formatting using formatTime()
    completedTimeSpentCell.textContent = formatTime(task.totalFocusTime);
    // changing date format
    const completedDateParts = task.dateCompleted.split("-");
    const completedFormattedDate = `${completedDateParts[1]}/${completedDateParts[2]}/${completedDateParts[0]}`;
    completedDateCell.textContent = completedFormattedDate;

    completedTaskRow.appendChild(completedTaskCell);
    completedTaskRow.appendChild(completedTimeSpentCell);
    completedTaskRow.appendChild(completedDateCell);
    completedTaskTableBody.appendChild(completedTaskRow);
}

// sorts tasks into latest date first
completedTasks.sort(function(a, b){
    return b.dateCompleted.localeCompare(a.dateCompleted);
});

// loop through filtered array
completedTasks.forEach(function(task){
    completedTask(task);
});

// collapsible button for completed table
const completedTableButton = document.getElementById("completedTableButton");

completedTableButton.addEventListener("click", function(){
    // ! reverses boolean value, if hidden is false it becomes true, vice versa
    completedTaskTableBody.hidden = !completedTaskTableBody.hidden;
    // change aria-expanded for screen readers to know if table is open or closed
    completedTableButton.setAttribute("aria-expanded", !completedTaskTableBody.hidden);
});
